// ChatInput.jsx
/**
 * Chat input component that handles user message input and model selection.
 * Features autocomplete suggestions for models and common phrases.
 * Supports both mobile and desktop layouts with different input behaviors.
 * Located in the main chat interface at the bottom of the chat area.
 */
import React from 'react';

const ChatInput = ({
  isMobile,
  messageInput,
  onInputChange,
  handleSendMessage,
  onKeyDown,
  showAutocomplete,
  autocompleteSuggestions,
  selectedSuggestionIndex,
  onSuggestionClick
}) => {
  const handleSend = () => {
    const modelMatch = messageInput.match(/@(\w+)/);
    const modelName = modelMatch ? modelMatch[1] : null;
    handleSendMessage(messageInput, modelName);
  };

  return (
    <div className="chat-container relative">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between relative">
            <div className="flex-1 relative">
              {showAutocomplete && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-white/95 backdrop-blur-sm 
                  rounded-lg shadow-lg border border-gray-200 p-3 transform transition-all duration-200 
                  hover:scale-[1.02]">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {autocompleteSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className={`px-2 py-1 text-xs ${
                          selectedSuggestionIndex === index 
                            ? 'bg-blue-200 text-blue-800' 
                            : 'bg-gray-100 text-gray-700'
                        } hover:bg-gray-200 rounded-full transition-colors cursor-pointer`}
                        onClick={() => onSuggestionClick(suggestion)}
                      >
                        {typeof suggestion === "string" ? suggestion : (
                          <div className="flex items-center gap-1">
                            <ion-icon name={suggestion.icon}></ion-icon>
                            <span>{suggestion.name}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <textarea
                type="text"
                id="message-input"
                placeholder={
                  isMobile 
                    ? "Ask me anything..." 
                    : "Ask me anything... Use @ to call a model... (Enter to send, Ctrl+Enter for new line)"
                }
                className="w-full min-h-[44px] max-h-[300px] focus:outline-none focus:ring-0
                  rounded-lg p-2 text-sm resize-none overflow-y-auto transition-all duration-200 ease-in-out
                  bg-transparent backdrop-blur-sm hover:bg-gray-50/50
                  font-sans leading-relaxed"
                aria-label="Message input"
                value={messageInput}
                onChange={(e) => {
                  onInputChange(e);
                  e.target.style.height = 'inherit';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                  onKeyDown?.(e);
                }}
                style={{ transition: 'height 0.2s ease-in-out' }}
              />
            </div>
            <button
              onClick={handleSend}
              id="send-message"
              className="bg-button-dark text-white p-2.5 rounded-full ml-2 hover:bg-gray-800 
                focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center
                transition-all duration-200 hover:scale-105"
              aria-label="Send message"
            >
              <ion-icon name="paper-plane-outline" className="w-5 h-5"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;