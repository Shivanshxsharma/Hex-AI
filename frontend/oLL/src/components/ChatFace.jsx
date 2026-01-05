import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import Loader from './Loader';
import ThinkingLoader from './ThinkingLoader';

const ChatFace = ({ otherDivWidthChange, conversation, currentResponse, isloading }) => {
  const chatContainerRef = useRef(null);
  const scrollTargetRef = useRef(null);
const [DisplayText, setDisplayText] = useState()
  // Scroll to the transparent div only when loading starts
  useEffect(() => {
    if (isloading && scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [isloading]);


  useEffect(() => {
    if (!isloading) {
      setDisplayText(content);
      return;
    }

    // Animate the cursor from the last known length to the new length
    const controls = animate(prevLengthRef.current, content.length, {
      duration: 0.4, 
      ease: "linear",
      onUpdate(latest) {
        setDisplayText(currentResponse.slice(0, Math.floor(latest)));
      }
    });

    prevLengthRef.current = content.length;
    return () => controls.stop();
  }, [currentResponse, isloading]);





  return (
    <div
      id="ChatFace"
      ref={chatContainerRef}
      className="flex flex-col h-[83%] rounded-2xl scroll-smooth overflow-y-auto overflow-x-clip w-full fixed right-0 top-10 transition-all duration-300 items-end pt-15 sm:px-8 md:pl-[6rem] md:pr-[2rem]"
      style={{ width: otherDivWidthChange }}
    >
      {conversation.map((msg, index) => (
        <div
          key={index}
          className={`transition-all duration-300 ease-in-out w-full h-fit flex ${
            msg.role === 'user' ? 'justify-end' : '  md:mb-7 mb-5 mr-0  md:mr-7 justify-center'
          } mt-6`}
        >
          <ChatBubble
            role={msg.role}
            textByUser={msg.parts[0].text}
            response={msg.parts[0].text}
            sources={msg.parts[0].sources}
          />
        </div>
      ))}

      {isloading ? (
        <>
          <div className="w-full pl-7 md:pl-2  justify-start transition-all duration-300 ease-in-out h-fit gap-2.5 flex md:justify-start mt-6">
            <ThinkingLoader />
            <h1>Thinking...</h1>
          </div>
          {/* Transparent div that only appears during loading to fill space and scroll up */}
          <div 
            ref={scrollTargetRef}
            className="w-full flex-grow min-h-[75vh] bg-transparent"
          />
        </>
      ) : currentResponse ? (
        <div className="w-full transition-all duration-300 ease-in-out h-fit flex justify-center mt-6">
          <ChatBubble role="model" response={DisplayText} />
        </div>
      ) : null}
    </div>
  );
};

export default ChatFace;



