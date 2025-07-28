
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatInterface{
  content: string
  isClient: boolean
  username: string
  iconImage: string
  type: string
}

export default function ChatMessage(props: ChatInterface){

  // SERVER message
  if (props.type === "SERVER"){
    return (
      <p className="
          relative my-1 flex items-center justify-center select-none
          text-xs font-medium tracking-wide text-gray-300
        ">
        <span className="flex-1 h-px bg-gray-300/40" />

        <span className="mx-3 whitespace-nowrap">
          {props.content}
        </span>

        <span className="flex-1 h-px bg-gray-300/40" />
      </p>
    )
  } else if (props.type === "AI") {
    return (
      <div className="flex items-start gap-2">

          <div className="relative w-12 h-12 overflow-hidden rounded-full  mt-[5px] border-yellow-500 border-2">
            <Image
            src="/images/IconAI.png"
            alt="Profile icon"
            fill
            className="object-cover"
            />
          </div>

          <div className="flex flex-col items-start ">
            <label className="text-yellow-500">AI Tutor</label>
            {/* <div className="bg-[rgba(185,229,241,0.95)] rounded-3xl p-2 max-w-xs break-words">
                {props.content}
            </div> */}
            <div className="bg-[rgba(185,229,241,0.95)] rounded-3xl p-2 max-w-xs break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ ...props }) => (
                    <pre
                      {...props}
                      className="whitespace-pre-wrap break-words overflow-x-auto rounded-md bg-gray-800 p-4 text-sm font-mono text-green-300 shadow-md"
                    />
                  ),
                  code: ({ ...props }) => (
                    <code
                      {...props}
                      className="whitespace-pre-wrap break-words rounded bg-gray-800 px-1 py-0.5 font-mono text-sm text-green-400"
                    />
                  ),
                  li: ({ ...props }) => (
                    <li
                      {...props}
                      className="space-y-reverse space-y-2"
                    />
                  ),
                }}
              >
                {props.content}
              </ReactMarkdown>
            </div>

          </div>


      </div>
    )
  }

  // USER message
  return (
    <>

      {props.isClient
      ? (<div className="flex justify-end items-start gap-2">

          <div className="bg-[rgba(226,121,255,0.92)] rounded-3xl p-2 flex justify-end max-w-xs break-words break-all">
            {props.content}
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

          <div className="relative w-12 h-12 overflow-hidden rounded-full bg-white mt-[5px] border-red border-[1px]">
            <Image
            src={props.iconImage}
            alt="Profile icon"
            fill
            className="object-cover"
            />
          </div>

          <div className="flex flex-col items-start ">
            <label className="text-white">{props.username}</label>
            <div className="bg-[rgba(255,255,255,0.91)] rounded-3xl p-2 max-w-xs break-words break-all">
              {props.content}
            </div>
          </div>


      </div>)}

    </>

  )
}
