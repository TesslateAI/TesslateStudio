// Toolbar.jsx
import React from 'react';

const Toolbar = ({
  isMobile,
  setShowPromptLibrary,
  setShowGitHubModal,
  setShowForgePanel
}) => {
  return (
    <div className="p-4 chat-container relative">
      {isMobile ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <button 
              className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400" 
              aria-label="Upload file"
            >
              <ion-icon name="cloud-upload-outline" className="text-lg"></ion-icon>
            </button>
            <button 
              className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 ml-2" 
              aria-label="Upload image"
            >
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
            <button 
              className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 ml-2"
              aria-label="Deep Research"
              onClick={() => window.sendMessage("@deep-research")}
            >
              <ion-icon name="library-outline" className="text-lg"></ion-icon>
            </button>
            <button 
              className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 ml-2"
              aria-label="Improve prompt"
            >
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-1.5" 
              aria-label="Upload file"
            >
              <ion-icon name="cloud-upload-outline" className="text-lg"></ion-icon>
              <span className="text-sm font-medium">Upload</span>
            </button>
            <div className="text-gray-300 mx-2">|</div>
            <button 
              className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-1.5" 
              aria-label="Upload image"
            >
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
            <button 
              className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-1.5"
              aria-label="Deep"
              onClick={() => window.sendMessage("@deep-research")}
            >
              <ion-icon name="library-outline" className="text-lg"></ion-icon>
              <span className="text-sm font-medium">Deep</span>
            </button>
            <div className="text-gray-300 mx-2">|</div>
            <button 
              className="hover:text-gray-800 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-1.5"
              aria-label="Improve prompt"
            >
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
        </div>
      )}
    </div>
  );
};

export default Toolbar;
