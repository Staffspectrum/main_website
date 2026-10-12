import { handleAdminDeleteEnquiry } from "./handler";

export async function DELETE(request, { params }) {
  return handleAdminDeleteEnquiry(request, params);
}
