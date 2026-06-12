import { useRef, useEffect, useState } from "react";
import submit from '../assets/up-arrow.png';
import stop from '../assets/stop-button.png';
import Suggestions from "./Suggestions";

function ChatInput({ startGenerating, setstartGenerating, setisloading, SuggestionArray, fillSugg, suggestion, Headline, submitHandler }) {
  const textareaRef = useRef(null);
  const [hasInput, setHasInput] = useState(false);

  const aiPlaceholders = {
    Normal: "Ask me anything — from quick facts to deep explanations...",
    Astro: "Curious about black holes, planets, or galaxies? Ask away...",
    Friend: "Need someone to talk to? Share your thoughts here...",
    Code: "Describe your coding problem or paste your code snippet...",
    Movies: "Looking for movie recommendations or reviews? Let's talk cinema...",
    Career: "Need advice on resumes, interviews, or career paths?",
    Study: "Ask me about your subject, topic, or concept you're learning...",
    Therapist: "Tell me what's on your mind — I'm here to listen..."
  };

  useEffect(() => {
    if (fillSugg) {
      textareaRef.current.value = suggestion;
      setHasInput(suggestion?.trim().length > 0);
    }
  }, [fillSugg, suggestion]);

  const handleInput = () => {
    const el = textareaRef.current;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    setHasInput(el.value.trim().length > 0);
  };

  const handleSubmit = () => {
    const value = textareaRef.current.value.trim();
    if (!value) return;
    submitHandler(value);
    setstartGenerating(true);
    textareaRef.current.value = "";
    textareaRef.current.style.height = 'auto';
    setHasInput(false);
  };

  return (
    <div className="w-full absolute bottom-0 right-0 flex justify-center">
      <div
        id="chatInputBox"
        className="relative bg-[#1a1a1a] border border-[#2e2e2e] shadow-lg shadow-black/30 md:w-[50vw] w-[90%] overflow-hidden max-h-[30vh] flex items-end rounded-[28px]"
      >

        {/* Textarea */}
        <textarea
          id="inputText"
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          onInput={handleInput}
          className="focus:outline-none py-4 pl-7 pr-14 text-left align-top w-full min-h-[56px] max-h-[25vh] overflow-y-auto bg-transparent resize-none text-[15px] text-neutral-200 placeholder-neutral-500"
          placeholder={`${aiPlaceholders[Headline] || "Ask me anything..."}`}
          rows={1}
        ></textarea>

        {/* Submit / Stop Button */}
        <div className="absolute right-2.5 bottom-2 flex-shrink-0">
          <button
            style={{ display: !startGenerating ? "flex" : "none" }}
            onClick={handleSubmit}
            disabled={!hasInput}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none ${hasInput
                ? "bg-white hover:bg-neutral-200 cursor-pointer"
                : "bg-[#3a3a3a] cursor-not-allowed"
              }`}
          >
            <img src={submit} alt="Send" className={`w-4 h-4 ${!hasInput ? "opacity-30" : ""}`} />
          </button>
          <button
            style={{ display: startGenerating ? "flex" : "none" }}
            onClick={() => { setstartGenerating(false); setisloading(false); }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-neutral-200 transition-all duration-200 focus:outline-none"
          >
            <img src={stop} alt="Stop" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
