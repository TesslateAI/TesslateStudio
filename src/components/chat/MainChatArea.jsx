// MainChatArea.jsx
import React, { useState } from 'react';
import ChatMessages from './ChatMessages'; // Assuming ChatMessages.jsx is in the same directory
import ChatInput from './ChatInput';
import Toolbar from './Toolbar';
import GitHubModal from './GitHubModal';
import PromptLibrary from './PromptLibrary';
import ForgePanel from '../forgeppanel/ForgePanel';
import { modelProviderService, DEFAULT_MODEL } from '../../utils/openaiClient';

function MainChatArea({
  className,
  style,
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
  onToggleCollapse, // Make sure this prop is passed to MainChatArea
  onToggleProperties,
  onToggleCodeEditor,
  onRegenerateMessage,
  onToggleSidebar,
  isMobile
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
  // Handle sending a message using a model called with the @ syntax, defaulting if not provided
  const handleSendMessage = async () => {
    const modelMatch = messageInput.match(/@(\S+)/);
    let modelName = modelMatch ? modelMatch[1].toLowerCase() : DEFAULT_MODEL;

    // Get the actual model info from the service
    const modelInfo = modelMatch ?
      modelProviderService.getModelByName(modelName) :
      modelProviderService.getDefaultModel();

    if (typeof onSendMessage === 'function') {
      // Pass the full model info instead of just the ID
      onSendMessage(modelInfo);
    }
  };
  return (
    <main
      className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-300 ${className}`}
      style={style}
    >
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

      <ChatMessages
        chatMessages={chatMessages}
        isLLMThinking={isLLMThinking}
        onToggleCollapse={onToggleCollapse} // Pass onToggleCollapse prop here
        onEditMessage={onEditMessage}
        onRegenerateMessage={onRegenerateMessage}
      />

      <div className="p-4 chat-container relative">
        <div className="bg-white rounded-xl shadow-lg">
          <ChatInput
            isMobile={isMobile}
            messageInput={messageInput}
            onInputChange={onInputChange}
            handleSendMessage={handleSendMessage}
            onKeyDown={onKeyDown}
            showAutocomplete={showAutocomplete}
            autocompleteSuggestions={autocompleteSuggestions}
            selectedSuggestionIndex={selectedSuggestionIndex}
            onSuggestionClick={onSuggestionClick}
          />
          <Toolbar
            isMobile={isMobile}
            setShowPromptLibrary={setShowPromptLibrary}
            setShowGitHubModal={setShowGitHubModal}
            setShowForgePanel={setShowForgePanel}
          />
        </div>
      </div>
      <GitHubModal
        showGitHubModal={showGitHubModal}
        setShowGitHubModal={setShowGitHubModal}
        githubRepo={githubRepo}
        setGithubRepo={setGithubRepo}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
      />

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