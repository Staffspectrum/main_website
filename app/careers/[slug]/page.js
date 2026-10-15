import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { getPublishedJobs, getPublishedJobBySlug } from "../../../lib/data/jobs";
import JobDetailClient from "./JobDetailClient";

// Allow dynamic generation for newly published jobs and instant 404 for closed/unpublished jobs
export const dynamicParams = true;
export const revalidate = 0;

// Generate static params for initial build
export async function generateStaticParams() {
  const jobs = await getPublishedJobs();
  return jobs.map((job) => ({
    slug: job.linkSlug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const job = await getPublishedJobBySlug(resolvedParams.slug);

  if (!job) {
    return {
      title: "Job Opening Not Found | Staffspectrum Careers",
      description: "The requested career opportunity could not be found.",
    };
  }

  return {
    title: `${job.title} - Careers at Staffspectrum | ${job.location}`,
    description: job.desc,
  };
}

export default async function JobDetailPage({ params }) {
  const resolvedParams = await params;
  const job = await getPublishedJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <JobDetailClient job={job} />
      </main>
      <Footer />
    </>
  );
}
