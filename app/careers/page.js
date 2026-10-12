import CareersContent from "./CareersContent";
import { getPublishedJobs } from "../../lib/data/jobs";

// Ensure real-time freshness when jobs are published, unpublished or closed
export const revalidate = 0;

export const metadata = {
  title: "Careers | Staff Spectrum",
  description:
    "Explore career opportunities at Staff Spectrum. We align top-tier talent with excellent growth-driven opportunities in Engineering, Human Resources, Creative and Editorial fields.",
};

export default async function CareersPage() {
  const publishedJobs = await getPublishedJobs();
  return <CareersContent initialJobs={publishedJobs} />;
}
