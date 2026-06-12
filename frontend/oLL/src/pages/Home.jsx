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
import { useState, useEffect } from 'react';
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import Loader, { BarsLoader, RingLoader, SpiralLoader, WaveLoader, ZigzagLoader } from "../components/Loader";
import SidebarSmall from "../components/SidebarSmall";
import opt from '../assets/menulogo.png'
import SignupBoard from "../components/SignupBoard";
import SignConfirmation from "../components/SignConfirmation";
import TextType from "../components/animations/TextType";
import Apikeypopup from "../components/Apikeypopup";

function Home({ encryptedApiKey }) {
  const [signoutPopup, setsignoutPopup] = useState(false);
  const [apikeyfound, setapikeyfound] = useState(false)
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


  useEffect(() => {

    if (user) {
      if (encryptedApiKey) setapikeyfound(true);
      else setapikeyfound(false)
    } else setapikeyfound(true)
  }, [encryptedApiKey, user])


  // ✅ Show loader until both user is loaded and delay is done
  if (!isLoaded || !delayPassed) {
    return (<div className="flex justify-center items-center h-screen w-screen">
      <RingLoader />
    </div>)

  }
  function mobileMenuHandler() {
    if (mobileMenuWidth == "0vw") {
      setmobileMenuWidth("70vw");
    } else {
      setmobileMenuWidth("0vw");
    }
  }



  function pageChangeHandler(service) {
    // setHeadline(service);
  }



  const firstnameOfuser = user && user.firstName ? user.firstName : "User";
  const greetings = [
    `Hi ${firstnameOfuser}!`,
    `Hey ${firstnameOfuser}!`,
    `Hello ${firstnameOfuser}!`,
    `Hi there, ${firstnameOfuser}!`,
    `Hey there, ${firstnameOfuser}!`,
    `Good to see you, ${firstnameOfuser}!`,
    `Welcome back, ${firstnameOfuser}!`,
    `Hi again, ${firstnameOfuser}!`,
    `Hey ${firstnameOfuser}, how's it going?`,
    `Hello ${firstnameOfuser}, how are you?`,
    `Hi ${firstnameOfuser}, what's up?`,
    `Hey ${firstnameOfuser}, good to see you`,
    `${firstnameOfuser}! Nice to see you again`,
    `Oh hey ${firstnameOfuser}`,
    `${firstnameOfuser}, you're back!`,
    `Look who it is - ${firstnameOfuser}!`,
    `Well hello, ${firstnameOfuser}`,
    `${firstnameOfuser}, perfect timing`,
    `Hey ${firstnameOfuser}, glad you're here`,
    `${firstnameOfuser}! How have you been?`,
    `Hi ${firstnameOfuser}, ready for today?`,
    `Hey ${firstnameOfuser}, what brings you here?`,
    `${firstnameOfuser}! What's on your mind?`,
    `Hey ${firstnameOfuser}, what can I help you with?`,
    `Hi ${firstnameOfuser}, what are we working on today?`,
    `${firstnameOfuser}, what's the plan?`,
    `Hey ${firstnameOfuser}, ready to get started?`,
    `Hi ${firstnameOfuser}, let's see what we can do`,
    `${firstnameOfuser}! What should we tackle first?`,
    `Hey ${firstnameOfuser}, I'm here when you're ready`,
    `Well well, look who decided to show up - ${firstnameOfuser}!`,
    `${firstnameOfuser}! Ready to make some magic happen?`,
    `Hey ${firstnameOfuser}, let's turn today into something amazing`,
    `${firstnameOfuser}! Time to unleash some creativity`,
    `${firstnameOfuser}! Let's cook up something brilliant`,
    `Hey ${firstnameOfuser}, what wild idea are we chasing today?`,
    `Oh snap, it's ${firstnameOfuser}! Let's do this thing`
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
        <div
          className="fixed inset-0 z-20 flex justify-center items-center transition-all duration-500"
          style={{
            opacity: !apikeyfound ? 1 : 0,
            pointerEvents: !apikeyfound ? "auto" : "none", // Allow clicking only when visible
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <Apikeypopup apikeyfound={apikeyfound} />
        </div>

        <div style={{ opacity: (signoutPopup || !apikeyfound) ? "30%" : "100%" }} className="h-screen w-screen z-9 transition-all duration-200">
          <div className="w-screen h-screen" style={{ opacity: (signoutPopup || !apikeyfound) ? "50%" : "100%" }} />
          <div className="hidden md:block">
            <div className="h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out z-3" style={{ width: changeWidth }}>
              <Sidebar setsignoutPopup={setsignoutPopup} changeWidth={changeWidth} setotherDivWidthChange={setotherDivWidthChange} setchangeWidth={setchangeWidth} />
            </div>
          </div>
          <div className="block md:hidden">
            <div
              className={`h-full fixed left-0 top-0 transition-transform duration-300 z-20 transform ${mobileMenuWidth === "70vw" ? "translate-x-0" : "-translate-x-full"
                } w-[70vw]`}
            >
              <SidebarSmall setsignoutPopup={setsignoutPopup} mobileMenuHandler={mobileMenuHandler} />
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


          <div id="header-wrapper" className="fixed right-0 top-0  transition-all duration-300 ease-in-out w-full z-0" style={{ width: otherDivWidthChange }}>
            <Header />
          </div>

          {
            !user ? <SignupBoard /> :
              <>
                <div 
                  id="home-main-container"
                  className="fixed right-0 top-[64px] bottom-[90px] overflow-y-auto pb-4 transition-all duration-300 ease-in-out z-10"
                  style={{ width: otherDivWidthChange }}
                >
                  {/* Greeting Section */}
                  <div className="flex justify-center text-center px-4 mt-4 text-lg sm:text-2xl md:text-3xl font-semibold text-white">
                    <h1>{greetings[Math.floor(Math.random() * greetings.length)]}</h1>
                  </div>
                  
                  {/* Subtitle / Typewriter Animation */}
                  <div className="flex justify-center text-center px-4 mt-1 text-xs sm:text-sm md:text-base text-neutral-400 font-medium">
                    <TextType
                      text={["Who do you want to talk to today?"]}
                      typingSpeed={75}
                      pauseDuration={1500}
                      showCursor={true}
                      cursorCharacter="|"
                    />
                  </div>

                  {/* Unified Card Container - 3 columns on mobile, flex wrap on tablet/desktop */}
                  <div className="flex justify-center items-start px-4 sm:px-6 py-4 mt-2">
                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 w-full max-w-4xl">
                      <Link to='/astro/new/'><PersonalityCard name="Astro Expert" img={horoscope} pageChangeHandler={pageChangeHandler} /></Link>
                      <Link to='/therapist/new/'><PersonalityCard name="Therapist Expert" img={therapist} pageChangeHandler={pageChangeHandler} /></Link>
                      <Link to='/code/new/'><PersonalityCard name="Code Expert" img={coding} pageChangeHandler={pageChangeHandler} /></Link>
                      <Link to='/movie/new/'><PersonalityCard name="Movie Expert" img={movie} pageChangeHandler={pageChangeHandler} /></Link>
                      <Link to='/friend/new/'><PersonalityCard name="Your AI Friend" img={friend} pageChangeHandler={pageChangeHandler} /></Link>
                      <Link to='/study/new/'><PersonalityCard name="Study Expert" img={study} pageChangeHandler={pageChangeHandler} /></Link>
                      <Link to='/career/new/'><PersonalityCard name="Career Expert" img={career} pageChangeHandler={pageChangeHandler} /></Link>
                    </div>
                  </div>
                </div>

                {/* Fixed Bottom Chat Input for all views (PC and Mobile) */}
                <div 
                  id="chat-input-wrapper"
                  className="fixed bottom-5 right-0 w-screen z-11 transition-all duration-300 ease-in-out"
                  style={{ width: otherDivWidthChange }}
                >
                  <Link to="/normal/new"><ChatInput /></Link>
                </div>
              </>
          }
        </div>



      </div>

    </>
  );
}

export default Home;
