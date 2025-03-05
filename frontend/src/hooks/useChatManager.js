// src/hooks/useChatManager.js
import { useState } from 'react';

function useChatManager() {
  const [projects, setProjects] = useState([
    { id: 'project-1', name: 'Project 1', chats: [] }
  ]);
  const [chats, setChats] = useState([
    { id: 'chat-1', name: 'New Chat', messages: [], projectId: null }
  ]);
  const [activeChat, setActiveChat] = useState('chat-1');

  const handleCreateProject = () => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: 'New Project',
      chats: []
    };
    setProjects([...projects, newProject]);
  };

  const handleRenameProject = (id, newName) => {
    setProjects(projects.map(project =>
      project.id === id ? { ...project, name: newName } : project
    ));
  };

  const handleDeleteProject = (id) => {
    const projectToDelete = projects.find(p => p.id === id);
    if (projectToDelete && projectToDelete.chats.length > 0) {
      setChats(chats.map(chat =>
        projectToDelete.chats.includes(chat.id) ? { ...chat, projectId: null } : chat
      ));
    }
    setProjects(projects.filter(project => project.id !== id));
  };

  const handleCreateChat = (projectId = null) => {
    const newChat = {
      id: `chat-${Date.now()}`,
      name: 'New Chat',
      messages: [],
      projectId
    };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
    if (projectId) {
      setProjects(projects.map(project =>
        project.id === projectId
          ? { ...project, chats: [...project.chats, newChat.id] }
          : project
      ));
    }
  };

  const handleRenameChat = (id, newName) => {
    setChats(chats.map(chat =>
      chat.id === id ? { ...chat, name: newName } : chat
    ));
  };

  const handleDeleteChat = (id) => {
    if (activeChat === id) {
      const remainingChats = chats.filter(chat => chat.id !== id);
      if (remainingChats.length > 0) {
        setActiveChat(remainingChats[0].id);
      } else {
        handleCreateChat();
      }
    }
    const chatToDelete = chats.find(c => c.id === id);
    if (chatToDelete && chatToDelete.projectId) {
      setProjects(projects.map(project =>
        project.id === chatToDelete.projectId
          ? { ...project, chats: project.chats.filter(chatId => chatId !== id) }
          : project
      ));
    }
    setChats(chats.filter(chat => chat.id !== id));
  };

  const handleMoveChat = (chatId, targetProjectId, dragIndex, hoverIndex) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    setChats(prevChats => {
      const newChats = [...prevChats];
      const sourceProjectChats = newChats.filter(c => c.projectId === chat.projectId);
      const targetProjectChats = newChats.filter(c => c.projectId === targetProjectId);

      // Remove from source
      if (chat.projectId) {
        const sourceIndex = sourceProjectChats.findIndex(c => c.id === chatId);
        if (sourceIndex !== -1) {
          sourceProjectChats.splice(sourceIndex, 1);
        }
      }

      // Add to target
      if (targetProjectId) {
        targetProjectChats.splice(hoverIndex, 0, { ...chat, projectId: targetProjectId });
      } else {
        // Moving to standalone
        const standaloneChats = newChats.filter(c => !c.projectId);
        standaloneChats.splice(hoverIndex, 0, { ...chat, projectId: null });
      }

      return newChats.map(c => c.id === chatId ? { ...c, projectId: targetProjectId } : c);
    });

    if (chat.projectId !== targetProjectId) {
      setProjects(prevProjects => prevProjects.map(project => {
        if (project.id === chat.projectId) {
          return { ...project, chats: project.chats.filter(id => id !== chatId) };
        }
        if (project.id === targetProjectId) {
          return { ...project, chats: [...project.chats, chatId] };
        }
        return project;
      }));
    }
  };

  return {
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
    setChats
  };
}

export default useChatManager;
