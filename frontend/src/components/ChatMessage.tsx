
import Image from "next/image"

interface ChatInterface{
  content: string
  isClient: boolean
  username: string
  iconImage: string
}

export default function ChatMessage(props: ChatInterface){

  return (
    <>

      {props.isClient
      ? (<div className="flex justify-end items-start gap-2">

          <div className="flex flex-col items-end ">
            {/* <label className="text-white">{props.username}</label> */}
            <div className="bg-[rgba(206,133,255,0.92)] rounded-3xl p-2 flex justify-end max-w-xs break-all">
                {props.content}
            </div>
          </div>

          {/* <div className="w-12 h-12 rounded-full bg-white overflow-hidden mt-[4px]">
            <Image
            src={props.iconImage}
            alt="Profile icon"
            width={56}
            height={56}
            />
          </div> */}
      </div>)


      : (<div className="flex items-start gap-2">

          <div className="w-11 h-11 rounded-full bg-white overflow-hidden mt-[5px]">
            <Image
            src={`http://localhost:8080/avatars/${props.iconImage}`}
            alt="Profile icon"
            width={48}
            height={48}
            />
          </div>

          <div className="flex flex-col items-start ">
            <label className="text-white">{props.username}</label>
            <div className="bg-[rgba(255,255,255,0.91)] rounded-3xl p-2 max-w-xs break-all">
                {props.content}
            </div>
          </div>


      </div>)}

    </>

  )
}