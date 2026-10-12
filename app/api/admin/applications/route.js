import { handleAdminGetApplications } from "./handler";

export async function GET(request) {
  return handleAdminGetApplications(request);
}
