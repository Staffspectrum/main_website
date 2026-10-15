"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data.details ? `${data.error}: ${data.details}` : (data.error || "Login failed. Please verify your credentials.");
        throw new Error(message);
      }

      // Login successful, redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogoWrap}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <Image
              src="/logo.png"
              alt="Staffspectrum"
              width={36}
              height={36}
              priority
            />
            <span className={styles.brandTitle}>
              Staff<span className={styles.brandAccent}>spectrum</span>
            </span>
          </div>
          <h1 className={styles.loginTitle}>Admin Portal</h1>
          <p className={styles.loginSubtitle}>
            Secure administration &amp; applicant management
          </p>
        </div>

        {errorMessage && (
          <div className={styles.alertBox} role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formGrid} suppressHydrationWarning>
          <div className={styles.formField}>
            <label className={styles.formLabel} htmlFor="admin-email">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              className={styles.formInput}
              placeholder="admin@staff-spectrum.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              suppressHydrationWarning
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel} htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className={styles.formInput}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={isLoading}
            style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", padding: "0.85rem" }}
            suppressHydrationWarning
          >
            {isLoading ? "Signing in..." : "Sign In to Admin Panel"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link
            href="/"
            style={{ color: "#94a3b8", fontSize: "0.85rem", textDecoration: "none" }}
          >
            &larr; Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
