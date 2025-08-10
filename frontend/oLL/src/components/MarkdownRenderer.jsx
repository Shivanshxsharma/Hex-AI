import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";

const MarkdownRenderer = ({ content, sources }) => {
  const [showSources, setShowSources] = useState(false);

  return (
    <div>
      {/* MARKDOWN CONTENT */}
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Reset paragraph margins
            p: ({ children }) => (
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                {children}
              </p>
            ),

            // Reset heading margins  
            h1: ({ children }) => (
              <h1 style={{ margin: "0.5em 0 0.25em 0" }}>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 style={{ margin: "0.5em 0 0.25em 0" }}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ margin: "0.5em 0 0.25em 0" }}>
                {children}
              </h3>
            ),

            // Reset list margins
            ul: ({ children }) => (
              <ul style={{ margin: "0.5em 0", paddingLeft: "1.5em" }}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol style={{ margin: "0.5em 0", paddingLeft: "1.5em" }}>
                {children}
              </ol>
            ),

            a: ({ href, children, ...props }) => (
              <a
                
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textWrap:"wrap",
                  color: "#4ea1f3",
                  textDecoration: "underline",
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
                  setTimeout(() => setCopied(false), 1500);
                } catch (err) {
                  console.error("Failed to copy!", err);
                }
              };

              if (!inline && match) {
                return (
                  <div style={{ position: "relative", margin: "0.5em 0" }}>
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
                      style={vscDarkPlus}
                      PreTag="div"
                      customStyle={{
                        fontFamily: "'Fira Code', 'Courier New', monospace",
                        borderRadius: "8px",
                        padding: "16px",
                        overflowX: "auto",
                        margin: 0,
                      }}
                    >
                      {codeText}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              return (
                <span
                  style={{
                    backgroundColor: "#2e2e2e",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    fontSize: "90%",
                    color: "#ccc",
                  }}
                >
                  {children}
                </span>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* SMOOTH ANIMATED SOURCES SECTION */}
{sources?.length > 0 && (
  <div
    style={{
      marginTop: "0.75rem",
      borderTop: "1px solid #374151",
      paddingTop: "0.75rem",
    }}
  >
    <button
      onClick={() => setShowSources(!showSources)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "transparent",
        color: "#9CA3AF",
        border: "none",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "500",
        padding: "0.25rem 0",
        margin: 0,
        transition: "all 0.2s ease-out",
        opacity: showSources ? 1 : 0.8,
      }}
      className="hover:text-gray-300 hover:translate-x-0.5"
    >
      <span
        style={{
          display: "inline-block",
          transform: showSources ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
          fontSize: "10px",
        }}
      >
        ▼
      </span>
      <span>Sources ({sources?.length})</span>
    </button>

    <div

    id="ChatFace"
      style={{


        overflowY: scroll,
        maxHeight: showSources ? "320px" : "0",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: showSources ? 1 : 0,
        transform: showSources ? "translateY(0)" : "translateY(-10px)",
      }}
    >
      <ul
        style={{
          marginTop: "8px",
          marginBottom: 0,
          paddingLeft: "0",
          listStyle: "none",
          color: "#D1D5DB",
          fontSize: "12px",
        }}
      >
        {sources?.map((src, i) => (
          <li
            key={i}
            style={{
              margin: "8px 0",
              transition: "all 0.3s ease-out",
              transform: showSources ? "translateX(0)" : "translateX(-20px)",
              opacity: showSources ? 1 : 0,
              transitionDelay: `${i * 50}ms`,
            }}
          >
            <a
              href={src?.uri}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "12px",
                backgroundColor: "rgba(31, 41, 55, 0.3)",
                border: "1px solid rgba(55, 65, 81, 0.5)",
                borderRadius: "8px",
                color: "#D1D5DB",
                textDecoration: "none",
                fontSize: "12px",
                lineHeight: "1.5",
                transition: "all 0.2s ease-out",
              }}
              className="hover:bg-gray-800/60 hover:border-red-600/80 hover:text-gray-100 hover:translate-x-1 group"
            >
              <span
                style={{
                  flexShrink: 0,
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#DC2626",
                  borderRadius: "50%",
                  marginTop: "6px",
                  opacity: "0.6",
                  transition: "opacity 0.2s ease",
                }}
                className="group-hover:opacity-90"
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: "#E5E7EB",
                    fontWeight: "500",
                    marginBottom: "4px",
                  }}
                >
                  {src?.title?.length > 60 
                    ? `${src.title.substring(0, 60)}...` 
                    : src?.title || 'Untitled Source'
                  }
                </div>
                <div
                  style={{
                    color: "#9CA3AF",
                    fontSize: "10px",
                    opacity: "0.7",
                  }}
                >
                  {new URL(src.uri).hostname}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}
    </div>
  );
};

export default MarkdownRenderer;



