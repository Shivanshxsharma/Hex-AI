import ReactMarkdown from "react-markdown";
import Typewriter from 'typewriter-effect';
import MarkdownRenderer from "./MarkdownRenderer";
import TextType from "./animations/TextType";

function ChatBubble({ role, response }) {
  return (
    <div
      style={{
        border: role === "model" ? "2px solid #2E2E2E" : "none",
        backgroundColor: role === "user" ? "#2E2E2E" : "transparent",
      }}
      className="p-5 w-fit transition-all duration-300 ease-in-out rounded-2xl"
    >
      <div
        className={`prose prose-invert max-w-[80vw] text-white ${
          role === "model" ? "md:max-w-[50vw]" : "md:max-w-[80vw]"
        }`}
      >
        <MarkdownRenderer content={response} />
      </div>
    </div>
  );
}

export default ChatBubble;
