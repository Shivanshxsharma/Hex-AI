import React from 'react'
import { useEffect } from 'react';
const Suggestions = ({ SuggestionArray,setfillSugg,setsuggestion }) => {

  return (
<div id='sug-box' className=" flex h-full flex-col text-wrap items-start gap-2 overflow-y-auto overflow-x-hidden whitespace-nowrap transition-all duration-500 pb-0 ">
  {SuggestionArray?.map((element, index) => (
    <button onClick={()=>{setfillSugg(true) 
      setsuggestion(element)}}
      key={index}
      className="inline-block rounded-[5px] text-wrap text-left hover:bg-[#2e2e2e] bg-[#171717] text-white p-2 mx-2"
    >
      {element}
    </button>
  ))}
</div>

  );
};

export default Suggestions;
