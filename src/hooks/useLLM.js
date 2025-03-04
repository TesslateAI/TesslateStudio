// src/hooks/useLLM.js
import { useState } from 'react';
import { openai, DEFAULT_MODEL, isModelAvailable } from '../utils/openaiClient';
import { MockModelService } from '../services/models/mockModelService';

const DEFAULT_MODEL_INFO = {
  id: DEFAULT_MODEL,
  name: DEFAULT_MODEL.split('/').pop() || DEFAULT_MODEL,
  icon: 'flash-outline',
  isOpenAI: true
};

function useLLM(chats, setChats, activeChat, llmModels) {
  const [isLLMThinking, setIsLLMThinking] = useState(false);
  const modelService = new MockModelService();

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

  const sendMessage = async (messageInput) => {
    if (messageInput.trim() === "") return;
    const formattedContent = formatMessageContent(messageInput);

    const modelMatch = messageInput.match(/@(\w+)/);
    const modelName = modelMatch ? modelMatch[1].toLowerCase() : DEFAULT_MODEL;
    const requestedModel = llmModels.find(m => m.name.toLowerCase() === modelName) || DEFAULT_MODEL_INFO;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: formattedContent,
      rawContent: messageInput,
      model: requestedModel
    };

    // Append user message
    setChats(prevChats => prevChats.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: [...chat.messages, userMsg] }
        : chat
    ));

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

    setChats(prevChats => prevChats.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: [...chat.messages, tempLLMMsg] }
        : chat
    ));

    setIsLLMThinking(true);
    try {
      const isDefaultModel = requestedModel.id === DEFAULT_MODEL || requestedModel.id === DEFAULT_MODEL.split('/').pop();
      if (isDefaultModel) {
        const modelAvailable = await isModelAvailable(requestedModel.id);
        if (!modelAvailable) {
          throw new Error(`Model ${requestedModel.id} is not available`);
        }

        const messages = [{ role: 'system', content: 'You are a helpful assistant.' }];
        const activeChatObj = chats.find(chat => chat.id === activeChat);
        if (activeChatObj) {
          activeChatObj.messages.forEach(msg => {
            if (msg.type === 'user') {
              messages.push({ role: 'user', content: msg.rawContent || msg.content });
            } else if (msg.type === 'llm') {
              messages.push({ role: 'assistant', content: msg.content });
            }
          });
        }
        messages.push({ role: 'user', content: userMsg.rawContent });

        const stream = await openai.chat.completions.create({
          model: requestedModel,
          messages,
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
                    msg.id === llmMsgId ? { ...msg, content: fullContent } : msg
                  )
                }
              : chat
          ));
        }
      } else {
        const llmResponseText = await modelService.generateResponse(
          userMsg.rawContent || userMsg.content,
          requestedModel
        );
        setChats(prevChats => prevChats.map(chat =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === llmMsgId ? { ...msg, content: llmResponseText, streaming: false } : msg
                )
              }
            : chat
        ));
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setChats(prevChats => prevChats.map(chat =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === llmMsgId
                  ? { ...msg, content: `Error: ${error.message || 'Failed to generate response'}`, streaming: false }
                  : msg
              )
            }
          : chat
      ));
    } finally {
      setIsLLMThinking(false);
    }
  };

  const regenerateMessage = async (messageId) => {
    const activeChatObj = chats.find(chat => chat.id === activeChat);
    if (!activeChatObj) return;

    const messageIndex = activeChatObj.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || activeChatObj.messages[messageIndex].type !== 'llm') return;

    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0) {
      if (activeChatObj.messages[userMessageIndex].type === 'user') break;
      userMessageIndex--;
    }
    if (userMessageIndex < 0) return;
    const userMessage = activeChatObj.messages[userMessageIndex];

    const newLlmMsgId = Date.now();
    setChats(prevChats => prevChats.map(chat => {
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
        return { ...chat, messages: updatedMessages };
      }
      return chat;
    }));

    setIsLLMThinking(true);
    try {
      const modelId = userMessage.model?.id || DEFAULT_MODEL;
      const isDefaultModel = modelId === DEFAULT_MODEL || modelId === DEFAULT_MODEL.split('/').pop();
      if (isDefaultModel) {
        const messages = [{ role: 'system', content: 'You are a helpful assistant.' }];
        for (let i = 0; i < userMessageIndex; i++) {
          const msg = activeChatObj.messages[i];
          if (msg.type === 'user') {
            messages.push({ role: 'user', content: msg.rawContent || msg.content });
          } else if (msg.type === 'llm') {
            messages.push({ role: 'assistant', content: msg.content });
          }
        }
        messages.push({ role: 'user', content: userMessage.rawContent || userMessage.content });
        const stream = await openai.chat.completions.create({
          model: DEFAULT_MODEL,
          messages,
          max_tokens: 4096,
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
                    msg.id === newLlmMsgId ? { ...msg, content: fullContent } : msg
                  )
                }
              : chat
          ));
        }
        setChats(prevChats => prevChats.map(chat =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === newLlmMsgId ? { ...msg, content: fullContent, streaming: false } : msg
                )
              }
            : chat
        ));
      } else {
        const llmResponseText = await modelService.generateResponse(
          userMessage.rawContent || userMessage.content,
          userMessage.model
        );
        setChats(prevChats => prevChats.map(chat =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === newLlmMsgId ? { ...msg, content: llmResponseText, streaming: false } : msg
                )
              }
            : chat
        ));
      }
    } catch (error) {
      console.error('Error regenerating response:', error);
      setChats(prevChats => prevChats.map(chat =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === newLlmMsgId
                  ? { ...msg, content: `Error: ${error.message || 'Failed to generate response'}`, streaming: false }
                  : msg
              )
            }
          : chat
      ));
    } finally {
      setIsLLMThinking(false);
    }
  };

  return { isLLMThinking, sendMessage, regenerateMessage };
}

export default useLLM;
