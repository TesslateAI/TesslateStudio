// src/App.jsx
import React, { useState, useEffect } from 'react';
import { MockModelService } from './services/models/mockModelService';
import Sidebar from './components/Sidebar';
import CodeEditorSidebar from './components/CodeEditorSidebar';
import MainChatArea from './components/MainChatArea';
import SettingsModal from './components/SettingsModal';
import { openai, DEFAULT_MODEL, isModelAvailable } from './utils/openaiClient'; // Import OpenAI client

// Create a default model info object
const DEFAULT_MODEL_INFO = {
  id: DEFAULT_MODEL,
  name: DEFAULT_MODEL.split('/').pop() || DEFAULT_MODEL,
  icon: 'flash-outline',
  isOpenAI: true
};

function App() {
  // Global states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCodeEditorSidebar, setShowCodeEditorSidebar] = useState(false);
  const [codeEditorTab, setCodeEditorTab] = useState("code");
  const [codeEditorContent, setCodeEditorContent] = useState("");
  const [codeEditorWidth, setCodeEditorWidth] = useState('30%');
  const [isLLMThinking, setIsLLMThinking] = useState(false); // Fixed: Initialize with false instead of self-reference
  const [messageInput, setMessageInput] = useState("");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  // Project and chat management states
  const [projects, setProjects] = useState([
    { id: 'project-1', name: 'Project 1', chats: [] }
  ]);
  const [chats, setChats] = useState([
    {
      id: 'chat-1',
      name: 'New Chat',
      messages: [], // { id, type, content, isCollapsed, model, rawContent }
      projectId: null
    }
  ]);
  const [activeChat, setActiveChat] = useState('chat-1');
  const [showProjectMenu, setShowProjectMenu] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Initialize model service
  const modelService = new MockModelService();
  const llmModels = modelService.getAvailableModels();
  const commonPhrases = [
    'Can you explain',
    'How do I',
    'What is the best way to',
    'Write code for',
    'Summarize this',
    'Translate this to'
  ];

  useEffect(() => {
    // Add global handler for opening code editor
    window.openInCodeEditor = (code) => {
      // Clean up the code if it's a string
      const cleanCode = typeof code === 'string' ? code.trim() : code;

      setCodeEditorContent(cleanCode);
      setCodeEditorTab("code");
      setShowCodeEditorSidebar(true);

      // Auto-collapse sidebar on mobile when opening code editor
      if (isMobile) {
        setSidebarCollapsed(true);
      }
    };

    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      delete window.openInCodeEditor;
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  // Project and chat management handlers
  const handleCreateProject = () => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: `New Project`,
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
    // Move any chats in this project to be standalone
    const projectToDelete = projects.find(p => p.id === id);
    if (projectToDelete && projectToDelete.chats.length > 0) {
      setChats(chats.map(chat =>
        projectToDelete.chats.includes(chat.id) ? { ...chat, projectId: null } : chat
      ));
    }
    setProjects(projects.filter(project => project.id !== id));
    setShowProjectMenu(null);
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

    // If this chat belongs to a project, update the project's chats array
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
    // If this is the active chat, set a new active chat
    if (activeChat === id) {
      const remainingChats = chats.filter(chat => chat.id !== id);
      if (remainingChats.length > 0) {
        setActiveChat(remainingChats[0].id);
      } else {
        // Create a new chat if this was the last one
        handleCreateChat();
      }
    }

    // Remove chat from its project if it belongs to one
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
        // If moving to standalone
        const standaloneChats = newChats.filter(c => !c.projectId);
        standaloneChats.splice(hoverIndex, 0, { ...chat, projectId: null });
      }

      return newChats.map(c => {
        if (c.id === chatId) {
          return { ...c, projectId: targetProjectId };
        }
        return c;
      });
    });

    // Update projects state
    if (chat.projectId !== targetProjectId) {
      setProjects(prevProjects => {
        return prevProjects.map(project => {
          if (project.id === chat.projectId) {
            return { ...project, chats: project.chats.filter(id => id !== chatId) };
          }
          if (project.id === targetProjectId) {
            return { ...project, chats: [...project.chats, chatId] };
          }
          return project;
        });
      });
    }
  };

  // Handlers for toggles
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    if (isMobile) {
      setShowMobileSidebar(!showMobileSidebar);
    }
  };

  const handleCodeEditorToggle = () => {
    setShowCodeEditorSidebar(prev => !prev);
    // Auto-collapse sidebar on mobile when opening code editor
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
      setShowMobileSidebar(false);
    }
  };

  const handleSettingsToggle = () => setShowSettings(prev => !prev);

  // Send message and simulate LLM response
  const formatMessageContent = (content) => {
    const modelRegex = /@(\w+)/g;
    return content.replace(modelRegex, (match, modelName) => {
      const model = llmModels.find(m => m.name.toLowerCase() === modelName.toLowerCase());
      if (model) {
        return `<span class="model-mention"><ion-icon name="${model.icon}"></ion-icon>${model.name}</span>`;
      }
      return match;
    });
  };

  // In the handleSendMessage function:
  const handleSendMessage = async () => {
    if (messageInput.trim() === "") return;
    const formattedContent = formatMessageContent(messageInput);

    // Get mentioned model or use default
    const modelMatch = messageInput.match(/@(\w+)/);
    const modelName = modelMatch ? modelMatch[1].toLowerCase() : DEFAULT_MODEL;

    // Find the model in llmModels or use default
    const requestedModel = llmModels.find(m => m.name.toLowerCase() === modelName) || DEFAULT_MODEL_INFO;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: formattedContent,
      rawContent: messageInput,
      model: requestedModel
    };

    // Add user message to chat
    setChats(prevChats => prevChats.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: [...chat.messages, userMsg] }
        : chat
    ));

    setMessageInput("");
    setShowAutocomplete(false);

    // Create temporary LLM message
    const llmMsgId = Date.now() + 1;
    const tempLLMMsg = {
      id: llmMsgId,
      type: 'llm',
      content: '',
      isCollapsed: false,
      model: requestedModel,
      streaming: true
    };

    // Add temporary message
    setChats(prevChats => prevChats.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: [...chat.messages, tempLLMMsg] }
        : chat
    ));

    setIsLLMThinking(true);

    try {
      // Check if we should use OpenAI or MockModelService
      const isDefaultModel = requestedModel.id === DEFAULT_MODEL || requestedModel.id === DEFAULT_MODEL.split('/').pop();

      if (isDefaultModel) {
        // Use OpenAI with default model
        const modelAvailable = await isModelAvailable(requestedModel.id);
        if (!modelAvailable) {
          throw new Error(`Model ${requestedModel.id} is not available`);
        }

        const messages = [
          { role: 'system', content: 'You are a helpful assistant.' }
        ];

        // Add conversation history
        const activeChartObj = chats.find(chat => chat.id === activeChat);
        if (activeChartObj) {
          activeChartObj.messages.forEach(msg => {
            if (msg.type === 'user') {
              messages.push({ role: 'user', content: msg.rawContent || msg.content });
            } else if (msg.type === 'llm') {
              messages.push({ role: 'assistant', content: msg.content });
            }
          });
        }

        // Add current user message
        messages.push({ role: 'user', content: userMsg.rawContent });

        // Start streaming response
        const stream = await openai.chat.completions.create({
          model: requestedModel,
          messages: messages,
          stream: true,
        });

        let fullContent = '';
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          fullContent += content;

          setChats(prevChats => prevChats.map(chat =>
            chat.id === activeChat
              ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === llmMsgId
                    ? { ...msg, content: fullContent }
                    : msg
                )
              }
              : chat
          ));
        }
      } else {
        // Use MockModelService for non-default models
        const llmResponseText = await modelService.generateResponse(
          userMsg.rawContent || userMsg.content,
          requestedModel
        );

        // Update the LLM message with the response
        setChats(prevChats => prevChats.map(chat =>
          chat.id === activeChat
            ? {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === llmMsgId
                  ? { ...msg, content: llmResponseText, streaming: false }
                  : msg
              )
            }
            : chat
        ));
      }
    } catch (error) {
      console.error('Error generating response:', error);

      // Update with error message and remove streaming state
      setChats(prevChats => prevChats.map(chat =>
        chat.id === activeChat
          ? {
            ...chat,
            messages: chat.messages.map(msg =>
              msg.id === llmMsgId
                ? {
                  ...msg,
                  content: `Error: ${error.message || 'Failed to generate response'}`,
                  streaming: false
                }
                : msg
            )
          }
          : chat
      ));
    } finally {
      setIsLLMThinking(false);
    }
  };

  // Update regenerate message handler to use streaming
  const handleRegenerateMessage = async (messageId) => {
    // Get the active chat
    const activeChartObj = chats.find(chat => chat.id === activeChat);
    if (!activeChartObj) return;

    // Find the message to regenerate
    const messageIndex = activeChartObj.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || activeChartObj.messages[messageIndex].type !== 'llm') return;

    // Find the user message that triggered this response
    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0) {
      if (activeChartObj.messages[userMessageIndex].type === 'user') break;
      userMessageIndex--;
    }

    if (userMessageIndex < 0) return;

    // Get the user message
    const userMessage = activeChartObj.messages[userMessageIndex];

    // Create a new LLM message ID
    const newLlmMsgId = Date.now();

    // Remove the old LLM message and add a placeholder
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === activeChat) {
          const updatedMessages = [...chat.messages];
          updatedMessages.splice(messageIndex, 1, {
            id: newLlmMsgId,
            type: 'llm',
            content: '',
            isCollapsed: false,
            model: userMessage.model || DEFAULT_MODEL_INFO,
            streaming: true
          });
          return {
            ...chat,
            messages: updatedMessages
          };
        }
        return chat;
      });
    });

    setIsLLMThinking(true);

    try {
      // Check if we should use OpenAI (only for default model) or MockModelService
      const modelId = userMessage.model?.id || DEFAULT_MODEL;
      const isDefaultModel = modelId === DEFAULT_MODEL || modelId === DEFAULT_MODEL.split('/').pop();

      if (isDefaultModel) {
        // Use OpenAI with default model
        const messages = [
          { role: 'system', content: 'You are a helpful assistant.' }
        ];

        // Add conversation history up to the user message
        for (let i = 0; i < userMessageIndex; i++) {
          const msg = activeChartObj.messages[i];
          if (msg.type === 'user') {
            messages.push({ role: 'user', content: msg.rawContent || msg.content });
          } else if (msg.type === 'llm') {
            messages.push({ role: 'assistant', content: msg.content });
          }
        }

        // Add the user message
        messages.push({ role: 'user', content: userMessage.rawContent || userMessage.content });

        // Start streaming response
        const stream = await openai.chat.completions.create({
          model: DEFAULT_MODEL,
          messages: messages,
          max_tokens: 4096,
          stream: true,
        });

        let fullContent = '';

        // Process the stream
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          fullContent += content;

          // Update the LLM message with the new content
          setChats(prevChats =>
            prevChats.map(chat =>
              chat.id === activeChat
                ? {
                  ...chat,
                  messages: chat.messages.map(msg =>
                    msg.id === newLlmMsgId
                      ? { ...msg, content: fullContent }
                      : msg
                  )
                }
                : chat
            )
          );
        }

        // Final update to remove streaming state
        setChats(prevChats =>
          prevChats.map(chat =>
            chat.id === activeChat
              ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === newLlmMsgId
                    ? { ...msg, content: fullContent, streaming: false }
                    : msg
                  )
                }
              : chat
          )
        );
      } else {
        // Use MockModelService for non-default models
        const llmResponseText = await modelService.generateResponse(
          userMessage.rawContent || userMessage.content,
          userMessage.model
        );

        // Update the LLM message with the response
        setChats(prevChats =>
          prevChats.map(chat =>
            chat.id === activeChat
              ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === newLlmMsgId
                    ? { ...msg, content: llmResponseText, streaming: false }
                    : msg
                  )
                }
              : chat
          )
        );
      }
    } catch (error) {
      console.error('Error regenerating response:', error);

      // Update with error message
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChat
            ? {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === newLlmMsgId
                  ? {
                    ...msg,
                    content: `Error: ${error.message || 'Failed to generate response'}`,
                    streaming: false
                  }
                  : msg
                )
              }
              : chat
        )
      );
    } finally {
      setIsLLMThinking(false);
    }
  };

  // This function is no longer needed as we're handling the logic directly in handleRegenerateMessage
  // const generateLLMResponse = async (userMessage, model) => {
  //   return await modelService.generateResponse(userMessage, model);
  // };

  // Autocomplete handlers
  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessageInput(value);
    const words = value.split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith("@")) {
      const query = lastWord.substring(1).toLowerCase();
      const filtered = llmModels.filter(model => model.name.toLowerCase().includes(query));
      setAutocompleteSuggestions(filtered);
      setShowAutocomplete(filtered.length > 0);
    } else if (value.length > 0 && !value.includes("@")) {
      const filtered = commonPhrases.filter(phrase => phrase.toLowerCase().startsWith(value.toLowerCase()) && phrase.length > value.length);
      setAutocompleteSuggestions(filtered);
      setShowAutocomplete(filtered.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    let newValue = "";
    if (typeof suggestion === "string") {
      newValue = suggestion;
    } else {
      const words = messageInput.split(" ");
      words[words.length - 1] = `@${suggestion.name}`;
      newValue = words.join(" ") + " ";
    }
    setMessageInput(newValue);
    setShowAutocomplete(false);
  };

  const handleKeyDown = (e) => {
    if (showAutocomplete) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => Math.min(prev + 1, autocompleteSuggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(autocompleteSuggestions[selectedSuggestionIndex]);
        setSelectedSuggestionIndex(-1);
      } else if (e.key === "Escape") {
        setShowAutocomplete(false);
      }
    }
  };

  // Edit message handler for both user and LLM messages
  const handleEditMessage = (id, newContent) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: chat.messages.map(msg =>
              msg.id === id ? { ...msg, content: newContent } : msg
            )
          };
        }
        return chat;
      });
    });
  };

  // Toggle collapse for LLM messages
  const handleToggleCollapse = (id) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: chat.messages.map(msg =>
              msg.id === id ? { ...msg, isCollapsed: !msg.isCollapsed } : msg
            )
          };
        }
        return chat;
      });
    });
  };

  // Add the missing handler function
  const handleCodeEditorWidthChange = (width) => {
    setCodeEditorWidth(width);
    // Optional: Add any additional width change handling logic here
  };


  return (
    <div className="flex h-screen bg-chat-background relative">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
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
        showProjectMenu={showProjectMenu}
        setShowProjectMenu={setShowProjectMenu}
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
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        autocompleteSuggestions={autocompleteSuggestions}
        showAutocomplete={showAutocomplete}
        selectedSuggestionIndex={selectedSuggestionIndex}
        onSuggestionClick={handleSuggestionClick}
        onEditMessage={handleEditMessage}
        onToggleCollapse={handleToggleCollapse}
        onToggleProperties={handleSettingsToggle}
        onToggleCodeEditor={handleCodeEditorToggle}
        onRegenerateMessage={handleRegenerateMessage}
        onToggleSidebar={handleSidebarToggle}
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