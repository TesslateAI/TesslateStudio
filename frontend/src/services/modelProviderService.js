import OpenAI from 'openai';
import modelProvidersConfig from '../config/modelProviders.json';
import { MockModelService } from './models/mockModelService';

// Change the export to be named
export class ModelProviderService {
  constructor() {
    this.providers = {};
    this.modelMap = new Map(); // For O(1) model lookup
    this.initializeProviders();
    this.buildModelMap();
  }

  initializeProviders() {
    modelProvidersConfig.providers.forEach(provider => {
      switch (provider.type) {
        case 'openai':
          this.providers[provider.id] = {
            client: new OpenAI({
              baseURL: provider.baseURL,
              apiKey: import.meta.env[provider.apiKeyEnvVar],
              dangerouslyAllowBrowser: true,
            }),
            config: provider
          };
          break;
        case 'ollama':
          this.providers[provider.id] = {
            client: this.createOllamaClient(provider.baseURL),
            config: provider
          };
          break;
        case 'mock':
          this.providers[provider.id] = {
            client: new MockModelService(),
            config: provider
          };
          break;
      }
    });
  }

  buildModelMap() {
    modelProvidersConfig.providers.forEach(provider => {
      provider.models.forEach(model => {
        this.modelMap.set(model.name.toLowerCase(), {
          ...model,
          provider: provider.id,
          type: provider.type
        });
      });
    });
  }

  createOllamaClient(baseURL) {
    return {
      baseURL,
      async generateCompletion(model, messages) {
        const response = await fetch(`${baseURL}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            prompt: messages[messages.length - 1].content,
            stream: true
          })
        });
        return response.body;
      }
    };
  }

  getModelByName(modelName) {
    // First try exact match with name
    const model = this.modelMap.get(modelName.toLowerCase());
    if (model) return model;
    
    // Then try matching by ID
    for (const [_, model] of this.modelMap) {
      if (model.id.toLowerCase() === modelName.toLowerCase() || 
          model.id.toLowerCase().endsWith(`/${modelName.toLowerCase()}`)) {
        return model;
      }
    }
    
    // If still not found, check mock models
    const mockProvider = this.providers['mock'];
    if (mockProvider) {
      const mockModel = mockProvider.client.getAvailableModels?.()?.find(
        m => m.name.toLowerCase() === modelName.toLowerCase() // Changed from id to name
      );
      if (mockModel) return { ...mockModel, provider: 'mock', type: 'mock' };
    }
    
    return null;
  }

  getAllModels() {
    return Array.from(this.modelMap.values());
  }

  getDefaultModel() {
    const defaultProvider = modelProvidersConfig.defaultProvider;
    const defaultModelId = modelProvidersConfig.defaultModel;
    const provider = this.providers[defaultProvider];
    const model = provider.config.models.find(m => m.id === defaultModelId);
    
    return {
      ...model,
      provider: defaultProvider,
      type: provider.config.type
    };
  }

  async generateResponse(modelInfo, messages) {
    const provider = this.providers[modelInfo.provider];
    
    switch (modelInfo.type) {
      case 'openai':
        return provider.client.chat.completions.create({
          model: modelInfo.id,
          messages,
          stream: true
        });

      case 'ollama':
        return provider.client.generateCompletion(modelInfo.id, messages);

      case 'mock':
        return provider.client.generateResponse(messages[messages.length - 1].content, modelInfo);

      default:
        throw new Error(`Unsupported provider type: ${modelInfo.type}`);
    }
  }
}

export const modelProviderService = new ModelProviderService();
export default modelProviderService;