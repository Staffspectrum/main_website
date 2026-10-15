import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BlogClient from "./BlogClient";

export const metadata = {
  title: "Blog & Insights | Staffspectrum",
  description: "Read the latest insights on recruitment, HR systems, practical training, compliance, and scaling businesses from the team at Staffspectrum.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <BlogClient />
      </main>
      <Footer />
    </>
  );
}
