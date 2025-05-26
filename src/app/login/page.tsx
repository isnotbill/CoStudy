import Image from 'next/image'

export default function Login() {
    return (
    <>
    <main className='bg-[rgb(70,60,102)] h-screen'>
        <div className='flex justify-center items-center h-full'>
            <form className="flex flex-col justify-center items-center bg-gray-100 h-[700] w-[500] gap-12 px-28 rounded-l-xl">
                <h1 className='font-cedarville text-4xl text-[rgba(49,32,77,0.8)] text-center'>costudy</h1>
                <div className='flex flex-col w-full gap-2'>
                    <div className='w-full'>
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
                    </div>
                    <div className='w-full'>
                        <div className="flex flex-col">
                            <label htmlFor="username" className="text-[rgba(49,32,77,0.8)] font-medium">
                                Password
                            </label>
                            <input
                                type="text"
                                id="password"
                                placeholder="Enter password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div> 
                    </div>
                </div>
                <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition">
                        Log In
                    </button>
            </form>
            <div className='bg-purple-950 h-[700] w-[500] rounded-r-xl'>

            </div>
        </div>
    </main>
    </>
    );
}
