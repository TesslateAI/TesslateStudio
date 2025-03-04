import React, { useState, useRef } from 'react';
import UserMessage from './UserMessage';
import LLMMessage from './LLMMessage';
import PromptLibrary from './PromptLibrary';
// Add import for OpenAI client
import { openai, DEFAULT_MODEL } from '../utils/openaiClient';
import ForgePanel from './ForgePanel';

function MainChatArea({
  className,
  style, // Add style prop
  chatMessages,
  isLLMThinking,
  messageInput,
  onInputChange,
  onSendMessage,
  onKeyDown,
  autocompleteSuggestions,
  showAutocomplete,
  selectedSuggestionIndex,
  onSuggestionClick,
  onEditMessage,
  onToggleCollapse,
  onToggleProperties,
  onToggleCodeEditor,
  onRegenerateMessage,
  onToggleSidebar, // Add this prop
  isMobile // Add this prop
}) {
    const [showPromptLibrary, setShowPromptLibrary] = useState(false);
    const [showGitHubModal, setShowGitHubModal] = useState(false);
    const [githubRepo, setGithubRepo] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('main');
  const [showForgePanel, setShowForgePanel] = useState(false);

  const handleSelectPrompt = (promptText) => {
    onInputChange({ target: { value: promptText } });
    setShowPromptLibrary(false);
  };

  // Add function to handle sending message with default model if no model is specified
  const handleSendMessage = async () => {
    // Check if a specific model is called using @ syntax
    const modelMatch = messageInput.match(/@(\S+)/);
    const model = modelMatch ? modelMatch[1] : DEFAULT_MODEL;
    
    // Call the parent's onSendMessage with the model information
    if (typeof onSendMessage === 'function') {
      onSendMessage(model);
    }
  };
  
  return (
    <main 
      className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-300 ${className}`}
      style={style} // Apply the style prop
    >
      {/* Add mobile menu button */}
      {isMobile && (
        <button
          onClick={onToggleSidebar}
          className="absolute top-4 left-4 z-10 bg-transparent hover:bg-gray-100/50 text-gray-600 p-2 rounded-lg flex items-center gap-1 backdrop-blur-sm transition-all duration-200"
          aria-label="Toggle sidebar menu"
        >
          <ion-icon name="menu-outline"></ion-icon>
        </button>
      )}
      
      <button
        onClick={onToggleCodeEditor}
        className="absolute top-4 right-4 z-10 bg-transparent hover:bg-gray-100/50 text-gray-600 p-2 rounded-lg flex items-center gap-1 backdrop-blur-sm transition-all duration-200"
        aria-label="Toggle code editor"
      >
        <ion-icon name="code-slash-outline"></ion-icon>
      </button>

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
              <div className="animate-pulse">
                <ion-icon name="hourglass-outline" className="w-5 h-5"></ion-icon>
              </div>
              <span>Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 chat-container relative">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3 relative">
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
                placeholder={isMobile ? "Ask me anything..." : "Ask me anything... Use @ to call a model... (Enter to send, Ctrl+Enter for new line)"}
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
                    handleSendMessage();
                  }
                  onKeyDown?.(e);
                }}
                style={{
                  transition: 'height 0.2s ease-in-out',
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              id="send-message"
              className="bg-button-dark text-white p-2.5 rounded-full ml-2 hover:bg-gray-800 
                focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center
                transition-all duration-200 hover:scale-105"
              aria-label="Send message"
            >
              <ion-icon name="paper-plane-outline" className="w-5 h-5"></ion-icon>
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto px-1 text-gray-500">
            {/* Mobile-optimized toolbar */}
            {isMobile ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <button className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400" aria-label="Upload file">
                    <ion-icon name="cloud-upload-outline" className="text-lg"></ion-icon>
                  </button>
                  <button className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 ml-2" aria-label="Upload image">
                    <ion-icon name="image-outline" className="text-lg"></ion-icon>
                  </button>
                </div>
                
                <div className="flex items-center">
                  <button 
                    onClick={() => setShowPromptLibrary(true)} 
                    className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    aria-label="Open prompt library"
                  >
                    <ion-icon name="search-outline" className="text-lg"></ion-icon>
                  </button>
                  <button className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 ml-2" aria-label="Improve prompt">
                    <ion-icon name="flash-outline" className="text-lg"></ion-icon>
                  </button>
                  <button
                    onClick={() => setShowGitHubModal(true)}
                    className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 ml-2"
                    aria-label="Connect GitHub repository"
                  >
                    <ion-icon name="logo-github" className="text-lg"></ion-icon>
                  </button>
                  <button 
                    onClick={() => setShowForgePanel(true)}
                    className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 ml-2"
                  >
                    <span className="forge-logo text-lg font-semibold">F</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Desktop toolbar - unchanged */
              <>
                <div className="flex items-center">
                  <button className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-1.5" aria-label="Upload file">
                    <ion-icon name="cloud-upload-outline" className="text-lg"></ion-icon>
                    <span className="text-sm font-medium">Upload</span>
                  </button>
                  <div className="text-gray-300 mx-2">|</div>
                  <button className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-1.5" aria-label="Upload image">
                    <ion-icon name="image-outline" className="text-lg"></ion-icon>
                    <span className="text-sm font-medium">Image</span>
                  </button>
                </div>

                <div className="text-gray-300">|</div>

                <div className="flex items-center">
                  <button 
                    onClick={() => setShowPromptLibrary(true)} 
                    className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-1.5"
                    aria-label="Open prompt library"
                  >
                    <ion-icon name="search-outline" className="text-lg"></ion-icon>
                    <span className="text-sm font-medium">Prompt Library</span>
                  </button>
                  <div className="text-gray-300 mx-2">|</div>
                  <button className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-1.5" aria-label="Improve prompt">
                    <ion-icon name="flash-outline" className="text-lg"></ion-icon>
                    <span className="text-sm font-medium">Improve</span>
                  </button>
                </div>

                <div className="ml-auto flex items-center">
                  <button
                    onClick={() => setShowGitHubModal(true)}
                    className="flex items-center gap-1.5 hover:text-gray-800 p-1.5 rounded transition-colors duration-200 
                      focus:outline-none focus:ring-2 focus:ring-gray-400 group"
                    aria-label="Connect GitHub repository"
                  >
                    <ion-icon name="logo-github" className="text-lg"></ion-icon>
                    <span className="text-sm font-medium flex items-center gap-1">
                      GitHub
                      <ion-icon 
                        name="git-branch-outline" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      ></ion-icon>
                    </span>
                  </button>
                  <div className="text-gray-300 mx-2">|</div>
                  <button 
                    onClick={() => setShowForgePanel(true)}
                    className="flex items-center gap-1.5 hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <span className="forge-logo text-lg font-semibold">F</span>
                    <span className="text-sm font-medium">FORGE</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fix GitHub Modal for better mobile experience */}
      {showGitHubModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg w-full max-w-[500px] max-h-[80vh] flex flex-col shadow-xl border border-[#e5e6e3]">
            <div className="flex justify-between items-center p-4 border-b border-[#e5e6e3]">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
                <ion-icon name="logo-github"></ion-icon>
                Connect GitHub Repository
              </h2>
              <button 
                onClick={() => setShowGitHubModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <ion-icon name="close-outline" size="large"></ion-icon>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repository URL</label>
                  <input 
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select 
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <option value="main">main</option>
                    <option value="master">master</option>
                    <option value="development">development</option>
                  </select>
                </div>
                <button 
                  onClick={() => {
                    // Handle repository connection here
                    setShowGitHubModal(false);
                  }}
                  className="w-full bg-button-dark text-white py-2 rounded-lg hover:bg-gray-800 
                    transition-colors flex items-center justify-center gap-2"
                >
                  <ion-icon name="git-network-outline"></ion-icon>
                  Connect Repository
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ForgePanel
        isOpen={showForgePanel}
        onClose={() => setShowForgePanel(false)}
      />
      <PromptLibrary
        isOpen={showPromptLibrary}
        onClose={() => setShowPromptLibrary(false)}
        onSelectPrompt={handleSelectPrompt}
      />
    </main>
  );
}

export default MainChatArea;