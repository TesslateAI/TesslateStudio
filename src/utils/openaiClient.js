import OpenAI from 'openai';

// Create OpenAI client with Featherless AI base URL
const openai = new OpenAI({
    baseURL: 'https://api.featherless.ai/v1',
    apiKey: 'rc_5f524aa99b38bbd5137604115fab873f8de67c0c85fb15c4dcf47329b1576ede',
  dangerouslyAllowBrowser: true,
});

// Default model to use when no specific model is called
const DEFAULT_MODEL = 'smirki/UIGEN-T1.1-Qwen-7B';

// Function to check if a model is available
const isModelAvailable = async (modelName) => {
  try {
    const models = await openai.models.list();
    const isAvailable = models.data.some(model => model.id === modelName);
    if (!isAvailable) {
      console.warn(`Model ${modelName} is not available. Available models:`, 
        models.data.map(m => m.id));
    }
    return isAvailable;
  } catch (error) {
    console.error('Error checking model availability:', error);
    return false;
  }
};

export { openai, DEFAULT_MODEL, isModelAvailable };