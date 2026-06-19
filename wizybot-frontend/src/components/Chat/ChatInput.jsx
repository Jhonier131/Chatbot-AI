import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

/**
 * Component for typing and sending chat messages.
 * @param {Object} props - Component props
 * @param {Function} props.onSend - Callback to execute when a message is sent
 * @param {boolean} props.isLoading - Whether a request is currently pending
 */
export const ChatInput = ({ onSend, isLoading }) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSend(inputText);
      setInputText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <textarea className="chat-textarea" placeholder="Type a message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} disabled={isLoading} rows={1} />
      <button type="submit" className="chat-send-button" disabled={!inputText.trim() || isLoading}>
        {isLoading ? <Loader2 className="icon-spin" size={20} /> : <Send size={20} />}
      </button>
    </form>
  );
};
