import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableChatItem from './DraggableChatItem';
import ProjectItem from './ProjectItem';

const Sidebar = ({ 
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
  }) => {
  
  // Filter standalone chats (those not in any project)
  const standaloneChats = chats.filter(chat => !chat.projectId);
  
  // Define sidebar classes for mobile vs. desktop
  const sidebarClasses = isMobile 
    ? `fixed bg-sidebar ${collapsed && !showMobileSidebar ? "-translate-x-full" : "translate-x-0"} w-64 p-4 flex flex-col h-screen overflow-y-auto z-30 transition-transform duration-300`
    : `bg-sidebar ${collapsed ? "w-16" : "w-64"} p-4 flex flex-col h-screen overflow-y-auto z-10 transition-all duration-300`;
  
  return (
    <DndProvider backend={HTML5Backend}>
      <aside id="sidebar" className={sidebarClasses}>
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
};

export default Sidebar;
