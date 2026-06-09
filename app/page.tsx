import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Inventory from "@/components/sections/Inventory";
import TrustRibbon from "@/components/sections/TrustRibbon";
import Consultation from "@/components/sections/Consultation";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Inventory />
        <TrustRibbon />
        <Consultation />
      </main>
      <Footer />
    </>
  );
}