import Link from 'next/link';
import Head from 'next/head';

const Header = () => {
  return (
    <>
    <header className="flex justify-center items-center p-[4px] text-[rgb(242,247,253)] bg-[rgb(70,60,102)]">
      <h1 className="font-cedarville font-thin text-[35px] mx-[80px]">
        costudy
      </h1>

      <div className="flex items-center gap-[80px] font-kumbh font-medium text-[10px] mr-[100px]">
        <Link href="/" className="text-[#dfebf7] text-[17px] no-underline hover:text-[#d6d6d6] hover:underline">
          Home
        </Link>

        <Link href="/about" className="text-[#dfebf7] text-[17px] no-underline hover:text-[#d6d6d6] hover:underline">
          About Us
        </Link>

        <Link href="/login" passHref>
          <button
            className="border-none bg-[rgb(244,249,253)] text-[rgb(72,23,112)] px-[40px] py-1 rounded-[30px] font-kumbh font-normal text-[17px] cursor-pointer transition-colors duration-200 hover:bg-[#d4d4d4]"
          >
            Login
          </button>
        </Link>
      </div>
    </header>
        </>
  );
};

export default Header;
