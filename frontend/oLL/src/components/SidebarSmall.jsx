import React from 'react'
import { useUser,useAuth } from "@clerk/clerk-react";
import { useEffect,useRef,useState } from 'react';
import close from "../assets/cross.png";
import userimg from "../assets/user.png"
import { Link } from "react-router";
import { useNavigate } from 'react-router';

const api_url=import.meta.env.VITE_API_URL

const SidebarSmall = ({currentChatId,historyExtractor,mobileMenuHandler,setsignoutPopup,personality}) => {
  const {user,isLoaded}=useUser()
  const [showDeleteIndex, setShowDeleteIndex] = useState(null);
  const touchTimeout = useRef(null);
  const itemRefs = useRef([]);
  const navigate=useNavigate();
  // Long press handlers
  const startPressTimer = (index) => {
    touchTimeout.current = setTimeout(() => {
      setShowDeleteIndex(index);
    }, 600);
  };

  const cancelPressTimer = () => {
    clearTimeout(touchTimeout.current);
  };




    useEffect(() => {
    const handleOutside = (e) => {
      if (
        showDeleteIndex !== null &&
        itemRefs.current[showDeleteIndex] &&
        !itemRefs.current[showDeleteIndex].contains(e.target)
      ) {
        setShowDeleteIndex(null);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [showDeleteIndex]);
   

const [history, setHistory] = useState([]);
  const {getToken}=useAuth()
   const [toggledelete, settoggledelete] = useState(false);



async function deletechat(chatid) {
  try {
    console.log("Deleting Chat...");

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
}, [isLoaded,currentChatId,toggledelete]); // re-run when user is lo
  return (
    <div className=' overflow-hidden w-full relative  h-full flex flex-col justify-center bg-[#101010] border-[#2e2e2e] md:border-r-3 '>
     <div className='absolute left-0 flex justify-between top-0 w-full h-[20%] '>
      <button onClick={mobileMenuHandler} className='absolute right-0 top-0 h-[20%] rounded-full m-1  hover:bg-[#2e2e2e] aspect-square'><img src={close} alt="" srcset="" /></button>
     <div className='w-[35%]  h-full flex justify-center items-center '>
      <div className='bg-gradient-to-tr  from-violet-700  via-yellow-300 to-red-600  w-[75%] aspect-square rounded-full flex justify-center items-center'>
       <img className='w-[93%] aspect-square rounded-full' src={user?user.imageUrl:userimg} alt="" srcset="" />
      </div>
     </div>
     <div className='w-[50%] break-words h-[70%] absolute right-4 bottom-0  '>
           <h1>{user?.emailAddresses[0].emailAddress}</h1>

      
     </div>

     </div>
      <div id='history' className="w-full overflow-scroll h-[75%] absolute border-t-2 p-3 border-b-2 border-t-[#2e2e2e] border-b-[#2e2e2e] left-0 bottom-14">
      {history.sort((a,b)=>{ return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()}).map((e, index) => (
        <div
          key={index}
          ref={(el) => (itemRefs.current[index] = el)}
          className="group h-[10%] relative w-full text-center transition-opacity text-[80%] duration-500 ease-in-out p-0.5 mt-2 flex rounded-xl justify-center items-center hover:bg-[#2e2e2e] bg-[#000000] cursor-pointer"
          onTouchStart={() => startPressTimer(index)}
          onTouchEnd={cancelPressTimer}
          onMouseDown={() => startPressTimer(index)}
          onMouseUp={cancelPressTimer}
          onMouseLeave={cancelPressTimer}
        >
          <Link
            className="h-full w-full flex items-center z-2 hover:z-0 justify-center"
            to={`/${personality.toLowerCase()}/chats/${e.chatid}`}
          >
            {e.title}
          </Link>

          {/* Delete Button */}
          {showDeleteIndex === index && (
            <button
              onClick={() => {
                alert(`Delete chat: ${e}`);
                setShowDeleteIndex(null);
                deletechat(e.chatid);
              }}
              className="h-[80%] z-10 bg-black text-white rounded-xl p-2 flex justify-center items-center absolute right-3 transition-opacity"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
     <div className=' overflow-hidden  absolute bottom-2 p-0.5 w-full flex justify-center items-center h-[7%] border-t-2 border-[#2e2e2e]'>
      <button onClick={()=>{setsignoutPopup(true)}}  className=' bg-red-400  hover:bg-[#2e2e2e] w-[97%] h-[90%] flex justify-center items-center rounded-xl overflow-hidden'><h1>Sign-Out</h1></button>
     </div>

    </div>
  )
}

export default SidebarSmall