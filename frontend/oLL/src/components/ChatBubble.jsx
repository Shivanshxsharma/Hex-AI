import ReactMarkdown from "react-markdown";
import Typewriter from 'typewriter-effect';
import MarkdownRenderer from "./MarkdownRenderer";
import TextType from "./animations/TextType";

function ChatBubble({ role, response ,sources }) {
  return (
    <div
      style={{
        border: role === "model" ? "2px solid #2E2E2E" : "none",
        backgroundColor: role === "user" ? "#2E2E2E" : "transparent",

      }}
   className={`${role==="user"?"p-3":"p-5"} w-fit transition-all duration-300 ease-in-out ${
    role === "user" ? "rounded-[40px]" : "rounded-[25px]"
   }`}
    >
      <div
        className={`prose prose-invert w-fit max-w-[80vw] text-white ${
          role === "model" ? "md:max-w-[50vw]" : "md:max-w-[30vw]"
        }`}
      >
        <MarkdownRenderer content={response} sources={sources} />
      </div>
    </div>
  );
}

export default ChatBubble;
