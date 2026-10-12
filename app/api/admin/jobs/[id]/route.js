import {
  handleAdminGetJobById,
  handleAdminUpdateJob,
  handleAdminDeleteJob,
} from "./handler";

export async function GET(request, { params }) {
  return handleAdminGetJobById(request, params);
}

export async function PUT(request, { params }) {
  return handleAdminUpdateJob(request, params);
}

export async function DELETE(request, { params }) {
  return handleAdminDeleteJob(request, params);
}
