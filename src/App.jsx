// src/App.jsx
/**
 * Root application component that manages the overall layout and state of Tesslate Studio.
 * Handles the main application structure including chat interface, code editor sidebar,
 * and project management. Coordinates between different components and manages global state.
 */
import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import CodeEditorSidebar from './components/CodeEditorSidebar';
import MainChatArea from './components/chat/MainChatArea';
import SettingsModal from './components/settings/SettingsModal';

import useMobile from './hooks/useMobile';
import useChatManager from './hooks/useChatManager';
import useAutocomplete from './hooks/useAutocomplete';
import useLLM from './hooks/useLLM';
import { modelProviderService } from './utils/openaiClient';


const commonPhrases = [
  'Can you explain',
  'How do I',
  'What is the best way to',
  'Write code for',
  'Summarize this',
  'Translate this to'
];

/**
 * Root application component that manages the overall layout and state of Tesslate Studio.
 * Handles the main application structure including chat interface, code editor sidebar,
 * and project management. Coordinates between different components and manages global state.
 */
function App() {
  // Mobile-related state via custom hook
  const { isMobile, sidebarCollapsed, setSidebarCollapsed, showMobileSidebar, setShowMobileSidebar } = useMobile();

  // Chat and project management via custom hook
  const {
    projects,
    chats,
    activeChat,
    setActiveChat,
    handleCreateProject,
    handleRenameProject,
    handleDeleteProject,
    handleCreateChat,
    handleRenameChat,
    handleDeleteChat,
    handleMoveChat,
    setChats,
  } = useChatManager();

  // Local UI state
  const [showCodeEditorSidebar, setShowCodeEditorSidebar] = useState(false);
  const [codeEditorTab, setCodeEditorTab] = useState("code");
  const [codeEditorContent, setCodeEditorContent] = useState("");
  const [codeEditorWidth, setCodeEditorWidth] = useState('30%');
  const [messageInput, setMessageInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  
  // Replace with this
  const llmModels = modelProviderService.getAllModels();

  // Autocomplete hook
  const {
    autocompleteSuggestions,
    showAutocomplete,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
    handleInputChange,
    handleSuggestionClick,
    handleKeyDown,
  } = useAutocomplete(llmModels, commonPhrases);

  // LLM message handling hook
  const { isLLMThinking, sendMessage, regenerateMessage } = useLLM(chats, setChats, activeChat, llmModels);

  useEffect(() => {
    window.openInCodeEditor = (code) => {
      const cleanCode = typeof code === 'string' ? code.trim() : code;
      setCodeEditorContent(cleanCode);
      setCodeEditorTab("code");
      setShowCodeEditorSidebar(true);
      if (isMobile) {
        setSidebarCollapsed(true);
      }
    };
    return () => {
      delete window.openInCodeEditor;
    };
  }, [isMobile, setSidebarCollapsed]);

  const handleSendMessage = async () => {
    if (messageInput.trim() === "") return;
    await sendMessage(messageInput);
    setMessageInput("");
  };

  const handleCodeEditorToggle = () => {
    setShowCodeEditorSidebar(prev => !prev);
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
      setShowMobileSidebar(false);
    }
  };
  

  const handleSettingsToggle = () => setShowSettings(prev => !prev);
  const handleCodeEditorWidthChange = (width) => setCodeEditorWidth(width);

  return (
    <div className="flex h-screen bg-chat-background relative">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => {
          setSidebarCollapsed(!sidebarCollapsed);
          if (isMobile) {
            setShowMobileSidebar(!showMobileSidebar);
          }
        }}
        projects={projects}
        chats={chats}
        activeChat={activeChat}
        onCreateProject={handleCreateProject}
        onRenameProject={handleRenameProject}
        onDeleteProject={handleDeleteProject}
        onCreateChat={handleCreateChat}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        onSelectChat={setActiveChat}
        onMoveChat={handleMoveChat}
        showProjectMenu={null} // adjust as needed
        setShowProjectMenu={() => {}}
        onSettingsClick={handleSettingsToggle}
        isMobile={isMobile}
        showMobileSidebar={showMobileSidebar}
      />

      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      <MainChatArea
        className={`${showCodeEditorSidebar ? "code-editor-open" : ""} ${isMobile ? "mobile-view" : ""}`}
        style={showCodeEditorSidebar ? { width: `calc(100% - ${codeEditorWidth})` } : {}}
        chatMessages={chats.find(chat => chat.id === activeChat)?.messages || []}
        isLLMThinking={isLLMThinking}
        messageInput={messageInput}
        onInputChange={(e) => handleInputChange(e.target.value, setMessageInput)}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        autocompleteSuggestions={autocompleteSuggestions}
        showAutocomplete={showAutocomplete}
        selectedSuggestionIndex={selectedSuggestionIndex}
        onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, messageInput, setMessageInput)}
        onEditMessage={() => {}}
        onToggleCollapse={() => {}}
        onToggleProperties={handleSettingsToggle}
        onToggleCodeEditor={handleCodeEditorToggle}
        onRegenerateMessage={regenerateMessage}
        onToggleSidebar={() => {
          setSidebarCollapsed(!sidebarCollapsed);
          if (isMobile) {
            setShowMobileSidebar(!showMobileSidebar);
          }
        }}
        isMobile={isMobile}
      />

      <CodeEditorSidebar
        visible={showCodeEditorSidebar}
        onClose={handleCodeEditorToggle}
        codeEditorTab={codeEditorTab}
        setCodeEditorTab={setCodeEditorTab}
        codeEditorContent={codeEditorContent}
        setCodeEditorContent={setCodeEditorContent}
        isMobile={isMobile}
        onWidthChange={handleCodeEditorWidthChange}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={handleSettingsToggle}
        isMobile={isMobile}
      />
    </div>
  );
}

export default App;
