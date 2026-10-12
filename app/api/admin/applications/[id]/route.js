import {
  handleAdminGetApplicationById,
  handleAdminDeleteApplication,
} from "./handler";

export async function GET(request, { params }) {
  return handleAdminGetApplicationById(request, params);
}

export async function DELETE(request, { params }) {
  return handleAdminDeleteApplication(request, params);
}
