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
                        margin: 0, // Remove default margins
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

      {/* COLLAPSIBLE SOURCES SECTION */}
      {sources?.length > 0 && (
        <div
          style={{
            marginTop: "0.75rem",
            borderTop: "1px solid #444",
            paddingTop: "0.5rem",
          }}
        >
          <button
            onClick={() => setShowSources(!showSources)}
            style={{
              background: "transparent",
              color: "#4ea1f3",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: "underline",
              padding: 0,
              margin: 0,
            }}
          >
            {showSources ? "Hide Sources ▲" : "Show Sources ▼"}
          </button>

          {showSources && (
            <ul
              style={{
                marginTop: "8px",
                marginBottom: 0,
                paddingLeft: "20px",
                color: "#ccc",
                fontSize: "14px",
              }}
            >
              {sources.map((src, i) => (
                <li key={i} style={{ margin: "4px 0" }}>
                  <a
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#4ea1f3" }}
                  >
                    {src.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownRenderer;



