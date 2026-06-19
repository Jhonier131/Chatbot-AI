import { useEffect, useRef } from "react";
import { useChat } from "../../hooks/useChat";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

/**
 * Main Chat application component.
 */
export const Chat = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const chatMessagesRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <img src="https://www.wizybot.com/wp-content/uploads/wizybot-logo-negro.webp" alt="WizyBot Logo" className="chat-logo" />
        <h1>Assistant</h1>
      </header>

      <div className="chat-messages" ref={chatMessagesRef} onLoadCapture={scrollToBottom}>
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
      </div>

      <div className="chat-input-container">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
