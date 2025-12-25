import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/layout/About"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <section className="bg-[#0e1116] flex justify-center items-center">
          <AboutSection />
        </section>
      </main>
    </>
  );
}
