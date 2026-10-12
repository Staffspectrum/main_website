import { handleAdminGetEnquiries } from "./handler";

export async function GET(request) {
  return handleAdminGetEnquiries(request);
}
