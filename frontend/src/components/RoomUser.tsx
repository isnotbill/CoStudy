import Image from "next/image"

interface RoomUserInterface {
    isClient: boolean
    isAdmin: boolean
    username: string
    iconImage: string
    isAdminClient: boolean
    onKick: (username: string) => void
}
export default function RoomUser(props: RoomUserInterface){

    // const clientColor = props.isClient ? "text-green-400" : "text-white"

    return (
        <> 
            <div className="ml-8 mt-3 flex items-center gap-2">

                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white">
                    <Image 
                    src={`https://api.costudy.online/avatars/${props.iconImage}`}
                    alt="User icon image"
                    fill
                    />
                </div>
                <h1 className={`text-white text-[18px]`}>{props.username}</h1>
                {props.isAdmin 
                && (
                <div className="text-[rgba(255,206,45,0.87)] text-[10px]"> [ ADMIN ] </div>)}

                {props.isAdminClient && !props.isClient && (
                    <button
                    onClick={() => props.onKick(props.username)} 
                    className=" ml-2 text-red-500 text-xs border border-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white">
                        KICK
                    </button>
                )}
            </div>

        </>
    )
}