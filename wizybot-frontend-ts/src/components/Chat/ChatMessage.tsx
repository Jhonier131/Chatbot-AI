import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import type { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
}

/**
 * Component to display a single chat message.
 * Renders user messages as plain text and bot messages as Markdown.
 */
export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`chat-message ${isUser ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}
    >
      <div className="message-avatar">
        {isUser ? <User size={24} /> : <Bot size={24} />}
      </div>
      <div className="message-content">
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <ReactMarkdown
            components={{
              img: ({ ...props }) => (
                <img
                  className="markdown-image"
                  {...props}
                  alt={props.alt ?? 'AI generated'}
                />
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};
