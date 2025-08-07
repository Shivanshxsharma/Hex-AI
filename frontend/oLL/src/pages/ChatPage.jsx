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
import { useState, useEffect, useRef, useCallback } from "react";
import { flushSync } from 'react-dom';
import chatSuggestions from '../components/data';
import Loader, { RingLoader, ZigzagLoader } from "../components/Loader";
import ChatFace from "../components/ChatFace";
import SidebarSmall from "../components/SidebarSmall";
import opt from "../assets/menulogo.png"
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import SignConfirmation from "../components/SignConfirmation";
import Suggestions from "../components/Suggestions";

const api_url = import.meta.env.VITE_API_URL;

function ChatPage({ Headline }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { chatId } = useParams();

  // State management
  const [suggestion, setSuggestion] = useState("null");
  const [conversation, setConversation] = useState([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [SuggestionArray, setSuggestionArray] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [changeWidth, setChangeWidth] = useState("5vw");
  const [otherDivWidthChange, setOtherDivWidthChange] = useState("95vw");
  const [mobileMenuWidth, setMobileMenuWidth] = useState("0vw");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [signoutPopup, setSignoutPopup] = useState(false);
  const [fillSugg, setFillSugg] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [visible, setVisible] = useState(false);
  const [suggestionMenu, setSuggestionMenu] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [startGenerating, setStartGenerating] = useState(false);

  // Critical refs for streaming
  const socketRef = useRef(null);
  const chatIdRef = useRef(currentChatId);
  const streamingResponseRef = useRef("");
  const isStreamingRef = useRef(false);
  const chunkQueueRef = useRef([]);
  const processingChunksRef = useRef(false);

  // Update chatIdRef when currentChatId changes
  useEffect(() => {
    chatIdRef.current = currentChatId;
  }, [currentChatId]);

  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Mobile menu handler
  const mobileMenuHandler = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Chat ID and conversation management
  useEffect(() => {
    setCurrentChatId(chatId);

    const fetchChat = async () => {
      try {
        const token = await getToken();
        const data = await chatExtractor(token);
        setConversation(data);
        setVisible(false);
      } catch (error) {
        console.error("Error fetching chat:", error);
        setConversation([]);
      }
    };

    if (chatId) {
      fetchChat();
    } else {
      // Reset for new chat screen
      setConversation([]);
      setCurrentResponse("");
      streamingResponseRef.current = "";
      setVisible(true);
    }
  }, [chatId, getToken]);

  // Chat extractor function
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
        throw new Error("Failed to fetch chat");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching chat:", error);
      return [];
    }
  }

  // History extractor function
  async function historyExtractor(token, id) {
    console.log("Running history extraction");
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
      return data;
    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  }

  // History handler function
  async function historyHandler(finalResponse, token, chatId) {
    try {
      const res = await fetch(`${api_url}/api/history`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          personality: Headline,
          response: finalResponse,
          chatId: chatId
        })
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);

        if (data.chatId) {
          navigate(`/${Headline.toLowerCase()}/chats/${data.chatId}`);
        }
      } else {
        const errorText = await res.text();
        console.error("❌ Failed to store history:", errorText);
      }
    } catch (error) {
      console.error("❌ Error while storing history:", error);
    }
  }

  // Socket.IO setup - only once
  useEffect(() => {
    const socket = io(`${api_url}`, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Process chunk queue with requestAnimationFrame for smooth updates
  const processChunkQueue = useCallback(() => {
    if (processingChunksRef.current || chunkQueueRef.current.length === 0) return;
    
    processingChunksRef.current = true;
    
    const processNextChunk = () => {
      if (chunkQueueRef.current.length === 0) {
        processingChunksRef.current = false;
        return;
      }
      
      const chunk = chunkQueueRef.current.shift();
      streamingResponseRef.current += chunk;
      
      // Force immediate DOM update
      flushSync(() => {
        setCurrentResponse(streamingResponseRef.current);
      });
      
      // Process next chunk on next frame
      requestAnimationFrame(processNextChunk);
    };
    
    processNextChunk();
  }, []);

  // Submit handler
  async function submitHandler(text) {
    if (text && socketRef.current && !isStreamingRef.current) {
      try {
        // Reset streaming state
        streamingResponseRef.current = "";
        chunkQueueRef.current = [];
        isStreamingRef.current = true;
        
        // CRITICAL: Set up listeners BEFORE emitting prompt
        const socket = socketRef.current;
        
        // Remove any existing listeners
        socket.removeAllListeners("model_chunk");
        socket.removeAllListeners("model_chunk_end");
        
        // Set up fresh listeners BEFORE sending prompt
        const handleChunk = (chunk) => {
          console.log("📦 Chunk received:", chunk);
          chunkQueueRef.current.push(chunk);
          processChunkQueue();
          setIsLoading(false);
        };

        const handleChunkEnd = async () => {
          console.log("🏁 Stream ended, final response:", streamingResponseRef.current);
          
          try {
            const token = await getToken();
            const finalResponse = streamingResponseRef.current;
            
            if (finalResponse.trim()) {
              const modelMessage = {role: "model", parts:[{text: finalResponse}]};
              
              setConversation(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'model' && lastMessage?.parts?.[0]?.text === finalResponse) {
                  return prev;
                }
                return [...prev, modelMessage];
              });
              
              await historyHandler(modelMessage, token, chatIdRef.current);
            }
          } catch (error) {
            console.error("Error in handleChunkEnd:", error);
          } finally {
            // Clean reset
            streamingResponseRef.current = "";
            chunkQueueRef.current = [];
            isStreamingRef.current = false;
            setStartGenerating(false);
            setCurrentResponse("");
            
            // Remove listeners after stream ends
            socket.off("model_chunk", handleChunk);
            socket.off("model_chunk_end", handleChunkEnd);
          }
        };
        
        // Add listeners
        socket.on("model_chunk", handleChunk);
        socket.on("model_chunk_end", handleChunkEnd);
        
        // NOW emit the prompt after listeners are ready
        socket.emit("prompt_By_User", text, Headline, currentChatId);
        
        const token = await getToken();
        console.log("submitting with listeners ready");
        
        setConversation(prev => [...prev, {role: "user", parts:[{text: text}]}]);
        await historyHandler({role: "user", parts:[{text: text}]}, token, currentChatId);
        
        setIsLoading(true);
        setVisible(false);
        setCurrentResponse("");
        setStartGenerating(true);
      } catch (error) {
        console.error("Error in submitHandler:", error);
        isStreamingRef.current = false;
      }
    }
  }

  // This useEffect is now only for cleanup - listeners are set up in submitHandler
  useEffect(() => {
    // Just cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners("model_chunk");
        socketRef.current.removeAllListeners("model_chunk_end");
      }
    };
  }, []);

  // Suggestions array setup
  useEffect(() => {
    switch (Headline + " AI") {
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
    console.log(Headline);
  }, [Headline]);

  return (
    <>
      <div className="relative w-screen ease-in-out h-screen overflow-hidden">
        <div
          className="fixed inset-0 z-20 flex justify-center items-center transition-all duration-500"
          style={{
            opacity: signoutPopup ? 1 : 0,
            pointerEvents: signoutPopup ? "auto" : "none",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <SignConfirmation
            signoutPopup={signoutPopup}
            setsignoutPopup={setSignoutPopup}
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center h-screen w-screen z-100">
            <RingLoader />
          </div>
        )}

        <div className="hidden md:block">
          <div className="h-screen fixed left-0 top-0 transition-all duration-200 z-4" style={{width: changeWidth}}>
            <Sidebar 
              currentChatId={currentChatId} 
              personality={Headline} 
              historyExtractor={historyExtractor} 
              setsignoutPopup={setSignoutPopup} 
              changeWidth={changeWidth} 
              setotherDivWidthChange={setOtherDivWidthChange} 
              setchangeWidth={setChangeWidth}
            />
          </div>
        </div>

        <div className="block sm:hidden">
          <div className={`fixed h-screen top-0 transition-transform duration-300 z-10 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-[70vw] bg-amber-500`}>
            <SidebarSmall 
              currentChatId={currentChatId} 
              personality={Headline} 
              historyExtractor={historyExtractor} 
              setsignoutPopup={setSignoutPopup} 
              mobileMenuHandler={mobileMenuHandler}
            />
          </div>
          <button onClick={mobileMenuHandler} className='fixed left-0 w-[30px] flex justify-center items-center p-1 rounded-xl hover:bg-[#2E2E2E] aspect-square mt-3 h-[30px] z-7'>
            <img src={opt} alt="" />
          </button>
        </div>

        <div className="fixed right-0 top-0 transition-all duration-300 ease-in-out w-full z-0" style={{width: otherDivWidthChange}}>
          <Header Headline={Headline}/>
        </div>

        <ChatFace isloading={isLoading} currentResponse={currentResponse} conversation={conversation} otherDivWidthChange={otherDivWidthChange} />

        <div
          style={{
            display: Headline === "Normal" ? "none" : "block",
            position: 'absolute',
            bottom: '20vh',
            left: '50%',
            transform: visible
              ? 'translate(-50%, 0)'
              : 'translate(-50%, 1500px)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.6s ease, opacity 0.6s ease',
            zIndex: 0
          }}
          className="w-[85vw] md:w-fit h-fit rounded-2xl items-center transition-all bg-[#171717] duration-300 p-3"
        >
          <Suggestions 
            setfillSugg={setFillSugg} 
            setsuggestion={setSuggestion}  
            SuggestionArray={SuggestionArray}
          />
        </div>

        <div className="fixed bottom-4 transition-all overflow-visible ease-in-out duration-300 right-0 w-full px-4 sm:px-12 pb-4 z-3" style={{width: otherDivWidthChange}}>
          <ChatInput 
            startGenerating={startGenerating} 
            setisloading={setIsLoading} 
            setstartGenerating={setStartGenerating} 
            fillSugg={fillSugg} 
            setfillSugg={setFillSugg} 
            suggestion={suggestion}  
            submitHandler={submitHandler} 
            SuggestionArray={SuggestionArray} 
            Headline={Headline}
          />
        </div>
      </div>
    </>
  );
}

export default ChatPage;
