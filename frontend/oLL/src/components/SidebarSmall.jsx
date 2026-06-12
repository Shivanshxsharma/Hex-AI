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
      if (!isLoaded) return;
      if (!historyExtractor) return; // ✅ Prevents crash on Home page where historyExtractor is not provided
      const token = await getToken();
      const id = user.id;
      const data = await historyExtractor(token, id);
      setHistory(data);
    }

    fetchHistory();
  }, [isLoaded, currentChatId, toggledelete, historyExtractor]);

  return (
    <div className='overflow-hidden w-full relative h-full flex flex-col bg-[#101010] border-r border-[#2e2e2e]'>
      
      {/* User Profile Header (Top 15%) */}
      <div className='absolute left-0 top-0 w-full h-[15%] flex items-center justify-between px-4 border-b border-[#2e2e2e] bg-[#101010]'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='border border-[#2e2e2e]/55 w-9 h-9 rounded-full overflow-hidden bg-neutral-900 flex-shrink-0 flex justify-center items-center'>
            <img className='w-full h-full object-cover' src={user ? user.imageUrl : userimg} alt="User Avatar" />
          </div>
          <div className='flex flex-col min-w-0'>
            <h1 className='text-xs font-semibold text-neutral-200 truncate max-w-[120px]'>
              {user?.firstName || "User"}
            </h1>
            <span className='text-[10px] text-neutral-500 truncate max-w-[140px]'>
              {user?.emailAddresses?.[0]?.emailAddress}
            </span>
          </div>
        </div>
        <button 
          onClick={mobileMenuHandler} 
          className='w-8 h-8 flex justify-center items-center rounded-lg bg-red-500/15 border border-red-500/25 hover:bg-red-500/25 transition-all duration-200 focus:outline-none'
        >
          <img src={close} alt="Close" className="w-4 h-4 filter invert opacity-80" />
        </button>
      </div>

      {/* History Area (occupies remaining height except bottom bar) */}
      <div 
        id='history' 
        className="w-full overflow-y-auto flex flex-col gap-1.5 p-3 border-b border-[#2e2e2e] absolute left-0 bottom-[64px]"
        style={{ top: '15%', height: 'calc(85% - 64px)' }}
      >
        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider px-2 block mb-1">Recent Chats</span>
        <div className="flex flex-col gap-1 w-full">
          {history.length === 0 ? (
            <div className="text-xs text-neutral-600 px-2 py-1.5 italic">No history</div>
          ) : (
            history
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((e, index) => (
                <div
                  key={index}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className="group relative w-full flex rounded-lg items-center hover:bg-[#141414] bg-neutral-950/20 border border-transparent hover:border-[#2e2e2e]/10 transition-all duration-200 cursor-pointer"
                  onTouchStart={() => startPressTimer(index)}
                  onTouchEnd={cancelPressTimer}
                  onMouseDown={() => startPressTimer(index)}
                  onMouseUp={cancelPressTimer}
                  onMouseLeave={cancelPressTimer}
                >
                  <Link
                    className="w-full text-left text-xs text-neutral-400 hover:text-neutral-200 py-2.5 px-3 pr-10 truncate block"
                    to={`/${personality.toLowerCase()}/chats/${e.chatid}`}
                  >
                    {e.title}
                  </Link>

                  {/* Delete Button */}
                  {showDeleteIndex === index && (
                    <button
                      onClick={() => {
                        setShowDeleteIndex(null);
                        deletechat(e.chatid);
                      }}
                      className="absolute right-2 h-7 px-2.5 bg-red-950 border border-red-500/30 text-red-400 rounded-lg text-[10px] font-semibold flex justify-center items-center transition-all duration-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
          )}
        </div>
      </div>

      {/* Sign-Out Area (Bottom 64px) */}
      <div className='absolute bottom-0 left-0 w-full h-[64px] flex justify-center items-center p-3 border-t border-[#2e2e2e] bg-[#101010]'>
        <button 
          onClick={() => setsignoutPopup(true)}  
          className='border border-red-500/15 text-red-400/90 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 w-full h-full flex justify-center items-center rounded-lg font-semibold text-xs transition-all duration-200'
        >
          Sign Out
        </button>
      </div>

    </div>
  );
}

export default SidebarSmall;