import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import TrustStrip from "../components/TrustStrip/TrustStrip";
import WhoWeAre from "../components/WhoWeAre/WhoWeAre";
import WhatWeDo from "../components/WhatWeDo/WhatWeDo";
import Services from "../components/Services/Services";
import Featured from "../components/Featured/Featured";
import WhyTrust from "../components/WhyTrust/WhyTrust";
import IndustriesSection from "../components/IndustriesSection/IndustriesSection";
import Process from "../components/Process/Process";
import Testimonials from "../components/Testimonials/Testimonials";
import FinalCTA from "../components/FinalCTA/FinalCTA";
import Footer from "../components/Footer/Footer";
import AnniversaryLoader from "../components/AnniversaryLoader/AnniversaryLoader";

export default function Home() {
  return (
    <>
      <AnniversaryLoader />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <WhoWeAre />
        <WhatWeDo />
        <Services />
        <Featured />
        <WhyTrust />
        <IndustriesSection />
        <Process />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
