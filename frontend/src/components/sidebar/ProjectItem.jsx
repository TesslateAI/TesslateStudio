/**
 * Project item component used in the sidebar for project management.
 * Handles project folder expansion/collapse, chat organization, and drag-and-drop functionality.
 * Manages project renaming, deletion, and chat creation within projects.
 * Part of the sidebar navigation system.
 */

import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import DraggableChatItem from './DraggableChatItem';

const ProjectItem = ({ 
  project, 
  collapsed, 
  onRename, 
  onDelete, 
  onCreateChat, 
  onDrop,
  showMenu,
  setShowMenu,
  chats,
  activeChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onMoveChat
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const inputRef = useRef(null);
  
  const projectChats = chats.filter(chat => chat.projectId === project.id);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CHAT',
    drop: (item) => {
      onDrop(item.id, project.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleStartEdit = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onRename(project.id, editName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditName(project.name);
      setIsEditing(false);
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(showMenu === project.id ? null : project.id);
  };

  const toggleExpand = () => {
    if (!collapsed) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div 
      ref={drop}
      className={`space-y-1 ${isOver ? 'bg-gray-100 rounded' : ''}`}
    >
      <div 
        className={`flex items-center justify-between p-2 hover:bg-gray-200 rounded cursor-pointer group ${isExpanded ? 'bg-gray-100' : ''}`}
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-2 flex-grow">
          <ion-icon 
            name={isExpanded ? "folder-open-outline" : "folder-outline"} 
            className={`text-gray-600 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
          ></ion-icon>
          {!collapsed && (
            isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="bg-white p-1 rounded border flex-grow"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <span className="truncate">{project.name}</span>
            )
          )}
        </div>
        {!collapsed && !isEditing && (
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onCreateChat(project.id); }} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Add chat to project"
            >
              <ion-icon name="add-outline" size="small"></ion-icon>
            </button>
            <button 
              onClick={toggleMenu} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Project menu"
            >
              <ion-icon name="ellipsis-vertical-outline" size="small"></ion-icon>
            </button>
            {showMenu === project.id && (
              <div className="absolute right-0 mt-8 bg-white shadow-lg rounded-md py-1 z-20">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleStartEdit(); setShowMenu(null); }} 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <ion-icon name="pencil-outline" size="small"></ion-icon>
                  Rename
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 flex items-center gap-2"
                >
                  <ion-icon name="trash-outline" size="small"></ion-icon>
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {!collapsed && (
        <div className={`ml-4 space-y-1 project-content ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} transition-all duration-300 overflow-hidden`}>
          {projectChats.map((chat, index) => (
            <DraggableChatItem
              key={chat.id}
              chat={chat}
              index={index}
              isActive={activeChat === chat.id}
              onSelect={onSelectChat}
              onRename={onRenameChat}
              onDelete={onDeleteChat}
              onDrop={onMoveChat}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectItem;
