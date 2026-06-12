import ChatInput from "../components/ChatInput";
import Header from "../components/Header";
import PersonalityCard from "../components/PersonalityCard";
import Sidebar from "../components/Sidebar";
import friend from '../assets/buddy.png';
import coding from '../assets/coding.png';
import horoscope from '../assets/horoscope.png';
import study from '../assets/study.png';
import career from '../assets/success.png';
import therapist from '../assets/talking.png';
import movie from '../assets/watching-a-movie.png';
import { useState, useEffect,useRef } from "react";
import chatSuggestions from '../components/data';
import Loader, { RingLoader, ZigzagLoader } from "../components/Loader";
import ChatFace from "../components/ChatFace";
import SidebarSmall from "../components/SidebarSmall";
import opt from "../assets/menulogo.png"
import { io } from "socket.io-client";
import { Await, useNavigate, redirect, useParams } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import SignConfirmation from "../components/SignConfirmation";
import Suggestions from "../components/Suggestions";
const api_url =import.meta.env.VITE_API_URL






function ChatPage({ Headline}) {
const navigate = useNavigate();
const [suggestion, setsuggestion] = useState("null");
const [conversation, setConversation] = useState([]);
const [currentResponse, setCurrentResponse] = useState("");
const socketRef = useRef(null);
const [SuggestionArray, setSuggestionArray] = useState([]);
const [inputText, setinputText] = useState("");
const [loading, setLoading] = useState(true);
const [changeWidth, setchangeWidth] = useState("5vw");
const [otherDivWidthChange, setotherDivWidthChange] = useState("95vw");
const [mobileMenuWidth, setmobileMenuWidth] = useState("0vw")
const [isloading, setisloading] = useState(false);
const  [isAdded, setisAdded] = useState(false)
const [signoutPopup, setsignoutPopup] = useState(false);
const [fillSugg, setfillSugg] = useState(false)
const{user,isLoaded}=useUser();
const {getToken}=useAuth();
const {chatId}=useParams();



const [currentChatId, setcurrentChatId] = useState(chatId)



  const [visible, setVisible] = useState(false);
  const [suggestionMenu, setsuggestionMenu] = useState(true);



  useEffect(() => {
    if(isLoaded&&!user||!user.id){
      navigate("/")
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, 50); // trigger after render
     
    
    if(!socketRef){
      setLoading(true);
    }



    return () => clearTimeout(timer);
  }, []);




useEffect(() => {
  if (socketRef.current) {
    // Socket is available, brief loading period
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  } else {
    // No socket available
    setLoading(false);
  }
}, [socketRef.current]);



const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
function mobileMenuHandler() {
  setMobileMenuOpen(prev => !prev);
}





const chatIdRef = useRef(currentChatId);
useEffect(() => {
  chatIdRef.current = currentChatId;
}, [currentChatId]);


useEffect(() => {
  setcurrentChatId(chatId); // chatId will be undefined or null on /newchat
  async function fetchChat() {
    const token = await getToken();
    const data = await chatExtractor(token);
    setConversation(data);
    setVisible(false);
  }

  if (chatId) {
    fetchChat();
  } else {
    // 🧹 Reset for new chat screen
    setConversation([]);
    setCurrentResponse("");
    setVisible(true); // Or false, depending on your UI logic
  }
}, [chatId]);





async function chatExtractor(token) {
  try {
    const res = await fetch(`${api_url}/api/history/chats?chatid=${chatId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (!res.ok) {
      navigate("/")
      throw new Error("Failed to fetch chat");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching chat:", error);
    return [];
  }
}

     


















useEffect(() => {
  const socket = io(`${api_url}`,{
    transports: ["websocket"],
    auth:{
      userId:user?.id
    }
  });
  socketRef.current = socket;

  socket.on("connect", () => {
    console.log("✅ Connected to Socket.IO server");
  
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err);
  });

  socket.on("init_Error",()=>{
    window.alert("cant initilize the model right know please try again after some time")
  })
  return () => {
    socket.disconnect();
  };
}, []);













async function historyExtractor(token,id) {

  console.log("running history extraction")
  try {
    const res = await fetch(`${api_url}/api/history?user=${id}&personality=${Headline}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch history");
    }

    const data = await res.json(); 
    
    return data        ; // array of history
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}






















// history handler;
async function historyHandler(finalResponse, token,chatId) {
  console.log("final response  :-----------"+finalResponse)
  
  try {

    const res = await fetch(`${api_url}/api/history` ,{
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personality: Headline,
        response: finalResponse,
        chatId:chatId
      })
    });
    if(res.ok){
      const data=await res.json();

      if(data.chatId){
        navigate(`/${Headline.toLowerCase()}/chats/${data.chatId}`);
      }
      
    }


    if (!res.ok) {
      const errorText = await res.text(); // ✅ use text to catch HTML errors
      console.error("❌ Failed to store history:", errorText,token,chatId);
    } else {
      console.log("✅ History stored successfully");
    }
  } catch (error) {
    console.error("❌ Error while storing history:", error);
  }
}




const [startGenerating, setstartGenerating] = useState(false);

async function submitHandler(text) {
    if(text && socketRef.current) {
      setisloading(true);
      const token= await getToken();
      setConversation(prev=>[...prev, {role: "user", parts:[{text: text}]}])
      await historyHandler({role: "user", parts:[{text: text}]}, token,currentChatId);
      setstartGenerating(true)
      socketRef.current.emit("prompt_By_User", text, Headline,currentChatId);
      console.log("submitting");
      setVisible(false)
      setCurrentResponse("");
    }
}



