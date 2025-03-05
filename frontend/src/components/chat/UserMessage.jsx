import React, { useState } from 'react';

function UserMessage({ message, onEditMessage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.rawContent || message.content);

  if (isEditing) {
    return (
      <div className="flex justify-end user-message group">
        <div className="relative bg-user-bubble rounded-lg p-4 shadow-sm max-w-xs ml-auto">
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
    );
  }
  
  return (
    <div className="flex justify-end user-message group">
      <div className="relative bg-user-bubble rounded-lg p-4 shadow-sm max-w-xs ml-auto">
        <div dangerouslySetInnerHTML={{ __html: message.content }}></div>
        <div className="message-actions absolute -top-3 -left-3 flex space-x-1">
          <button onClick={() => setIsEditing(true)} className="edit-message-btn bg-white p-1 rounded-full shadow-sm text-gray-600 hover:text-gray-800" aria-label="Edit message">
            <ion-icon name="pencil-outline" className="w-4 h-4"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserMessage;