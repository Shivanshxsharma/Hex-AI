import React from 'react'
import { SignOutButton, useUser } from "@clerk/clerk-react";
function SignConfirmation({setsignoutPopup,signoutPopup}) {
  return (
    <div  style={{
      transition: "all 0.4s ease",
      transform: signoutPopup ? "scale(1) translateY(0)" : "scale(0.75) translateY(20px)",
      opacity: signoutPopup ? 1 : 0,
    }}
 className='w-[30vw] h-[30vh] fixed top-[30vh] transition-all duration-200 gap-10 left-[35vw] rounded-3xl bottom-0-[50vh] flex flex-col shadow-2xl border-5 border-[#2e2e2e] shadow-black justify-center items-center bg-[#000000] z-30'>
     <h1>Do you really want to sign-out</h1>
     <button className='w-[90px] h-[45px] hover:bg-red-800 transition-all duration-100   bg-red-600 rounded-2xl'  ><SignOutButton
     /></button>
     <button onClick={()=>{setsignoutPopup(false)}}  className='hover:bg-black p-2 transition-all duration-100 rounded-xl'>Cancel</button>
    </div>
  )
}

export default SignConfirmation