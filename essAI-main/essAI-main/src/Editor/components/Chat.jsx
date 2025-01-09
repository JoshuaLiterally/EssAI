import { useState, useRef, useEffect } from "react";
import "./Chat.css";
import PropTypes from "prop-types";
import "remixicon/fonts/remixicon.css"; // Import Remix Icon
import OpenAI from "openai";

const Suggestions = ({ onSuggestionClick }) => {
  const suggestions = [
    "Help me improve this paragraph",
    "Suggest a better way to phrase this",
    "Make this section more concise",
    "Fix any grammatical errors",
    "Make this more professional",
  ];

  return (
    <div className="suggestions">
      <div className="suggestions-header">
        <i className="ri-lightbulb-line"></i>
        <span>Suggestions</span>
      </div>
      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="suggestion-item"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <i className="ri-chat-1-line"></i>
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
};

const CodeBlock = ({ codeContent, handleAction, copyToClipboard }) => {
  const [isPreview, setIsPreview] = useState(true);
  const [isAILoading, setIsAILoading] = useState(false);

  return (
    <div className="proposed-change">
      <div className="preview-toggle">
        <button onClick={() => setIsPreview(!isPreview)}>
          <i className={`ri-${isPreview ? "code-line" : "eye-line"}`}></i>
          {isPreview ? " Show Raw" : " Show Preview"}
        </button>
      </div>
      {isPreview ? (
        <div
          className="html-preview"
          dangerouslySetInnerHTML={{ __html: codeContent }}
        />
      ) : (
        <pre>{codeContent}</pre>
      )}
      <div className="action-icons">
        <i
          className={`ri-${isAILoading ? "loader-4-line" : "magic-line"} ${isAILoading ? "red-spinner" : ""}`}
          onClick={() => handleAction("insertUsingAI", codeContent, setIsAILoading)}
          title="Insert into editor using AI"
        ></i>
        <i
          className="ri-add-circle-line"
          onClick={() => handleAction("insert", codeContent)}
          title="Insert at cursor"
        ></i>
        <i
          className="ri-file-copy-line"
          onClick={() => copyToClipboard(codeContent)}
          title="Copy to clipboard"
        ></i>
      </div>
    </div>
  );
};

CodeBlock.propTypes = {
  codeContent: PropTypes.string.isRequired,
  handleAction: PropTypes.func.isRequired,
  copyToClipboard: PropTypes.func.isRequired,
};

const Chat = ({ editor }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesRef = useRef(null); // Add this line
  const messagesEndRef = useRef(null);
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && editor) {
      const userMessage = { sender: "User", text: newMessage };
      setMessages([...messages, userMessage]);
      setNewMessage("");
      setIsLoading(true);

      const retryWithBackoff = async (fn, retries = 5, delay = 1000) => {
        try {
          return await fn();
        } catch (error) {
          if (retries === 0 || error.response?.status !== 429) throw error;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return retryWithBackoff(fn, retries - 1, delay * 2);
        }
      };

      try {
        const editorContent = editor.getHTML();
        const response = await retryWithBackoff(() =>
          openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a writing assistant on a rich text editor. If the user asks for a change to the document, provide the proposed change between triple backticks (```). Do NOT indicate a language, it is not neccessary. If the user does not ask for a change, do not create a change suggestion. If you do create a change suggestion, please provide a brief explanation of the change.",
              },
              {
                role: "user",
                content: `Here is the current document content: ${editorContent}\n\nUser's request: ${newMessage}\n\n `,
              },
            ],
          })
        );

        if (response.choices && response.choices.length > 0) {
          const assistantReply = response.choices[0].message.content.trim();
          const assistantMessage = {
            sender: "Assistant",
            text: assistantReply,
          };
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        } else {
          throw new Error("No response from the assistant.");
        }
      } catch (error) {
        console.error("Error:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "Assistant",
            text: "An error occurred. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAction = async (action, content, setIsAILoading) => {
    if (editor) {
      if (action === "insert") {
        editor.chain().focus().insertContent(content).run();
      } else if (action === "insertUsingAI") {
        setIsAILoading(true);
        try {
          const editorContent = editor.getHTML();
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a writing assistant on a rich text editor. Insert the provided content into the document in a way that makes sense. If necessary, remove any conflicting content to ensure the new content fits correctly. Do not provide anything except for the content",
              },
              {
                role: "user",
                content: `Here is the current document content: ${editorContent}\n\nContent to insert: ${content}\n\n `,
              },
            ],
          });
  
          if (response.choices && response.choices.length > 0) {
            const updatedContent = response.choices[0].message.content.trim();
            editor.commands.setContent(updatedContent);
          } else {
            throw new Error("No response from the assistant.");
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsAILoading(false);
        }
      }
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
  };

  const renderMessage = (message) => {
    const parts = message.text.split(/```/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const codeContent = part.trim();
        return (
          <CodeBlock
            key={index}
            codeContent={codeContent}
            handleAction={handleAction}
            copyToClipboard={copyToClipboard}
          />
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <div className="chat">
      {/* <div className="chat-header">  not sure if i liked this
        <h1>Chat</h1>
      </div> */}
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.length === 0 ? (
          <Suggestions
            onSuggestionClick={(suggestion) => setNewMessage(suggestion)}
          />
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender.toLowerCase()}`}
              >
                <div className="message-header">
                  <div className="profile-pic">
                    {message.sender === "User" ? (
                      <i className="ri-user-fill"></i>
                    ) : (
                      <i className="ri-robot-fill"></i>
                    )}
                  </div>
                  <span className="sender-name">{message.sender}</span>
                </div>
                <div className="message-content">{renderMessage(message)}</div>
              </div>
            ))}
          </>
        )}
        {isLoading && (
          <div className="chat-message assistant">
            <div className="message-header">
              <div className="profile-pic">
                <i className="ri-robot-fill"></i>
              </div>
              <span className="sender-name">Assistant</span>
            </div>
            <div className="message-content">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <textarea
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            // Auto-resize
            e.target.style.height = "inherit";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage}>
          <i className="ri-send-plane-2-fill"></i>
        </button>
      </div>
    </div>
  );
};

Chat.propTypes = {
  editor: PropTypes.object.isRequired,
};

Suggestions.propTypes = {
  onSuggestionClick: PropTypes.func.isRequired,
};

export default Chat;