import React from 'react'
import { Link } from 'react-router'
import owl from "../assets/owlAI/1.png"
function SignupBoard() {
  return (
    <div className="flex flex-col fixed right-0 w-full  top-10 h-[70vh] justify-center transition-all duration-300 ease-in-out"  >
        <div className='flex justify-center  items-center w-full h-[50%]' >
        <img className='h-full aspect-square' src={owl} alt="" srcset="" />
        </div>
       <div className=' flex justify-center items-center text-2xl  w-full h-[10%]'>
         <h1>SignIn to Unleash multiple personalities of your OWL</h1>
       </div>
       <div className='flex justify-center items-center   w-full h-[10%]' >
        <Link to={"/login"}><button className='w-[90px] hover:bg-[#8d8a8a] hover:scale-110 transition-all duration-200 rounded-2xl !text-black h-[30px] bg-white'>Sign-IN</button></Link>
       </div>
    </div>
  )
}

export default SignupBoard