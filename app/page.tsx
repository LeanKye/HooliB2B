import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Templates from "@/components/sections/Templates";
import Pricing from "@/components/sections/Pricing";
import Process from "@/components/sections/Process";
import Partners from "@/components/sections/Partners";
import Contact, { Footer } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Templates />
      <Pricing />
      <Process />
      <Partners />
      <Contact />
      <Footer />
    </main>
  );
}
