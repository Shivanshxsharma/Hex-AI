import React from 'react'
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Link } from 'react-router';
function Apikeypopup({apikeyfound}) {
  return (
    <div  style={{
      transition: "all 0.4s ease",
      transform: !apikeyfound ? "scale(1) translateY(0)" : "scale(0.75) translateY(20px)",
      opacity: !apikeyfound ? 1 : 0,
    }}
 className='w-[30vw] h-[30vh] fixed top-[30vh] transition-all duration-200 gap-10 left-[35vw] rounded-3xl bottom-0-[50vh] flex flex-col shadow-2xl border-5 border-[#2e2e2e] shadow-black justify-center items-center bg-[#000000] z-30'>
     <h1>No api keys found</h1>
     <Link to={"/configure_keys"} ><button className='w-[200px] h-[45px] hover:bg-blue-800 transition-all duration-100   bg-blue-600 rounded-2xl'  >
        Set your Gemini Api key
     </button></Link>
     <button   onClick={()=>window.location.reload()} className='w-[350px] h-[25px] text-xs hover:bg-blue-800 transition-all duration-100   bg-blue-600 rounded-md'  >
        If you have already set your api key click here to refresh
     </button>

    </div>
  )
}

export default Apikeypopup