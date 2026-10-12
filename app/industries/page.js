import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import IndustriesClient from "./IndustriesClient";
import { Suspense } from "react";

export const metadata = {
  title: "Industries We Serve | Staff Spectrum",
  description: "Explore our specialised recruitment and HR solutions across 12 key global industries including Technology, Retail, Hospitality, BFSI, and Healthcare.",
};

export default function IndustriesPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#111111" }}></div>}>
          <IndustriesClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
