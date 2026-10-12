import readline from "readline";
import bcrypt from "bcryptjs";
import { getPrismaClient } from "../lib/prisma.js";

function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      if (arg.includes("=")) {
        const [key, ...vals] = arg.slice(2).split("=");
        args[key] = vals.join("=");
      } else {
        const key = arg.slice(2);
        const nextArg = argv[i + 1];
        if (nextArg && !nextArg.startsWith("--")) {
          args[key] = nextArg;
          i++;
        } else {
          args[key] = true;
        }
      }
    }
  }
  return args;
}

function promptLine(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

function promptHidden(query) {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      // Non-interactive or piped input
      promptLine(query).then(resolve);
      return;
    }

    process.stdout.write(query);
    let password = "";
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    const onData = (char) => {
      if (char === "\n" || char === "\r" || char === "\u0004") {
        process.stdin.setRawMode(false);
        process.stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(password);
      } else if (char === "\u0003") {
        // Ctrl+C
        process.stdin.setRawMode(false);
        process.exit(1);
      } else if (char === "\b" || char === "\x7f") {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else {
        password += char;
        process.stdout.write("*");
      }
    };

    process.stdin.on("data", onData);
  });
}

export function validateAdminPassword(password) {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password cannot be empty." };
  }

  // Check bcrypt 72-byte ceiling BEFORE hashing
  const byteLength = Buffer.byteLength(password, "utf8");
  if (byteLength > 72) {
    return {
      valid: false,
      error: `Password exceeds bcrypt's 72-byte limit (was ${byteLength} bytes). Please choose a password of 72 bytes or fewer.`,
    };
  }

  // Enforce documented policy: Minimum 10 characters with upper, lower, and digit
  if (password.length < 10) {
    return {
      valid: false,
      error: "Password must be at least 10 characters long.",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one uppercase letter (A-Z).",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one lowercase letter (a-z).",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one numeric digit (0-9).",
    };
  }

  return { valid: true };
}

export async function provisionAdminAccount({
  email,
  password,
  name = "Administrator",
  force = false,
  prismaClient = null,
} = {}) {
  const prisma = prismaClient || getPrismaClient();
  if (!prisma) {
    throw new Error("Database is not configured (DATABASE_URL missing).");
  }

  const normalizedEmail = (email || "").trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    throw new Error("A valid email address is required.");
  }

  const validation = validateAdminPassword(password);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Overwrite Protection: verify whether user already exists
  const existing = await prisma.adminUser.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing && !force) {
    throw new Error(
      `Admin user "${normalizedEmail}" already exists. Pass force=true (or CLI flag --force) to update this existing account.`
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    const updated = await prisma.adminUser.update({
      where: { email: normalizedEmail },
      data: {
        passwordHash,
        name: (name || existing.name).trim(),
      },
    });
    return { action: "updated", user: updated };
  } else {
    const created = await prisma.adminUser.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: (name || "Administrator").trim(),
        role: "ADMIN",
      },
    });
    return { action: "created", user: created };
  }
}

async function main() {
  const args = parseArgs();

  let email = (args.email || process.env.INITIAL_ADMIN_EMAIL || "").trim().toLowerCase();
  if (!email) {
    email = await promptLine("Enter admin email address: ");
  }

  if (!email || !email.includes("@")) {
    console.error("Error: A valid email address is required.");
    process.exit(1);
  }

  let name = (args.name || process.env.INITIAL_ADMIN_NAME || "").trim();
  if (!name) {
    name = (await promptLine("Enter admin display name [Administrator]: ")) || "Administrator";
  }
  if (!name) name = "Administrator";

  let password = process.env.INITIAL_ADMIN_PASSWORD || "";

  // Warn if password was supplied on CLI arguments
  if (args.password) {
    console.warn(
      "SECURITY WARNING: Passing passwords via CLI arguments exposes them in shell history and process tables. Prefer interactive prompts or INITIAL_ADMIN_PASSWORD environment variables."
    );
    password = args.password;
  }

  if (!password) {
    password = await promptHidden("Enter admin password (min 10 chars, uppercase, lowercase, digit): ");
  }

  const force = Boolean(args.force);

  console.log(`Setting up admin user for: ${email}...`);

  try {
    const result = await provisionAdminAccount({
      email,
      password,
      name,
      force,
    });

    console.log(
      `Admin account "${result.user.email}" (ID: ${result.user.id}) ${result.action} successfully.`
    );
    const prisma = getPrismaClient();
    if (prisma) await prisma.$disconnect?.();
    process.exit(0);
  } catch (err) {
    console.error("Setup error:", err.message);
    process.exit(1);
  }
}

import path from "path";
import { fileURLToPath } from "url";

// Only execute main CLI if run directly
const isDirectRun =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)).toLowerCase() ===
    path.resolve(process.argv[1]).toLowerCase();

if (isDirectRun) {
  main().catch((err) => {
    console.error("Fatal error:", err?.message);
    process.exit(1);
  });
}
