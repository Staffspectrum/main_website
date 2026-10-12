import { handleAdminUpdateEnquiryStatus } from "./handler";

export async function PATCH(request, { params }) {
  return handleAdminUpdateEnquiryStatus(request, params);
}
