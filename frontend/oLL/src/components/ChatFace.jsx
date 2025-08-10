import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import Loader from './Loader';
import ThinkingLoader from './ThinkingLoader';

const ChatFace = ({ otherDivWidthChange, conversation, currentResponse, isloading }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, currentResponse, isloading]);

  return (
    <div
      id="ChatFace"
      className="flex flex-col h-[83%] rounded-2xl scroll-smooth overflow-y-auto w-full fixed right-0 top-10 transition-all duration-300 items-end pt-15 sm:px-8 md:pl-[6rem] md:pr-[2rem]"
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
            sources={msg.parts[0]?.sources}
          />
        </div>
      ))}

      {isloading ? (
        <div
          ref={chatEndRef}
          className="w-full transition-all duration-300 ease-in-out h-fit flex justify-start mt-6"
        >
          <ThinkingLoader />
        </div>
      ) : currentResponse ? (
        <div
          ref={chatEndRef}
          className="w-full transition-all duration-300 ease-in-out h-fit flex justify-start mt-6"
        >
          <ChatBubble role="model" response={currentResponse} />
        </div>
      ) : (
        <div ref={chatEndRef} />
      )}
    </div>
  );
};

export default ChatFace;
