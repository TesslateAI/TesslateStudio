// src/services/models/mockModelService.ts
import { LLMModel, ModelService } from './interfaces';
import { DEFAULT_MODEL } from '../../utils/openaiClient';

export class MockModelService implements ModelService {
  private llmModels: LLMModel[] = [
    { id: 'uigen-t1', name: 'UIGEN-T1', icon: 'flash-outline', provider: 'openai', type: 'openai' },
    { id: 'react', name: 'React', icon: 'logo-react', provider: 'mock', type: 'mock' },
    { id: 'claude', name: 'Claude', icon: 'bulb-outline', provider: 'mock', type: 'mock' },
    { id: 'llama', name: 'Llama', icon: 'paw-outline', provider: 'mock', type: 'mock' },
    { id: 'mistral', name: 'Mistral', icon: 'cloud-outline', provider: 'mock', type: 'mock' },
    { id: 'gemini', name: 'Gemini', icon: 'sparkles-outline', provider: 'mock', type: 'mock' },
    { id: 'style', name: 'Style', icon: 'color-palette-outline', provider: 'mock', type: 'mock' },
    { id: 'html', name: 'HTML', icon: 'code-slash-outline', provider: 'mock', type: 'mock' }
  ];

  getAvailableModels(): LLMModel[] {
    const defaultModel = {
      id: DEFAULT_MODEL.replace('smirki/', ''),
      name: DEFAULT_MODEL.split('/')[1],
      icon: 'flash-outline',
      provider: 'openai',
      type: 'openai'
    };
    
    const modelExists = this.llmModels.some(model => model.id === defaultModel.id);
    
    if (!modelExists) {
      return [defaultModel, ...this.llmModels];
    }
    
    return this.llmModels;
  }

  async generateResponse(message: string, model: LLMModel): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    if (!model || model.provider !== 'mock') {
      return `<p>This is a default response. Try mentioning a specific mock model using @modelname.</p>`;
    }
  
    switch (model.id.toLowerCase()) {
      case 'style':
        return `<div class="style-response">
          <h3>UI Style Selection</h3>
          <p>I've analyzed your request and prepared some UI style options for you to choose from.</p>
          <p>Each style has its own characteristics and is suitable for different types of applications:</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div class="style-option rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div class="relative h-40 bg-gray-100">
                <img src="/sample-skeuomorphic.jpg" alt="Skeuomorphic UI Example" class="w-full h-full object-cover filter blur-sm" />
                <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <span class="text-white font-bold text-xl shadow-sm">Skeuomorphic</span>
                </div>
              </div>
              <div class="p-4">
                <h4 class="font-medium mb-2">Realistic Design</h4>
                <p class="text-sm text-gray-600">Mimics real-world objects with textures, shadows, and depth.</p>
                <button class="mt-3 px-4 py-2 bg-button-dark text-white rounded-md w-full hover:bg-gray-800">Select</button>
              </div>
            </div>
            
            <div class="style-option rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div class="relative h-40 bg-gray-100">
                <img src="/sample-flat.jpg" alt="Flat/Minimal UI Example" class="w-full h-full object-cover filter blur-sm" />
                <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <span class="text-white font-bold text-xl shadow-sm">Flat/Minimal</span>
                </div>
              </div>
              <div class="p-4">
                <h4 class="font-medium mb-2">Clean & Modern</h4>
                <p class="text-sm text-gray-600">Simple, bold colors with clean lines and minimal decoration.</p>
                <button class="mt-3 px-4 py-2 bg-button-dark text-white rounded-md w-full hover:bg-gray-800">Select</button>
              </div>
            </div>
            
            <div class="style-option rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div class="relative h-40 bg-gray-100">
                <img src="/sample-neumorphic.jpg" alt="Neumorphic UI Example" class="w-full h-full object-cover filter blur-sm" />
                <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <span class="text-white font-bold text-xl shadow-sm">Neumorphic</span>
                </div>
              </div>
              <div class="p-4">
                <h4 class="font-medium mb-2">Soft & Tactile</h4>
                <p class="text-sm text-gray-600">Soft shadows and highlights creating a tactile, embossed feel.</p>
                <button class="mt-3 px-4 py-2 bg-button-dark text-white rounded-md w-full hover:bg-gray-800">Select</button>
              </div>
            </div>
          </div>
          
          <p class="mt-4">Select one of the options above to see a detailed preview and get implementation guidance.</p>
        </div>`;
  
      case 'uigen-t1':
        return `<div class="uigen-response">
          <h3>UI Generation Response</h3>
          <p>Here's a UI design based on your requirements:</p>
          
          <div class="llm-artifact mb-4">
            <h4 class="text-lg font-medium mb-2">Preview</h4>
            <div class="preview-content bg-white p-4 rounded-lg border border-gray-200">
              <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div class="md:flex">
                  <div class="md:shrink-0">
                    <img class="h-48 w-full object-cover md:h-full md:w-48" src="/placeholder-dashboard.png" alt="Modern dashboard">
                  </div>
                  <div class="p-8">
                    <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Dashboard Example</div>
                    <h2 class="block mt-1 text-lg leading-tight font-medium text-black">Interactive Preview</h2>
                    <p class="mt-2 text-slate-500">Click elements to see their properties and styling details.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="code-artifact rounded-lg border border-gray-200 p-4 bg-gray-50 mb-4">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-lg font-medium">Generated Code</h4>
              <button 
                class="px-3 py-1 bg-button-dark text-white rounded-md hover:bg-gray-800 flex items-center gap-2"
                data-action="open-editor"
                onclick="window.openInCodeEditor(this.parentElement.nextElementSibling.textContent)"
              >
                <ion-icon name="code-slash-outline"></ion-icon>
                Open in Editor
              </button>
            </div>
            <div class="hidden">import React from 'react';

export const DashboardCard = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:shrink-0">
          <img 
            className="h-48 w-full object-cover md:h-full md:w-48" 
            src="/placeholder-dashboard.png" 
            alt="Modern dashboard"
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Dashboard Example
          </div>
          <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
            Interactive Preview
          </h2>
          <p className="mt-2 text-slate-500">
            Click elements to see their properties and styling details.
          </p>
        </div>
      </div>
    </div>
  );
};</div>
          <div class="bg-gray-100 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.openInCodeEditor(this.previousElementSibling.textContent)">
            <div class="flex items-center gap-2">
              <ion-icon name="code-slash-outline" class="text-gray-600"></ion-icon>
              <span class="font-medium">Click to view code</span>
            </div>
          </div>
        </div>
      </div>`;
  
      case 'react':
        return `<div class="react-response">
          <h3>React Component</h3>
          <div class="code-artifact rounded-lg border border-gray-200 p-4 bg-gray-50 mt-2">
            <div class="hidden">const MyComponent = () => {
    return <div>Hello React!</div>;
  }</div>
            <div class="bg-gray-100 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.openInCodeEditor(this.previousElementSibling.textContent)">
              <div class="flex items-center gap-2">
                <ion-icon name="code-slash-outline" class="text-gray-600"></ion-icon>
                <span class="font-medium">Click to view React component</span>
              </div>
            </div>
          </div>
        </div>`;
  
      default:
        return `<div class="mock-response">
          <h3>${model.name} Response</h3>
          <p>Mock response from ${model.name} model for message: "${message}"</p>
        </div>`;
    }
  }
}