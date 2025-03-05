import React from 'react';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';

const AIModelSettings = () => (
  <div>
    <SettingSection title="AI Model Selection">
      <SettingItem
        label="Default Model"
        description="Choose the default AI model for chats and code generation"
      >
        <select className="form-select rounded border border-gray-300 p-2">
          <option>GPT-4</option>
          <option>GPT-3.5 Turbo</option>
          <option>Claude 2</option>
          <option>PaLM 2</option>
        </select>
      </SettingItem>

      <SettingItem
        label="Model Parameters"
        description="Adjust parameters like temperature and max tokens for AI models"
      >
        <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
          Customize Parameters
        </button>
      </SettingItem>
    </SettingSection>

    <SettingSection title="API Keys">
      <SettingItem
        label="OpenAI API Key"
        description="Enter your OpenAI API key for GPT models"
      >
        <input
          type="password"
          className="form-input rounded border border-gray-300 p-2"
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        />
      </SettingItem>

      <SettingItem
        label="Anthropic API Key"
        description="Enter your Anthropic API key for Claude models"
      >
        <input
          type="password"
          className="form-input rounded border border-gray-300 p-2"
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        />
      </SettingItem>

      <SettingItem
        label="Google PaLM API Key"
        description="Enter your Google PaLM API key for PaLM models"
      >
        <input
          type="password"
          className="form-input rounded border border-gray-300 p-2"
          placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        />
      </SettingItem>
    </SettingSection>

    <SettingSection title="Data Privacy">
      <SettingItem
        label="Data Usage"
        description="Control how your data is used to improve AI models"
      >
        <select className="form-select rounded border border-gray-300 p-2">
          <option>Allow data usage for model improvement</option>
          <option>Do not use my data</option>
        </select>
      </SettingItem>

      <SettingItem
        label="Chat History Storage"
        description="Choose how chat history is stored and managed"
      >
        <select className="form-select rounded border border-gray-300 p-2">
          <option>Store chat history locally</option>
          <option>Do not store chat history</option>
          <option>Store chat history in the cloud</option>
        </select>
      </SettingItem>
    </SettingSection>
  </div>
);

export default AIModelSettings;
