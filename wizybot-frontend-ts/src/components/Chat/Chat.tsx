import { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';

/**
 * Main Chat application component.
 * Handles the overall layout, message list, and auto-scrolling behavior.
 */
export const Chat = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  const scrollToBottom = (): void => {
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
        <img
          src="https://www.wizybot.com/wp-content/uploads/wizybot-logo-negro.webp"
          alt="WizyBot Logo"
          className="chat-logo"
        />
        <h1>Assistant</h1>
      </header>

      <div
        className="chat-messages"
        ref={chatMessagesRef}
        onLoad={scrollToBottom}
      >
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <p>Hello! How can I help you today?</p>
            <span className="chat-suggestion">Try: &ldquo;Find me an iphone&rdquo;</span>
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
