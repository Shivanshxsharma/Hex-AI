import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
// Prism theme for syntax highlighting
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";

const MarkdownRenderer = ({ content }) => {





  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{

        
       a: ({ href, children, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#4ea1f3', // bright blue
        textDecoration: 'underline'
      }}
      {...props}
    >
      {children}
    </a>
  ),



        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeText = String(children).replace(/\n$/, "");
          

                 const [copied, setCopied] = useState(false);

                const handleCopy = async () => {
                  try {
                    await navigator.clipboard.writeText(codeText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500); // resets after 1.5s
                  } catch (err) {
                    console.error("Failed to copy!", err);
                  }
                };




          if (!inline && match) {
            return (
              <div style={{ position: "relative", margin: "1em 0" }}>
          <button
            onClick={handleCopy}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: "6px 10px",
              fontSize: "12px",
              fontFamily: "monospace",
              backgroundColor: copied ? "#3ba55c" : "#1f1f1f",
              color: copied ? "#fff" : "#ccc",
              border: "1px solid #444",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              zIndex: 1,
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
                <SyntaxHighlighter
                  language={match[1]}
                  style={  vscDarkPlus}
                  PreTag="div"
                  customStyle={{
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                    borderRadius: "8px",
                    padding: "16px",
                    overflowX: "auto",
                  }}
                >
                  {codeText}
                </SyntaxHighlighter>
              </div>
            );
          }

          // ✨ Inline code (no backticks)
          return (
            <span className="force-sans"
              style={{
                backgroundColor: "#2e2e2e",
                padding: "2px 6px",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "90%",
                color: "#ccc",
              }}
            >
              <span className="sans-only">{children}</span>
            </span>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;

