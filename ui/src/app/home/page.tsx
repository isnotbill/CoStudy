import DotGridBackground from "@/components/layout/FloatingSupplies"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <>
      <Header />
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-glow-mesh pt-20 pb-5">
        <div className="absolute inset-0 z-0 from-[#513d9b]">
          <DotGridBackground />
        </div>


      </section>
    </>
  )
}
