import React, { useState, useEffect, useRef } from 'react';

function LLMMessage({ message, onToggleCollapse, onEditMessage, onRegenerate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const contentRef = useRef(null);
  const [processedContent, setProcessedContent] = useState('');

  // Function to handle style selection
  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    // You would typically send this selection to your backend or state management
  };

  // Process the content to transform HTML previews into code artifact boxes
  const processContent = (content) => {
    if (!content) return '';
    
    // Replace onclick attributes with data attributes
    let processed = content.replace(/onclick="([^"]+)"/g, 'data-action="open-editor"');
    
    // Replace HTML preview blocks with simplified artifact boxes
    processed = processed.replace(
      /<div class="preview-content.*?<\/div>\s*<\/div>\s*<\/div>/gs,
      '<div class="artifact-box" data-action="view-code">' +
        '<div class="artifact-icon"><ion-icon name="code-slash-outline"></ion-icon></div>' +
        '<div class="artifact-title">Website Preview</div>' +
        '<div class="artifact-action">Click to view code</div>' +
      '</div>'
    );
    
    return processed;
  };

  // Update processed content when message content changes
  useEffect(() => {
    setProcessedContent(processContent(message.content));
    setEditContent(message.content);
  }, [message.content]);

  // Add effect to initialize event listeners for code artifacts
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Find all code artifact buttons and attach event listeners
    const codeButtons = contentRef.current.querySelectorAll('[data-action="open-editor"]');
    codeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        // Find the hidden code content
        const codeContainer = button.closest('.code-artifact');
        if (codeContainer) {
          const hiddenCode = codeContainer.querySelector('.hidden');
          if (hiddenCode && hiddenCode.textContent) {
            window.openInCodeEditor(hiddenCode.textContent);
          }
        }
      });
    });

    // Find all clickable code artifacts
    const codeArtifacts = contentRef.current.querySelectorAll('.code-artifact .bg-gray-100, [data-action="view-code"]');
    codeArtifacts.forEach(artifact => {
      artifact.addEventListener('click', (e) => {
        e.preventDefault();
        // For simplified artifact boxes
        if (artifact.getAttribute('data-action') === 'view-code') {
          const codeContainer = artifact.closest('.llm-response').querySelector('.code-artifact');
          if (codeContainer) {
            const hiddenCode = codeContainer.querySelector('.hidden');
            if (hiddenCode && hiddenCode.textContent) {
              window.openInCodeEditor(hiddenCode.textContent);
            }
          }
          return;
        }
        
        // For regular code artifacts
        const hiddenCode = artifact.previousElementSibling;
        if (hiddenCode && hiddenCode.textContent) {
          window.openInCodeEditor(hiddenCode.textContent);
        }
      });
    });

    return () => {
      // Clean up event listeners
      if (contentRef.current) {
        const buttons = contentRef.current.querySelectorAll('[data-action="open-editor"]');
        buttons.forEach(button => {
          button.replaceWith(button.cloneNode(true));
        });
        
        const artifacts = contentRef.current.querySelectorAll('.code-artifact .bg-gray-100, [data-action="view-code"]');
        artifacts.forEach(artifact => {
          artifact.replaceWith(artifact.cloneNode(true));
        });
      }
    };
  }, [processedContent]);

  if (isEditing) {
    return (
      <div className="llm-response w-full">
        <div className="border border-[#e5e6e3] rounded-lg bg-transparent shadow-sm">
          <div className="flex justify-between items-center p-2">
            <div className="t-logo text-gray-700">T</div>
          </div>
          <div className="collapsible-content p-4">
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
            ></textarea>
            <div className="mt-2">
              <button onClick={() => { onEditMessage(message.id, editContent); setIsEditing(false); }} className="bg-button-dark text-white px-3 py-1 rounded mr-2">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-200 px-3 py-1 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if this is a style model response
  const isStyleResponse = message.model?.id === 'style';


   // In the return statement, update the streaming class
    const streamingClass = message.streaming ? "animate-pulse" : "";
    
    return (
      <div className="llm-response w-full">
        <div className={`border border-[#e5e6e3] rounded-lg bg-transparent shadow-sm ${message.collapsed ? 'collapsed' : ''}`}>
          <div className="flex justify-between items-center p-2">
            <div className="flex items-center gap-2">
              <div className="t-logo text-gray-700">T</div>
              {message.model && (
                <span className="text-sm text-gray-600 flex items-center">
                  <ion-icon name={message.model.icon || 'brush-outline'} className="mr-1"></ion-icon>
                  {message.model.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onRegenerate(message.id)} 
                className="message-actions p-1 rounded-full text-gray-500 hover:text-gray-700" 
                aria-label="Regenerate response"
              >
                <ion-icon name="refresh-outline"></ion-icon>
              </button>
              <button onClick={() => setIsEditing(true)} className="message-actions p-1 rounded-full text-gray-500 hover:text-gray-700" aria-label="Edit message">
                <ion-icon name="pencil-outline"></ion-icon>
              </button>
              <button onClick={onToggleCollapse} className="toggle-collapse text-gray-500 hover:text-gray-700 p-1 rounded-full" aria-label="Toggle content">
                <ion-icon className="toggle-icon" name={message.isCollapsed ? "chevron-down-outline" : "chevron-up-outline"}></ion-icon>
              </button>
            </div>
          </div>
          
          {isStyleResponse ? (
            // Style response content is currently empty/hidden
            <div className={`collapsible-content p-4 ${message.isCollapsed ? "hidden" : ""}`}>
              {/* Adding the actual style response content */}
              <div 
                ref={contentRef}
                dangerouslySetInnerHTML={{ __html: processedContent }}
              ></div>
            </div>
          ) : (
            <div 
              ref={contentRef}
              className={`collapsible-content p-4 ${message.isCollapsed ? "hidden" : ""}`} 
              dangerouslySetInnerHTML={{ __html: processedContent }}
            ></div>
          )}
        </div>
      </div>
    );
  }

  export default LLMMessage;