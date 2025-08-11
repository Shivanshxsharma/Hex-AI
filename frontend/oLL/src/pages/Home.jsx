import ChatInput from "../components/ChatInput";
import Header from "../components/Header";
import PersonalityCard from "../components/PersonalityCard";
import Sidebar from "../components/Sidebar";
import friend from '../assets/friend.png';
import coding from '../assets/code (3).png';
import horoscope from '../assets/astro.png';
import study from '../assets/student.png';
import career from '../assets/progress.png';
import therapist from '../assets/talking.png';
import movie from "../assets/cinema.png"
import { useState,useEffect } from 'react';
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import Loader, { BarsLoader, RingLoader, SpiralLoader, WaveLoader, ZigzagLoader } from "../components/Loader";
import SidebarSmall from "../components/SidebarSmall";
import opt from '../assets/menulogo.png'
import SignupBoard from "../components/SignupBoard";
import SignConfirmation from "../components/SignConfirmation";
import TextType from "../components/animations/TextType";

function Home() {
      const [signoutPopup, setsignoutPopup] = useState(false);
  const { user, isLoaded } = useUser();
  const [delayPassed, setDelayPassed] = useState(false);
   const [changeWidth, setchangeWidth] = useState("5vw");
   const [otherDivWidthChange, setotherDivWidthChange] = useState("95vw");
   const [mobileMenuWidth, setmobileMenuWidth] = useState("0vw")
  // ✅ Wait 2s after component mounts (no matter what)
  useEffect(() => {
    const timer = setTimeout(() => setDelayPassed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Show loader until both user is loaded and delay is done
  if (!isLoaded || !delayPassed) {
   return  (<div className="flex justify-center items-center h-screen w-screen">
          <RingLoader />
          </div>)
    
  }

     function mobileMenuHandler() {
      if (mobileMenuWidth=="0vw") {
      setmobileMenuWidth("70vw");
      }else{
      setmobileMenuWidth("0vw");
      }
     }



    function pageChangeHandler(service) {
    // setHeadline(service);
  }




  const greetings = [
  `Hi again! ${user.firstName}`,
  `Welcome back, ${user.firstName} — let’s make this interesting`,
  `Good to see you, ${user.firstName}! Got something on your mind?`,
  `Hey ${user.firstName} — ready for another round?`,
  `${user.firstName}! You just made my day`,
  `Back again, ${user.firstName}? Let’s get to it`,
  `Hello again, ${user.firstName} — what’s the plan?`,
  `Always a pleasure, ${user.firstName}`,
  `Glad you’re here, ${user.firstName} — I was just thinking of you`,
  `${user.firstName}! Shall we pick up where we left off?`
];


  return (
    <>
      <div className="relative w-screen ease-in-out h-screen overflow-hidden">
        
        
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

        <div style={{opacity: (signoutPopup)?"30%":"100%"} } className="h-screen w-screen z-9 transition-all duration-200">
      <div className="w-screen h-screen" style={{opacity:(signoutPopup)?"50%":"100%"}}/>
          <div className="hidden md:block">
          <div className="h-screen   fixed left-0 top-0 transition-all duration-200 z-3" style={{width:changeWidth}}>
          <Sidebar  setsignoutPopup={setsignoutPopup} changeWidth={changeWidth} setotherDivWidthChange={setotherDivWidthChange} setchangeWidth={setchangeWidth}/>
         </div>
        </div>
        <div className="block  md:hidden">
          <div className=" h-full fixed left-0 top-0  transition-all duration-300 z-20" style={{width:mobileMenuWidth}}  >
           <SidebarSmall setsignoutPopup={setsignoutPopup} mobileMenuHandler={mobileMenuHandler}/>
           
        </div>
        <div className=" border-b-2 border-[#2e2e2e] fixed z-3 top-0 left-0 w-[30px] flex justify-center items-center p-1 mt-[10px] hover:bg-[#2e2e2e] aspect-square h-[30px]">
          <button onClick={mobileMenuHandler}  ><img src={opt} alt="" srcset="" /></button>
        </div>
        </div>


        <div className="fixed right-0 top-0  transition-all duration-300 ease-in-out w-full z-0" style={{width:otherDivWidthChange}}>
          <Header />
        </div>

        <div className="fixed right-0 bottom-5 z-11 transition-all duration-300 ease-in-out w-screen " style={{width:otherDivWidthChange}}>
         <Link to="/normal/new"><ChatInput /></Link> 
        </div>
        
        {  
          !user? <SignupBoard/> : 
        <div className="flex flex-col fixed right-0  top-10 h-[75vh] transition-all duration-300 ease-in-out z-10"  >
          <div className="flex justify-center mt-4 text-[85%] sm:text-2xl">
            <h1>{greetings[Math.floor(Math.random() * greetings.length)]}</h1>
          </div>
          <div className="flex  justify-center mt-5 text-2xl ">

          <TextType
            text={["	Who do you want to talk to today?"]}
            
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
          </div>

          {/* ✅ First Row of Cards — Responsive Gap Added */}
          <div className="justify-center p-2 mt-8 flex flex-wrap gap-6 sm:gap-8 transition-all duration-200 md:gap-10 lg:gap-12 xl:gap-14 w-screen z-10"  style={{width:otherDivWidthChange}}  >
            <Link to='/astro/new/'><PersonalityCard name="Astro Expert" img={horoscope} pageChangeHandler={pageChangeHandler} /></Link>
            <Link to='/therapist/new/'><PersonalityCard name="Therapist Expert" img={therapist} pageChangeHandler={pageChangeHandler} /></Link>
            <Link to='/code/new/'><PersonalityCard name="Code Expert" img={coding} pageChangeHandler={pageChangeHandler} /></Link>
            <Link to='/movie/new/'><PersonalityCard name="Movie Expert" img={movie} pageChangeHandler={pageChangeHandler} /></Link>
          </div>

          {/* ✅ Second Row of Cards — Responsive Gap Added */}
          <div className="justify-center p-5 flex flex-wrap gap-6 sm:gap-8 transition-all duration-200 md:gap-10 lg:gap-12 xl:gap-14 z-10" style={{width:otherDivWidthChange}}  >
            <Link to='/friend/new/'><PersonalityCard name=" Your Ai Friend" img={friend} pageChangeHandler={pageChangeHandler} /></Link>
            <Link to='/study/new/'><PersonalityCard name="Study Expert" img={study} pageChangeHandler={pageChangeHandler} /></Link>
            <Link to='/career/new/'><PersonalityCard name="Career Expert" img={career} pageChangeHandler={pageChangeHandler} /></Link>
          </div>
        
        </div>
}
        </div>
       

        
        </div>

    </>
  );
}

export default Home;
