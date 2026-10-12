import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ServicesClient from "./ServicesClient";

export const metadata = {
  title: "Our HR Solutions | Staffspectrum - Complete HR Solutions for Growing Businesses",
  description: "Staffspectrum provides end-to-end HR Solutions including Recruitment & Talent Acquisition, HR Consulting, Operations, Compliance, Employee Engagement, Performance Management, HR Outsourcing, and Digital HR Solutions.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <ServicesClient />
      </main>
      <Footer />
    </>
  );
}
