import React, { useState, useEffect } from 'react';

function CodeEditorSidebar({ visible, onClose, codeEditorTab, setCodeEditorTab, codeEditorContent, setCodeEditorContent, onWidthChange, isMobile }) {
  const [language, setLanguage] = useState('html');
  const [sidebarWidth, setSidebarWidth] = useState('30%');
  
  useEffect(() => {
    const handleResize = () => {
      let newWidth;
      if (window.innerWidth < 640) {
        newWidth = '100%';
      } else if (window.innerWidth < 768) {
        newWidth = '80%';
      } else if (window.innerWidth < 1024) {
        newWidth = '50%';
      } else {
        newWidth = '30%';
      }
      setSidebarWidth(newWidth);
      // Notify parent component of width change
      onWidthChange?.(newWidth);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onWidthChange]);

  return (
    <aside
      id="code-editor-sidebar"
      style={{ width: sidebarWidth }}
      className={`bg-sidebar p-4 h-screen overflow-y-auto shadow-lg fixed right-0 top-0 z-50 transition-all duration-300 ${
        visible ? "open" : "translate-x-full"
      } max-w-screen`}
      aria-label="Code Editor Sidebar"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Code Editor</h2>
          <button 
            onClick={onClose} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors" 
            aria-label="Close code editor"
          >
            <ion-icon name="close-outline" size="small"></ion-icon>
          </button>
        </div>
        
        <div className="flex border-b mb-4">
          <button
            onClick={() => setCodeEditorTab("code")}
            className={`code-tab py-2 px-4 border-b-2 transition-colors ${codeEditorTab==="code" ? "active border-button-dark text-button-dark font-medium" : "border-transparent hover:bg-gray-100"}`}
          >
            Code
          </button>
          <button
            onClick={() => setCodeEditorTab("preview")}
            className={`code-tab py-2 px-4 border-b-2 transition-colors ${codeEditorTab==="preview" ? "active border-button-dark text-button-dark font-medium" : "border-transparent hover:bg-gray-100"}`}
          >
            Preview
          </button>
        </div>
        
        {codeEditorTab==="code" ? (
          <div id="code-tab-content" className="flex-grow flex flex-col">
            <div className="mb-2 flex justify-between items-center">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="javascript">JavaScript</option>
                <option value="jsx">React JSX</option>
              </select>
              <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1">
                <ion-icon name="copy-outline" size="small"></ion-icon>
                Copy
              </button>
            </div>
            <textarea 
              className="code-editor p-4 rounded-lg w-full flex-grow resize-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={codeEditorContent}
              onChange={e => setCodeEditorContent(e.target.value)}
              placeholder="Enter your code here..."
            ></textarea>
          </div>
        ) : (
          <div id="preview-tab-content" className="flex-grow">
            <div className="bg-white p-4 rounded-lg h-full overflow-auto border border-gray-300 shadow-inner" dangerouslySetInnerHTML={{ __html: codeEditorContent }}>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default CodeEditorSidebar;