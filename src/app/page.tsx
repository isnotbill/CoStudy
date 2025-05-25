import Image from "next/image";
import Header from "@/components/Header"

export default function Home() {
  return (
    <main className="h-screen flex flex-col">
      <Header/>

      <section className="flex-1 bg-[rgb(70,60,102)] flex items-center justify-center gap-[50px]">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white font-cedarville text-5xl font-normal">Study Together, Stress-Free</h1>
          <Image 
            src="/images/heroimage.svg"
            alt="img"
            width={600}
            height={800}
          />
        </div>
        <form className="bg-[rgb(255,255,255,0.8)] w-full max-w-[400px] min-w-[300px] h-[500px] px-[20] gap-8 rounded-2xl flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-[rgba(49,32,77,0.8)] text-center">Create Your Account</h2>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-[rgba(49,32,77,0.8)] font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Your username"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-[rgba(49,32,77,0.8)] font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                minLength={8}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="confirm-password" className="text-[rgba(49,32,77,0.8)] font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                minLength={8}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>
      </section>
    </main>
  );
}
