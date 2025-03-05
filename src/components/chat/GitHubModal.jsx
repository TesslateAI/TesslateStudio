// GitHubModal.jsx
import React from 'react';

const GitHubModal = ({ 
  showGitHubModal, 
  setShowGitHubModal, 
  githubRepo, 
  setGithubRepo, 
  selectedBranch, 
  setSelectedBranch 
}) => {
  if (!showGitHubModal) return null;
  
  return (
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
  );
};

export default GitHubModal;
