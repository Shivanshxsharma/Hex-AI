import { useRef,useEffect } from "react";
import submit from '../assets/up-arrow.png';
import stop from '../assets/stop-button.png';
import Suggestions from "./Suggestions";
function ChatInput({startGenerating,setstartGenerating,setisloading,SuggestionArray,fillSugg,suggestion,Headline,submitHandler}) {
  const textareaRef = useRef(null);
  


  useEffect(() => {
    if (fillSugg) {
    textareaRef.current.value=suggestion;
      
    }

  }, [fillSugg,suggestion])
  

  

  const handleInput = () => {
    const el = textareaRef.current;
    
    el.style.height = 'auto'; // Reset
    el.style.height = el.scrollHeight + 'px'; // Adjust to content
  };


  return (
    
    <div className="w-full   absolute bottom-0 transition-all duration-300 right-0 flex justify-center">
      
  <div className="  shadow-md  rounded-[45px] bg-[#202020] backdrop-blur-md border-2  shadow-[#000000] transition-all duration-300  border-[#404040] min-h-[7.5vh] flex flex-col justify-between   md:w-[50vw] w-[90%] overflow-hidden max-h-[30vh] md:max-h-[30vh]">
    <div className="w-full h-[76%] bg-[#202020]">
    <textarea
    id="inputText"
      ref={textareaRef}
      onKeyDown={(e)=>{
          if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevents newline on Enter
      submitHandler(textareaRef.current.value);
      textareaRef.current.value=""
    }} }
      onInput={handleInput}
      className=" focus:outline-none  p-3 text-left mt-0 align-top w-full  h-[7.5vh] max-h-full overflow-y-auto bg-[#202020]  resize-none scrollbar-thin scrollbar-thumb-[#888] scrollbar-track-transparent"
      placeholder={`Ask ${Headline || ""}`}


    ></textarea>
    </div>





    <div className="w-full h-[0vh] md:h-[0vh] bg-[#202020] transition-all duration-300   flex items-end justify-between px-2 pb-2">
      <div className=" w-[92%] h-full items-center transition-all duration-300 ">
      </div>
    <button style={{display:!startGenerating?"block":"none"}} onClick={()=>{submitHandler(textareaRef.current.value) ,textareaRef.current.value="" }} className=" hover:opacity-50 hover:cursor-pointer transition-all duration-100 bg-white h-[35px] mb-1.5 md:mb-2.5 flex p-2 justify-center w-[35px] rounded-full"><img src={submit} /></button>
    <button style={{display:startGenerating?"block":"none"}} onClick={()=>{setstartGenerating(false),setisloading(false) }} className=" hover:opacity-50 hover:cursor-pointer transition-all duration-100 bg-white h-[35px] flex p-2 justify-center mb-1.5 md:mb-2.5 w-[35px] rounded-full"><img src={stop} /></button>
    </div>
  </div>
</div>

  )
}

export default ChatInput
