import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Draggable Chat Item Component
const DraggableChatItem = ({ chat, isActive, onSelect, onRename, onDelete, onDrop, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(chat.name);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CHAT',
    item: { id: chat.id, type: 'chat', index, projectId: chat.projectId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CHAT',
    hover: (item, monitor) => {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;
      
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      
      onDrop(item.id, chat.projectId, dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [index]);

  const ref = useRef(null);
  const dragDropRef = drag(drop(ref));

  // REMOVE OR RENAME THIS DUPLICATE HOOK:
  const [{ isOver: isOverDrop }, dropTarget] = useDrop(() => ({
    accept: 'CHAT',
    drop: (item) => {
      if (item.id !== chat.id) {
        onDrop(item.id, chat.projectId);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleStartEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onRename(chat.id, editName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditName(chat.name);
      setIsEditing(false);
    }
  };

  return (
    <div 
      ref={dragDropRef}
      className={`flex items-center justify-between p-2 rounded cursor-pointer group ${
        isActive ? 'bg-gray-300' : isOver ? 'bg-gray-100' : 'hover:bg-gray-200'
      } ${isDragging ? 'opacity-50' : 'opacity-100'} transform transition-transform`}
      onClick={() => onSelect(chat.id)}
    >
      <div className="flex items-center gap-2 flex-grow">
        <ion-icon name="chatbubble-outline" className="text-gray-600"></ion-icon>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="bg-white p-1 rounded border flex-grow"
            autoFocus
          />
        ) : (
          <span className="truncate">{chat.name}</span>
        )}
      </div>
      {!isEditing && (
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Chat menu"
          >
            <ion-icon name="ellipsis-vertical-outline" size="small"></ion-icon>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-8 bg-white shadow-lg rounded-md py-1 z-20">
              <button 
                onClick={(e) => { e.stopPropagation(); handleStartEdit(); setShowMenu(false); }} 
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <ion-icon name="pencil-outline" size="small"></ion-icon>
                Rename
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }} 
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
  );
};

// Project Item Component with Context Menu
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
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
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

function Sidebar({ 
    collapsed, 
    onToggle, 
    projects, 
    chats, 
    activeChat,
    onCreateProject,
    onRenameProject,
    onDeleteProject,
    onCreateChat,
    onRenameChat,
    onDeleteChat,
    onSelectChat,
    onMoveChat,
    showProjectMenu,
    setShowProjectMenu,
    onSettingsClick,
    isMobile,
    showMobileSidebar
  }) {
  // Get standalone chats (not in any project)
  const standaloneChats = chats.filter(chat => !chat.projectId);

  // Mobile sidebar classes
  const sidebarClasses = isMobile 
    ? `fixed bg-sidebar ${collapsed && !showMobileSidebar ? "-translate-x-full" : "translate-x-0"} w-64 p-4 flex flex-col h-screen overflow-y-auto z-30 transition-transform duration-300`
    : `bg-sidebar ${collapsed ? "w-16" : "w-64"} p-4 flex flex-col h-screen overflow-y-auto z-10 transition-all duration-300`;

  return (
    <DndProvider backend={HTML5Backend}>
      <aside
        id="sidebar"
        className={sidebarClasses}
      >
        <div className="flex items-center justify-between mb-2">
          {(!collapsed || (isMobile && showMobileSidebar)) && <h1 className="font-bold text-lg">Tesslate Studio</h1>}
          <button onClick={onToggle} className="text-gray-600 hover:text-gray-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-400" aria-label="Toggle sidebar">
            <ion-icon name={isMobile && showMobileSidebar ? "close-outline" : "menu-outline"}></ion-icon>
          </button>
        </div>
        <hr className="border-gray-300 my-2" />
        <button 
          onClick={() => onCreateChat()} 
          className="bg-button-dark text-white rounded-lg p-2 mb-4 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <ion-icon name="add-outline"></ion-icon>
          {!collapsed && <span>New Chat</span>}
        </button>
        
        <div className="space-y-4 flex-grow overflow-y-auto">
          {/* Standalone Chats */}
          {standaloneChats.length > 0 && (
            <div className="space-y-1">
              {standaloneChats.map(chat => (
                <DraggableChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeChat === chat.id}
                  onSelect={onSelectChat}
                  onRename={onRenameChat}
                  onDelete={onDeleteChat}
                  onDrop={onMoveChat}
                />
              ))}
            </div>
          )}
          
          {/* Projects Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {!collapsed && <h3 className="font-medium">Projects</h3>}
              {!collapsed && (
                <button 
                  onClick={onCreateProject}
                  className="text-gray-600 hover:text-gray-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-400" 
                  aria-label="Add project"
                >
                  <ion-icon name="add-circle-outline"></ion-icon>
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {projects.map(project => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  collapsed={collapsed}
                  onRename={onRenameProject}
                  onDelete={onDeleteProject}
                  onCreateChat={onCreateChat}
                  onDrop={onMoveChat}
                  showMenu={showProjectMenu}
                  setShowMenu={setShowProjectMenu}
                  chats={chats}
                  activeChat={activeChat}
                  onSelectChat={onSelectChat}
                  onRenameChat={onRenameChat}
                  onDeleteChat={onDeleteChat}
                  onMoveChat={onMoveChat}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <hr className="border-gray-300 my-2" />
          <div className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded cursor-pointer" onClick={onSettingsClick}>
            <ion-icon name="settings-outline" className="text-gray-600"></ion-icon>
            {!collapsed && <span>Settings</span>}
          </div>
          <div className="flex items-center justify-between p-2 mt-2">
            <div className="flex items-center gap-2">
              <ion-icon name="person-circle-outline" className="text-gray-600 text-xl"></ion-icon>
              {!collapsed && <span>User Name</span>}
            </div>
            <button className="text-gray-600 hover:text-gray-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-400" aria-label="Logout">
              <ion-icon name="log-out-outline"></ion-icon>
            </button>
          </div>
        </div>
      </aside>
    </DndProvider>
  );
}

export default Sidebar;