import { useState } from 'react';
import { modelProviderService } from '../utils/openaiClient';

function useLLM(chats, setChats, activeChat) {
  const [isLLMThinking, setIsLLMThinking] = useState(false);

  const sendMessage = async (messageInput, modelName) => {
    if (messageInput.trim() === "") return;

    // Get model info from service
    const modelInfo = modelName ? 
      modelProviderService.getModelByName(modelName) : 
      modelProviderService.getDefaultModel();

    if (!modelInfo) {
      throw new Error(`Model ${modelName} not found`);
    }

    // Create messages
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: messageInput,
      model: modelInfo
    };

    const llmMsgId = Date.now() + 1;
    
    // Update chat with user message and temporary LLM message
    setChats(prevChats => prevChats.map(chat =>
      chat.id === activeChat
        ? {
            ...chat,
            messages: [...chat.messages, userMsg, {
              id: llmMsgId,
              type: 'llm',
              content: '',
              model: modelInfo,
              streaming: true
            }]
          }
        : chat
    ));

    setIsLLMThinking(true);
    try {
      const messages = [{ role: 'system', content: 'You are a helpful assistant.' }];
      const chat = chats.find(c => c.id === activeChat);
      
      if (chat) {
        chat.messages.forEach(msg => {
          messages.push({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        });
      }
      messages.push({ role: 'user', content: messageInput });

      const stream = await modelProviderService.generateResponse(modelInfo, messages);

      if (modelInfo.type === 'ollama') {
        const reader = stream.getReader();
        let fullContent = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = new TextDecoder().decode(value);
            const lines = text.split('\n').filter(line => line.trim());

            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                if (data.response) {
                  fullContent += data.response;
                  updateChat(llmMsgId, fullContent);
                }
              } catch (e) {
                console.error('Error parsing Ollama response:', e);
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } else if (modelInfo.type === 'openai') {
        let fullContent = '';
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          fullContent += content;
          updateChat(llmMsgId, fullContent);
        }
      } else {
        // Mock or other providers
        updateChat(llmMsgId, stream, false);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      updateChat(llmMsgId, `Error: ${error.message}`, false);
    } finally {
      setIsLLMThinking(false);
    }
  };
  // Update this function
  const updateChat = (messageId, content, streaming = true) => {
    // For mock and OpenAI responses that come as complete strings
    const isCompleteResponse = typeof content === 'string' && !streaming;
    
    setChats(prevChats => prevChats.map(chat =>
      chat.id === activeChat
        ? {
            ...chat,
            messages: chat.messages.map(msg =>
              msg.id === messageId ? { ...msg, content, streaming: !isCompleteResponse } : msg
            )
          }
        : chat
    ));
  };
  return { isLLMThinking, sendMessage };
}

export default useLLM;