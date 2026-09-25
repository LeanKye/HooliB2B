import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Pricing from "@/components/sections/Pricing";
import Process from "@/components/sections/Process";
import Partners from "@/components/sections/Partners";
import Contact, { Footer } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Pricing />
      <Process />
      <Partners />
      <Contact />
      <Footer />
    </main>
  );
}
