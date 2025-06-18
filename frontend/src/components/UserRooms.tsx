'use client'

export default function UserRooms() {
    return (
        <div className='bg-[rgba(255,255,255,0.1)] flex justify-center w-full max-w-[480px] h-[650px] flex-col rounded-lg p-2'>
            <div className=" w-full flex">
                <div className="flex-1 h-[50] flex justify-between gap-1 items-center">
                    <input type="" className="bg-[rgba(255,255,255,0.1)] h-full text-white p-1 flex-1 rounded-lg" />
                    <button className="bg-[rgba(250,250,250,0.7)] w-[50] h-full flex justify-center flex-col rounded-full text-5xl text-white">
                        
                    </button>


                </div>
            </div>
            <div className="flex-1 w-full ">
                <div className="w-full h-[65px] border-b-2 border-[rgba(255,255,255,0.2)] flex text-white items-center p-2">
                    Title
                </div>
                <div className="w-full h-[65px] border-b-2 border-[rgba(255,255,255,0.2)] flex text-white items-center p-2">
                    Title
                </div>
                <div className="w-full h-[65px] border-b-2 border-[rgba(255,255,255,0.2)] flex text-white items-center p-2">
                    Title
                </div>
            

            </div>
            
        </div>
    );
}
