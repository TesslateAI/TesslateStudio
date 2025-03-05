// ChatMessages.jsx
import React from 'react';
import UserMessage from './UserMessage';
import LLMMessage from './LLMMessage';

const ChatMessages = ({
  chatMessages,
  isLLMThinking,
  onToggleCollapse,
  onEditMessage,
  onRegenerateMessage
}) => {
  return (
    <div id="chat-messages" className="flex-1 p-4 overflow-y-auto space-y-4 chat-container">
      {chatMessages.map(msg =>
        msg.type === "user" ? (
          <UserMessage key={msg.id} message={msg} onEditMessage={onEditMessage} />
        ) : (
          <LLMMessage 
            key={msg.id} 
            message={msg} 
            onToggleCollapse={() => onToggleCollapse(msg.id)} 
            onEditMessage={onEditMessage}
            onRegenerate={onRegenerateMessage} 
          />
        )
      )}
      {isLLMThinking && (
        <div className="flex justify-start">
          <div className="flex items-center gap-2 border border-[#e5e6e3] rounded-lg p-2 bg-transparent">
            <div>
              <ion-icon name="hourglass-outline" className="w-5 h-5"></ion-icon>
            </div>
            <span>Thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
