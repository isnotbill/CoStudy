import Link from 'next/link'

const MainHeader = () => {
    return (
        <>
        <header className="select-none flex justify-between items-center p-[4px] text-[rgb(242,247,253)]  w-full px-10">
            <Link href="/home" className="font-cedarville font-thin text-[35px]">
                costudy
            </Link>
            <Link href="/settings" passHref>
                <button
                    className="bg-none border-gray-300 border text-gray-300 px-4 py-1 rounded-xl font-kumbh font-normal text-[18px] cursor-pointer transition-colors duration-200 hover:bg-[#ffffff1e]">
                    Settings
                </button>
            </Link>
        </header>
        </>
    );
}

export default MainHeader;
