import MainHeader from "@/components/MainHeader"
import Image from "next/image"


export default function NotFound(){
  return(
    <div className="h-screen w-screen flex flex-col">
      <MainHeader />
      <div className="flex h-full w-full items-center justify-center bg-[rgb(141,144,184)] text-black">
        <Image 
          src="/images/404blob.png"
          alt="img"
          width={300}
          height={400}
        />
        <p>Room code not found</p>
      </div>
    </div>
  )
}