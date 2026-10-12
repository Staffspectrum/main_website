import { handleAdminGetJobs, handleAdminCreateJob } from "./handler";

export async function GET(request) {
  return handleAdminGetJobs(request);
}

export async function POST(request) {
  return handleAdminCreateJob(request);
}
