import Link from 'next/link'

const MainHeader = () => {
    return (
        <>
        <header className="flex justify-between items-center p-[5px] text-[rgb(242,247,253)] bg-[rgb(70,60,102)] border-b-2 border-[rgb(58,52,77)] w-full px-10">
            <h1 className="font-cedarville font-thin text-[45px]">
                costudy
            </h1>
            <Link href="/settings" passHref>
                <button
                    className="border-none bg-[rgb(244,249,253)] text-[rgb(72,23,112)] px-[40px] py-1 rounded-[30px] font-kumbh font-normal text-[20px] cursor-pointer transition-colors duration-200 hover:bg-[#d4d4d4]">
                    Settings
                </button>
            </Link>
        </header>
        </>
    );
}

export default MainHeader;
