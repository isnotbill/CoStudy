import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full bg-transparent text-[#f2f7fd] py-4 px-6 select-none">
      <div className="max-w-7xl mx-auto flex justify-center items-center gap-2 sm:gap-16 flex-wrap md:flex-nowrap flex-col md:flex-row">
        {/* Logo */}
        <h1 className="font-cedarville text-[32px] md:text-[32px] lg:text-[36px] font-thin text-center">
          costudy
        </h1>

        {/* Navigation + Button */}
        <div className="flex items-center justify-center gap-6 md:gap-10 text-[15px] md:text-[17px] font-kumbh font-medium flex-wrap">
          <Link
            href="/"
            className="text-[#dfebf7] no-underline hover:text-[#d6d6d6] hover:underline transition duration-150"
          >
            Home
          </Link>

          <Link
            href="/#about"
            className="text-[#dfebf7] no-underline hover:text-[#d6d6d6] hover:underline transition duration-150"
          >
            About Us
          </Link>

          <Link href="/login" passHref>
            <button className="bg-[#f4f9fd] text-[#481770] px-6 py-1.5 rounded-full font-normal text-[15px] md:text-[17px] hover:bg-[#d4d4d4] transition-colors duration-200 shadow-sm">
              Login
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
