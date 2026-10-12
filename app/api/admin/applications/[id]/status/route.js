import { handleAdminUpdateApplicationStatus } from "./handler";

export async function PATCH(request, { params }) {
  return handleAdminUpdateApplicationStatus(request, params);
}
