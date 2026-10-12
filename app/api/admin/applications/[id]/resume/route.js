import { handleAdminGetResume } from "./handler";

export async function GET(request, { params }) {
  return handleAdminGetResume(request, params);
}
