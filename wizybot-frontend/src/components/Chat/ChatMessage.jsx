import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';

/**
 * Component to display a single chat message.
 * @param {Object} props - Component props
 * @param {Object} props.message - The message object containing text, sender, and isError flags
 */
export const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}>
      <div className="message-avatar">
        {isUser ? <User size={24} /> : <Bot size={24} />}
      </div>
      <div className="message-content">
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <img className="markdown-image" {...props} alt={props.alt || "AI generated"} />
              )
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};