useEffect(() => {
    if(!startGenerating||!socketRef.current) return;
    
    console.log("getting response");
    const handleChunk = (chunk) => {
        setCurrentResponse(prev => prev + chunk);
        setisloading(false);
    };

    const handleChunkEnd = async(cits) => {
      const token= await getToken()  
        setCurrentResponse(latestResponse => {
            if (latestResponse.trim()) { 
                setConversation(  prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage?.role === 'model' && lastMessage?.parts?.[0]?.text === latestResponse) {
                        return prev;
                    }
                    setisAdded(true);
                   historyHandler({role: "model", parts:[{text: latestResponse , sources:cits}]}, token,chatIdRef.current);
                    setstartGenerating(false);
                    return [...prev, {role: "model", parts:[{text: latestResponse, sources:cits}]}];
                });
            }

            return ""; 
        });

                
                
    };

    //  CRITICAL: Remove existing listeners first
    socketRef.current.off("model_chunk", handleChunk);
    socketRef.current.off("model_chunk_end", handleChunkEnd);
    
    // Then add new listeners
    socketRef.current.on("model_chunk", handleChunk);
    socketRef.current.on("model_chunk_end", handleChunkEnd);

    return () => {
        if (socketRef.current) {
            socketRef.current.off("model_chunk", handleChunk);
            socketRef.current.off("model_chunk_end", handleChunkEnd);
        }
    };
}, [startGenerating]);
  














  useEffect(() => {
    switch (Headline+" AI") {
      case 'Astro AI':
        setSuggestionArray(chatSuggestions.astrology);
        break;
      case 'Code AI':
        setSuggestionArray(chatSuggestions.code);
        break;
      case 'Friend AI':
        setSuggestionArray(chatSuggestions.friend);
        break;
      case 'Therapist AI':
        setSuggestionArray(chatSuggestions.therapist);
        break;
      case 'Movie AI':
        setSuggestionArray(chatSuggestions.movie);
        break;
      case 'Study AI':
        setSuggestionArray(chatSuggestions.study);
        break;
      case 'Career AI':
        setSuggestionArray(chatSuggestions.career);
        break;
      default:
        setSuggestionArray([]);
    }

  }, [Headline]);



  return (
    <>
        <div className="relative w-screen  ease-in-out h-screen overflow-hidden">

        <div
            className="fixed inset-0 z-20 flex justify-center items-center transition-all duration-500"
            style={{
              opacity: signoutPopup ? 1 : 0,
              pointerEvents: signoutPopup ? "auto" : "none", // Allow clicking only when visible
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
              <SignConfirmation
           signoutPopup={signoutPopup}
           setsignoutPopup={setsignoutPopup}

          />
          </div>





          {socketRef&&loading &&    (<div className="flex justify-center items-center h-screen w-screen z-100">
                    <RingLoader />
                    </div>)}


        <div className="hidden md:block">
          <div className="h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out z-4" style={{width:changeWidth}}>
          <Sidebar currentChatId={currentChatId} personality={Headline} historyExtractor={historyExtractor} setsignoutPopup={setsignoutPopup} changeWidth={changeWidth} setotherDivWidthChange={setotherDivWidthChange} setchangeWidth={setchangeWidth}/>
        </div>
        </div>
        <div className="block md:hidden">
          <div className={`fixed h-screen top-0 transition-transform duration-300 z-20 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-[70vw]`}>
            <SidebarSmall currentChatId={currentChatId} personality={Headline} historyExtractor={historyExtractor} setsignoutPopup={setsignoutPopup} mobileMenuHandler={mobileMenuHandler}/>
          </div>
          <div className="fixed z-10 top-3 left-3">
            <button 
              onClick={mobileMenuHandler} 
              className="w-8 h-8 flex justify-center items-center p-2 border border-[#2e2e2e]/20 hover:border-[#2e2e2e]/50 bg-[#090909]/80 backdrop-blur-md rounded-lg transition-all duration-200"
              title="Open menu"
            >
              <img src={opt} alt="Menu" className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
            </button>
          </div>
        </div>
        <div className="fixed  right-0 top-0  transition-all duration-300 ease-in-out w-full z-0" style={{width:otherDivWidthChange}}>
          <Header Headline={Headline}/>
        </div>

           <ChatFace  isloading={isloading} currentResponse={currentResponse} conversation={conversation} otherDivWidthChange={otherDivWidthChange} />

        {/* Chat Input at bottom */}
      <div
        
         style={{
          display :Headline=="Normal"?"none":"block",
          position: 'absolute',
          bottom: '20vh',
          left: '50%',
          transform: visible
            ? 'translate(-50%, 15%)'             // show in center
            : 'translate(-50%, 1500px)',       // hide down below (exit same as entry)
          opacity: visible ? 1 : 0,
          transition: 'transform 0.6s ease, opacity 0.6s ease',
          zIndex: 0
        }}

       className=" w-[85vw] md:w-fit h-fit rounded-2xl  items-center transition-all bg-[#0d0d0d] duration-300 p-3 ">
       <Suggestions setfillSugg={setfillSugg} setsuggestion={setsuggestion}  SuggestionArray={SuggestionArray}/>
      </div>



        <div 
          className="fixed bottom-4 overflow-visible right-0 w-full px-4 sm:px-12 pb-4 z-3" 
          style={{ width: otherDivWidthChange, transition: 'width 0.3s ease-in-out' }}
        >
           
          <ChatInput getToken={getToken} chatId={chatIdRef.current} historyHandler={historyHandler} currentResponse={currentResponse} startGenerating={startGenerating} setisloading={setisloading} setstartGenerating={setstartGenerating} fillSugg={fillSugg} setfillSugg={setfillSugg} suggestion={suggestion}  submitHandler={submitHandler} SuggestionArray={SuggestionArray} Headline={Headline}/>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
