import { useEffect, useRef } from "react";
import { useChat } from "../../hooks/useChat";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

/**
 * Main Chat application component.
 */
export const Chat = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <img src="https://www.wizybot.com/wp-content/uploads/wizybot-logo-negro.webp" alt="WizyBot Logo" className="chat-logo" />
        <h1>Assistant</h1>
      </header>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <p>Hello! How can I help you today?</p>
            <span className="chat-suggestion">Try: "Find me an iphone"</span>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
        {isLoading && (
          <div className="chat-loading-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
