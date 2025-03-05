export interface LLMModel {
    id: string;
    name: string;
    icon: string;
    isOpenAI?: boolean; // Flag to indicate if this is an OpenAI model
  }
  
  export interface Message {
    id: number;
    type: 'user' | 'llm';
    content: string;
    isCollapsed?: boolean;
    model?: LLMModel;
    rawContent?: string;
    streaming?: boolean; // Flag to indicate if this message is currently streaming
  }
  
  export interface ModelService {
    getAvailableModels(): LLMModel[];
    generateResponse(message: string, model?: LLMModel): Promise<string>;
    streamResponse?(message: string, model?: LLMModel, onToken?: (token: string) => void): Promise<string>;
  }