import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

/**
 * Component for typing and sending chat messages.
 * Supports sending via button click or Enter key (Shift+Enter for newline).
 */
export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [inputText, setInputText] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSend(inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !isLoading) {
        onSend(inputText);
        setInputText('');
      }
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <textarea
        className="chat-textarea"
        placeholder="Type a message..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        rows={1}
      />
      <button
        type="submit"
        className="chat-send-button"
        disabled={!inputText.trim() || isLoading}
      >
        {isLoading ? <Loader2 className="icon-spin" size={20} /> : <Send size={20} />}
      </button>
    </form>
  );
};
