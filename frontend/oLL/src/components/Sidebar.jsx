import userimg from '../assets/user.png';
import opt from '../assets/menulogo.png'
import { useUser,useAuth } from "@clerk/clerk-react";
import Loader from "../components/Loader"
import { useState,useEffect } from 'react';
import {motion} from"motion/react";
import SplitText from "./animations/textAnimate"
import PersonalityCard from './PersonalityCard';
import { Link } from "react-router";
import { useNavigate } from 'react-router';
const api_url=import.meta.env.VITE_API_URL
import del from '../assets/delete-3-svgrepo-com.svg'
function Sidebar({currentChatId,changeWidth,setchangeWidth,personality,setotherDivWidthChange,setsignoutPopup,historyExtractor}) {
  const navigate=useNavigate();
      const [visibility, setvisibility] = useState(0);
      const [barwidthChange, setbarWidthChange] = useState("60%");
      const [profileimgSize, setprofileimgSize] = useState("30px");
      const [toggleName, settoggleName] = useState(false)
  const [history, setHistory] = useState([]);
    const {user,isLoaded}=useUser();
    const {getToken}=useAuth()
   const [toggledelete, settoggledelete] = useState(false);



async function deletechat(chatid) {
  try {
    console.log("Deleting Chat...");
   setHistory(prev => prev.filter(chat => chat.chatId !== chatid));
   console.log("chat deleted ")
    const res = await fetch(`${api_url}/api/history/delete?user=${user.id}&chatid=${chatid}&personality=${personality}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errText = await res.text(); // Get error message from backend
      throw new Error(`Delete failed: ${errText}`);
    }

    const result = await res.json();
    console.log("Chat deleted:", result);

    if (chatid === currentChatId) {
      navigate(`/${personality.toLowerCase()}/new`);  // no need to use full localhost path
    } 
    
    settoggledelete(prev=>!prev);
  } catch (err) {
    console.error("Error deleting chat:", err.message);
  }
}


useEffect(() => {
  async function fetchHistory() {
    if (!isLoaded) return; // wait until user is loaded
    history.length;
    const token = await getToken();
    const id = user.id;
    const data = await historyExtractor(token, id);
    setHistory(data);

  }

  fetchHistory();
}, [isLoaded,currentChatId,toggledelete]); // re-run when user is loaded
      


      function menuHandler() {


        if ( changeWidth=="5vw"&&barwidthChange == "60%") {
          setotherDivWidthChange("80vw")
          setchangeWidth("20vw");
          setvisibility(1);
          // Remove setTimeout for smoother transition
          settoggleName(true);
          setprofileimgSize("60px");
          setbarWidthChange("90%");
        } else {
          settoggleName(false);
          setotherDivWidthChange("95vw")
          setchangeWidth("5vw");
          setvisibility(0)
          setprofileimgSize("30px");
          setbarWidthChange("60%");
        }
      }
      

      if (!isLoaded) {
           return <div>.</div>;
      }

    return ( 
        <div className=" flex flex-row  h-full w-full transition-all duration-200  " >
            
            <div className="h-full pt-3 relative bg-[#0d0d0d] transition-all ease-in-out duration-200" style={{width:barwidthChange}}>
               <div className="  flex flex-row transition-all duration-200 items-center w-full h-[15%] p-1 justify-center relative">
                <div  
                  className="relative w-[95%] transition-all duration-200  backdrop-blur-2xl flex items-center"
                  style={{

                    background:toggleName?"#2e2e2e":"none",
                    height: toggleName ? "95%" : "33%",
                    borderRadius: toggleName ? "16px" : "50%",
                  }}
                >
                  <div  
                    className="absolute z-1 aspect-square items-center overflow-hidden border-2 bg-white rounded-full"
                    style={{
                      width: profileimgSize,
                      left: toggleName ? '8px' : '3px',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                     <img src={user?user.imageUrl:userimg} className='w-full object-fill transition-all duration-200 '/>
                  </div>
                  
                  <div 
                    style={{
                      visibility: toggleName ? "visible" : "hidden",
                      opacity: toggleName ? 1 : 0,
                      transition: 'all 0.2s ease-in-out',
                    }} 
                    className="z-0 h-full flex items-center text-wrap overflow-hidden absolute right-10"
                  >
                    <SplitText
                      text={user?.firstName}
                      className="text-2xl font-semibold text-center"
                      delay={100}
                      duration={0.6}
                      ease="power3.out"
                      splitType="chars"
                      from={{ opacity: 0, y: 40 }}
                      to={{ opacity: 1, y: 0 }}
                      threshold={0.1}
                      rootMargin="-100px"
                      textAlign="center"
                    />
                  </div>
                </div>

               </div>
                <Link to={`/${personality?.toLowerCase()}/new/`} ><div style={{opacity:visibility ,display:personality?"block":"none"}  } className='h-[8%] transition-all duration-100 p-2 w-full'  ><button className='h-full rounded-2xl bg-[#2e2e2e] w-full  ' type="button">New chat</button></div></Link>
                <Link to={`/${personality?.toLowerCase()}/new/`} ><div style={{opacity:visibility ,display:personality?"block":"none"}  } className='h-[8%] transition-all duration-100 p-2 w-full'  ><button className='h-full rounded-2xl bg-[#2e2e2e] w-full  ' type="button">Home</button></div></Link>
                <div style={{opacity:visibility} } id='history'  className=' transition-all duration-300 border-t-2 border-b-2  border-[#2e2e2e] w-full overflow-y-scroll p-3 h-[69%]'>
                 {
                    history.sort((a,b)=>{ return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();}).map((e,index)=>(
                     <div key={index} className=' group h-[6%] relative w-full text-center transition-opacity text-[80%] duration-500 ease-in-out  p-0.5 mt-2  flex rounded-xl justify-center items-center  hover:bg-[#2e2e2e]   cursor-pointer'><Link 
                     className='h-full w-full flex items-center z-2 hover:z-0 justify-center '
                      to={`/${personality.toLowerCase()}/chats/${e.chatid}`}>{e.title}</Link>
                      <button 
                      onClick={()=>{deletechat(e.chatid)}}
                      className=' h-[80%]  z-1 hover:z-2 hover:bg-[white] rounded-xl p-2 flex justify-center items-center   group-hover:opacity-100 opacity-0  absolute right-3'><img src={del} alt="Delete chat" className="w-4 h-4" /></button></div>
                    ))
                 }
                </div>
                
                <div className=' absolute bottom-1  flex justify-center items-center w-full h-[7%] p-2 '>
                <button style={{opacity:visibility,  display:(user)?'block':'none'} } onClick={()=>setsignoutPopup(true)} className='w-full bg-white !text-black rounded-2xl h-full text-[90%] hover:bg-[#303030]'>Sign-Out</button>
                </div>
            </div>
            
            <button onClick={menuHandler} className=' w-[40px] flex justify-center items-center p-1 border-b-2 border-[#2E2E2E]  hover:bg-[#2E2E2E] aspect-square mt-2 h-[32px]'><img src={opt} alt=""  /></button>
        </div>
    );
}

export default Sidebar;
