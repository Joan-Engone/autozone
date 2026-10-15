import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Inventory from "@/components/sections/Inventory";
import HowItWorks from "@/components/sections/Howitworks";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Inventory />
        <HowItWorks />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}