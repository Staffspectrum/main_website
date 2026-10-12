import { handleAdminUpdateJobStatus } from "./handler";

export async function PATCH(request, { params }) {
  return handleAdminUpdateJobStatus(request, params);
}
