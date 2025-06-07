import Image from 'next/image'
import MainHeader from '@/components/MainHeader'

export default function HomePage(){
    return (
        <>
        <main className='bg-[rgb(53,46,78)] w-screen h-screen flex flex-col items-center'>
            <MainHeader/>
            <div className='flex flex-col gap-4 w-full h-full justify-center items-center p-4'>
                <div className='relative flex items-center justify-start gap-4 bg-[rgb(70,60,102)] rounded-3xl w-[1000] h-[200]'>
                    <div className="flex-none border-8 border-[rgb(70,60,102)]  bg-white w-min-[200px] w-[200px] min-h-[200px] h-[200px] rounded-full">

                    </div>
                    <h1 className="text-white text-3xl">Username</h1>
                </div>
                <div className='w-[1000] h-full flex gap-4'>
                    <div className='bg-[rgb(70,60,102)] w-[500] h-full rounded-3xl'>

                    </div>
                    <div className='bg-[rgb(70,60,102)] w-[500] h-full rounded-3xl'>

                    </div>
                </div>
            </div>
            
            
        </main>
        </>
    );
}
