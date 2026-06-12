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
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const {user, isLoaded} = useUser();
  const {getToken} = useAuth();
  const [toggledelete, settoggledelete] = useState(false);

  // Derive layout states from parent's changeWidth prop for perfect responsiveness
  const isExpanded = changeWidth === "20vw";
  const barwidthChange = isExpanded ? "90%" : "60%";
  const visibility = isExpanded ? 1 : 0;
  const toggleName = isExpanded;

  async function deletechat(chatid) {
    try {
      console.log("Deleting Chat...");
      setHistory(prev => prev.filter(chat => chat.chatId !== chatid));
      console.log("chat deleted");
      const res = await fetch(`${api_url}/api/history/delete?user=${user.id}&chatid=${chatid}&personality=${personality}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Delete failed: ${errText}`);
      }

      const result = await res.json();
      console.log("Chat deleted:", result);

      if (chatid === currentChatId) {
        navigate(`/${personality.toLowerCase()}/new`);
      } 
      
      settoggledelete(prev => !prev);
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

  function menuHandler() {
    if (changeWidth === "5vw") {
      setotherDivWidthChange("80vw");
      setchangeWidth("20vw");
    } else {
      setotherDivWidthChange("95vw");
      setchangeWidth("5vw");
    }
  }

  if (!isLoaded) {
    return <div>.</div>;
  }

  return ( 
    <div className="flex flex-row h-full w-full transition-all duration-200" >
      
      {/* Dark Sidebar Container */}
      <div 
        className="h-full pt-4 relative bg-[#0d0d0d] border-r border-[#2e2e2e] flex flex-col justify-between transition-all ease-in-out duration-200" 
        style={{ width: barwidthChange }}
      >
        <div className="flex flex-col flex-1 min-h-0 w-full">
          {/* User Profile Header Section */}
          <div className="flex items-center justify-center w-full px-2 py-3 h-[15%]">
            <div  
              className={`flex items-center transition-all duration-300 ease-in-out w-full border ${
                toggleName 
                  ? "bg-[#141414] border-[#2e2e2e]/20 px-3 py-2 rounded-xl gap-3 h-full" 
                  : "bg-transparent border-transparent px-1 py-1 gap-0 justify-center h-10 w-10 rounded-full"
              }`}
            >
              <div 
                className={`aspect-square overflow-hidden border border-[#2e2e2e]/60 bg-neutral-900 rounded-full transition-all duration-300 ease-in-out flex-shrink-0 ${
                  toggleName ? 'w-14 h-14' : 'w-8 h-8'
                }`}
              >
                <img src={user ? user.imageUrl : userimg} className='w-full h-full object-cover'/>
              </div>
              
              <div 
                className={`flex-1 min-w-0 flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
                  toggleName ? "opacity-100 max-w-[150px] ml-0.5" : "opacity-0 max-w-0 pointer-events-none"
                }`}
              >
                <SplitText
                  text={user?.firstName || "User"}
                  className="text-2xl font-semibold text-neutral-200 truncate"
                  delay={100}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-1.5 px-2 mt-2 w-full">
            {personality && (
              <>
                <Link 
                  to="/"
                  style={{ opacity: visibility, display: visibility ? "block" : "none" }}
                  className="w-full"
                >
                  <button 
                    className="w-full text-left text-sm font-semibold py-2.5 px-3 rounded-lg text-neutral-300 hover:text-white hover:bg-[#141414] border border-transparent hover:border-[#2e2e2e]/20 transition-all duration-200 focus:outline-none"
                    type="button"
                  >
                    Home
                  </button>
                </Link>
                <Link 
                  to={`/${personality.toLowerCase()}/new/`}
                  style={{ opacity: visibility, display: visibility ? "block" : "none" }}
                  className="w-full"
                >
                  <button 
                    className="w-full text-left text-sm font-semibold py-2.5 px-3 rounded-lg text-neutral-300 hover:text-white hover:bg-[#141414] border border-transparent hover:border-[#2e2e2e]/20 transition-all duration-200 focus:outline-none"
                    type="button"
                  >
                    New chat
                  </button>
                </Link>
              </>
            )}
            {!personality && (
              <Link 
                to="/configure_keys/"
                style={{ opacity: visibility, display: visibility ? "block" : "none" }}
                className="w-full"
              >
                <button 
                  className="w-full text-left text-sm font-semibold py-2.5 px-3 rounded-lg text-neutral-300 hover:text-white hover:bg-[#141414] border border-transparent hover:border-[#2e2e2e]/20 transition-all duration-200 focus:outline-none"
                  type="button"
                >
                  Configure Keys
                </button>
              </Link>
            )}
          </div>

          {/* Chat History Section */}
          <div 
            style={{ opacity: visibility, display: visibility ? "flex" : "none" }} 
            id='history'  
            className='flex-1 flex flex-col gap-1 transition-all duration-300 border-t border-b border-[#2e2e2e] w-full overflow-y-auto p-2 mt-4'
          >
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-3 mb-1 block">Recent Chats</span>
            <div className="flex flex-col gap-1 w-full">
              {history.length === 0 ? (
                <div className="text-xs text-neutral-600 px-3 py-1.5 italic">No history</div>
              ) : (
                history
                  .sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .map((e,index) => (
                    <div 
                      key={index} 
                      className='group relative w-full flex rounded-xl items-center hover:bg-[#141414] border border-transparent hover:border-[#2e2e2e]/20 transition-all duration-200 cursor-pointer'
                    >
                      <Link 
                        className='w-full text-left text-sm text-neutral-400 hover:text-neutral-200 py-2.5 px-3 pr-9 truncate block'
                        to={`/${personality.toLowerCase()}/chats/${e.chatid}`}
                      >
                        {e.title}
                      </Link>
                      <button 
                        onClick={() => deletechat(e.chatid)}
                        className='absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-all duration-150 focus:outline-none'
                        title="Delete Chat"
                      >
                        <img src={del} alt="Delete" className="w-3.5 h-3.5 filter invert opacity-50 hover:opacity-100" />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
          
        </div>

        {/* Sign-Out Button at Bottom */}
        <div 
          style={{ opacity: visibility, display: (user && visibility) ? 'block' : 'none' }} 
          className='w-full p-2 mt-auto border-t border-[#2e2e2e] pt-3'
        >
          <button 
            onClick={() => setsignoutPopup(true)} 
            className='w-full py-2 px-3 border border-red-500/15 text-red-400/90 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-sm font-semibold transition-all duration-200 text-center focus:outline-none'
          >
            Sign Out
          </button>
        </div>
      </div>
      
      {/* Toggle Button next to Sidebar */}
      <div className="flex flex-col pt-3">
        <button 
          onClick={menuHandler} 
          className='w-8 h-8 flex justify-center items-center p-2 border border-[#2e2e2e]/20 hover:border-[#2e2e2e]/50 bg-neutral-900/40 hover:bg-[#141414] rounded-lg transition-all duration-200 ml-2 focus:outline-none'
          title={toggleName ? "Collapse menu" : "Expand menu"}
        >
          <img src={opt} alt="Toggle" className="w-3.5 h-3.5 opacity-60 hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
