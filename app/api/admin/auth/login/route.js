import { handleAdminLogin } from "./handler";

export async function POST(request) {
  return handleAdminLogin(request);
}
