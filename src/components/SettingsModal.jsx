import React, { useState } from 'react';

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  // Add state management for form controls
  const [settings, setSettings] = useState({
    autoSave: {
      enabled: true,
      interval: '5 minutes'
    },
    defaultProjectLocation: 'C:\\Users\\Documents\\Projects',
    startupBehavior: 'Open new chat',
    hardwareAcceleration: true,
    memoryUsage: 'Medium (4GB)',
    checkUpdates: true,
    updateChannel: 'Stable',
    // Add more settings as needed
  });

  const handleSettingChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object'
        ? { ...prev[section], [setting]: value }
        : value
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings-outline' },
    { id: 'appearance', label: 'Appearance', icon: 'color-palette-outline' },
    { id: 'editor', label: 'Editor', icon: 'code-outline' },
    { id: 'ai', label: 'AI Models', icon: 'flash-outline' },
    { id: 'account', label: 'Account', icon: 'person-outline' },
    { id: 'advanced', label: 'Advanced', icon: 'construct-outline' },
    { id: 'keyboard', label: 'Keyboard', icon: 'keypad-outline' },
    { id: 'plugins', label: 'Plugins', icon: 'extension-puzzle-outline' },
  ];

  if (!isOpen) return null;

  const GeneralSettings = () => (
    <div>
      <SettingSection title="Application Settings">
        <SettingItem
          label="Auto-save"
          description="Automatically save your work at regular intervals"
        >
          <div className="flex items-center">
            <select
              className="form-select rounded border border-gray-300 p-2 mr-2"
              value={settings.autoSave.interval}
              onChange={(e) => handleSettingChange('autoSave', 'interval', e.target.value)}
            >
              <option>1 minute</option>
              <option>5 minutes</option>
              <option>10 minutes</option>
              <option>30 minutes</option>
            </select>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={settings.autoSave.enabled}
              onChange={(e) => handleSettingChange('autoSave', 'enabled', e.target.checked)}
            />
          </div>
        </SettingItem>

        <SettingItem
          label="Default Project Location"
          description="Choose where new projects are saved by default"
        >
          <div className="flex items-center">
            <input
              type="text"
              className="form-input rounded border border-gray-300 p-2 flex-grow"
              value={settings.defaultProjectLocation}
              onChange={(e) => handleSettingChange('defaultProjectLocation', null, e.target.value)}
              placeholder="C:\Users\Documents\Projects"
            />
            <button className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded">
              <ion-icon name="folder-open-outline"></ion-icon>
            </button>
          </div>
        </SettingItem>

        <SettingItem
          label="Startup Behavior"
          description="Choose what happens when the application starts"
        >
          <select
            className="form-select rounded border border-gray-300 p-2"
            value={settings.startupBehavior}
            onChange={(e) => handleSettingChange('startupBehavior', null, e.target.value)}
          >
            <option>Open new chat</option>
            <option>Continue last session</option>
            <option>Show welcome screen</option>
          </select>
        </SettingItem>
      </SettingSection>

      <SettingSection title="Performance">
        <SettingItem
          label="Hardware Acceleration"
          description="Use GPU acceleration for better performance (requires restart)"
        >
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={settings.hardwareAcceleration}
            onChange={(e) => handleSettingChange('hardwareAcceleration', null, e.target.checked)}
          />
        </SettingItem>

        <SettingItem
          label="Memory Usage"
          description="Limit the amount of memory used by the application"
        >
          <select
            className="form-select rounded border border-gray-300 p-2"
            value={settings.memoryUsage}
            onChange={(e) => handleSettingChange('memoryUsage', null, e.target.value)}
          >
            <option>Low (2GB)</option>
            <option>Medium (4GB)</option>
            <option>High (8GB)</option>
            <option>Unlimited</option>
          </select>
        </SettingItem>
      </SettingSection>

      <SettingSection title="Updates">
        <SettingItem
          label="Check for Updates"
          description="Automatically check for application updates"
        >
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={settings.checkUpdates}
            onChange={(e) => handleSettingChange('checkUpdates', null, e.target.checked)}
          />
        </SettingItem>

        <SettingItem
          label="Update Channel"
          description="Choose which update channel to use"
        >
          <select
            className="form-select rounded border border-gray-300 p-2"
            value={settings.updateChannel}
            onChange={(e) => handleSettingChange('updateChannel', null, e.target.value)}
          >
            <option>Stable</option>
            <option>Beta</option>
            <option>Developer</option>
          </select>
        </SettingItem>
      </SettingSection>
    </div>
  );

  const AppearanceSettings = () => (
    <div>
      <SettingSection title="Theme">
        <SettingItem
          label="Color Theme"
          description="Choose the color theme for the application"
        >
          <select className="form-select rounded border border-gray-300 p-2">
            <option>Light</option>
            <option>Dark</option>
            <option>System Default</option>
            <option>High Contrast</option>
          </select>
        </SettingItem>

        <SettingItem
          label="Accent Color"
          description="Choose the accent color for buttons and highlights"
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 cursor-pointer border border-gray-300"></div>
            <div className="w-6 h-6 rounded-full bg-purple-500 cursor-pointer"></div>
            <div className="w-6 h-6 rounded-full bg-green-500 cursor-pointer"></div>
            <div className="w-6 h-6 rounded-full bg-red-500 cursor-pointer"></div>
            <div className="w-6 h-6 rounded-full bg-yellow-500 cursor-pointer"></div>
            <div className="w-6 h-6 rounded-full bg-gray-800 cursor-pointer"></div>
          </div>
        </SettingItem>

        <SettingItem
          label="Custom CSS"
          description="Apply custom CSS to the application interface"
        >
          <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
            Edit CSS
          </button>
        </SettingItem>
      </SettingSection>

      <SettingSection title="Layout">
        <SettingItem
          label="Sidebar Position"
          description="Choose where the sidebar appears"
        >
          <select className="form-select rounded border border-gray-300 p-2">
            <option>Left</option>
            <option>Right</option>
          </select>
        </SettingItem>

        <SettingItem
          label="Default Sidebar Width"
          description="Set the default width of the sidebar"
        >
          <div className="flex items-center">
            <input type="range" min="150" max="400" value="250" className="form-range w-48" />
            <span className="ml-2">250px</span>
          </div>
        </SettingItem>

        <SettingItem
          label="Show Status Bar"
          description="Display status information at the bottom of the window"
        >
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" checked />
        </SettingItem>
      </SettingSection>

      <SettingSection title="Font Settings">
        <SettingItem
          label="Interface Font"
          description="Choose the font used in the application interface"
        >
          <select className="form-select rounded border border-gray-300 p-2">
            <option>System Default</option>
            <option>Inter</option>
            <option>Roboto</option>
            <option>Open Sans</option>
            <option>SF Pro</option>
          </select>
        </SettingItem>

        <SettingItem
          label="Font Size"
          description="Adjust the size of text in the interface"
        >
          <select className="form-select rounded border border-gray-300 p-2">
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>Extra Large</option>
          </select>
        </SettingItem>
      </SettingSection>
    </div>
  );

  const KeyboardSettings = () => (
    <div>
      <SettingSection title="Keyboard Shortcuts">
        <div className="space-y-2">
          <h4 className="font-medium">Chat</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Send Message</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded">Enter</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>New Line</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded">Shift+Enter</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Edit Last Message</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded">↑</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Clear Chat</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl+L</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <h4 className="font-medium">Code Editor</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Save</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl+S</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Find</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl+F</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Replace</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl+H</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Format Code</span>
              <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl+Shift+F</span>
            </div>
          </div>
        </div>
      </SettingSection>

      <SettingSection title="Customize Shortcuts">
        <SettingItem
          label="Edit Shortcuts"
          description="Customize keyboard shortcuts to your preference"
        >
          <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
            Edit Shortcuts
          </button>
        </SettingItem>

        <SettingItem
          label="Reset to Defaults"
          description="Reset all keyboard shortcuts to their default values"
        >
          <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
            Reset
          </button>
        </SettingItem>
      </SettingSection>
    </div>
  );

  const PluginsSettings = () => (
    <div>
      <SettingSection title="Installed Plugins">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <ion-icon name="code-outline" size="large"></ion-icon>
              </div>
              <div>
                <h4 className="font-medium">Code Formatter</h4>
                <p className="text-sm text-gray-500">v1.2.0 by Tesslate</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
                Settings
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm text-red-500">
                Disable
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <ion-icon name="git-branch-outline" size="large"></ion-icon>
              </div>
              <div>
                <h4 className="font-medium">Git Integration</h4>
                <p className="text-sm text-gray-500">v2.0.1 by DevTools</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
                Settings
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm text-red-500">
                Disable
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <ion-icon name="color-palette-outline" size="large"></ion-icon>
              </div>
              <div>
                <h4 className="font-medium">Theme Creator</h4>
                <p className="text-sm text-gray-500">v1.0.3 by UI Tools</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
                Settings
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm text-red-500">
                Disable
              </button>
            </div>
          </div>
        </div>
      </SettingSection>

      <SettingSection title="Plugin Marketplace">
        <SettingItem
          label="Browse Plugins"
          description="Discover and install new plugins from the marketplace"
        >
          <button className="bg-button-dark hover:bg-gray-800 text-white px-3 py-1 rounded">
            Open Marketplace
          </button>
        </SettingItem>

        <SettingItem
          label="Updates Available"
          description="3 plugins have updates available"
        >
          <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
            Update All
          </button>
        </SettingItem>
      </SettingSection>

      <SettingSection title="Developer">
        <SettingItem
          label="Developer Mode"
          description="Enable plugin development features"
        >
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
        </SettingItem>

        <SettingItem
          label="Load Unpacked Plugin"
          description="Load a plugin from a local directory"
        >
          <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
            Browse...
          </button>
        </SettingItem>

        <SettingItem
          label="Plugin Documentation"
          description="View documentation for plugin development"
        >
          <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
            Open Docs
          </button>
        </SettingItem>
      </SettingSection>
    </div>
  );

  const EditorSettings = () => (
    <div>
      <SettingSection title="Code Editor">
        <SettingItem
          label="Default Language"
          description="Set the default language for new code files"
        >
          <select className="form-select rounded border border-gray-300 p-2">
            <option>JavaScript</option>
            <option>TypeScript</option>
            <option>HTML</option>
            <option>CSS</option>
            <option>Python</option>
            <option>Java</option>
          </select>
        </SettingItem>

        <SettingItem
          label="Tab Size"
          description="Number of spaces for each tab"
        >
          <select className="form-select rounded border border-gray-300 p-2">
            <option>2</option>
            <option>4</option>
            <option>8</option>
          </select>
        </SettingItem>

        <SettingItem
          label="Insert Spaces"
          description="Use spaces instead of tabs"
        >
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" checked />
        </SettingItem>

        <SettingItem
          label="Line Numbers"
          description="Show line numbers in the editor"
        >
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" checked />
        </SettingItem>

        <SettingItem
          label="Word Wrap"
          description="Wrap long lines to fit in the editor"
        >
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
        </SettingItem>
      </SettingSection>

      <SettingSection title="Editor Font">
        <SettingItem
          label="Font Family"
          description="Choose the font used in the code editor"
        >
          <select className="form-select rounded border border-gray-300 p-2">
            <option>Consolas</option>
            <option>Fira Code</option>
            <option>JetBrains Mono</option>
            <option>Menlo</option>
            <option>Monaco</option>
          </select>
        </SettingItem>

        <SettingItem
          label="Font Size"
          description="Adjust the size of text in the editor"
        >
          <div className="flex items-center">
            <input type="range" min="8" max="24" value="14" className="form-range w-48" />
            <span className="ml-2">14px</span>
          </div>
        </SettingItem>

        <SettingItem
          label="Line Height"
          description="Adjust the spacing between lines"
        >
          <select className="form-select rounded border border-gray-300 p-2">
            <option>1.0</option>
            <option>1.2</option>
            <option>1.5</option>
            <option>2.0</option>
          </select>
        </SettingItem>
      </SettingSection>

      <SettingSection title="Code Assistance">
        <SettingItem
          label="Auto-completion"
          description="Show code completion suggestions as you type"
        >
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" checked />
        </SettingItem>

        <SettingItem
          label="Parameter Hints"
          description="Show parameter hints for functions"
        >
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" checked />
        </SettingItem>

        <SettingItem
          label="Error Checking"
          description="Check for errors as you type"
        >
          <select className="form-select rounded border border-gray-300 p-2">
            <option>Immediate</option>
            <option>On Save</option>
            <option>Disabled</option>
          </select>
        </SettingItem>

        <SettingItem
          label="Format On Save"
          description="Automatically format code when saving"
        >
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
        </SettingItem>
      </SettingSection>
    </div>
  );


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-4/5 h-4/5 flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Preferences</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
            <ion-icon name="close-outline" size="large"></ion-icon>
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/5 border-r p-4 bg-gray-50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 w-full text-left py-3 px-4 rounded mb-1 transition-colors ${activeTab === tab.id ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <ion-icon name={tab.icon}></ion-icon>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && <GeneralSettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'editor' && <EditorSettings />}
            {activeTab === 'ai' && <AIModelSettings />}
            {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'advanced' && <AdvancedSettings />}
            {activeTab === 'keyboard' && <KeyboardSettings />}
            {activeTab === 'plugins' && <PluginsSettings />}
          </div>
        </div>
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
            Cancel
          </button>
          <button className="bg-button-dark hover:bg-gray-800 text-white px-4 py-2 rounded-lg">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Setting Section Components
const SettingSection = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 pb-2 border-b">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const SettingItem = ({ label, description, children }) => (
  <div className="flex flex-col">
    <div className="flex justify-between items-start mb-1">
      <label className="font-medium text-gray-800">{label}</label>
      {children}
    </div>
    {description && <p className="text-sm text-gray-500">{description}</p>}
  </div>
);


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
        <input type="password" className="form-input rounded border border-gray-300 p-2" placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
      </SettingItem>

      <SettingItem
        label="Anthropic API Key"
        description="Enter your Anthropic API key for Claude models"
      >
        <input type="password" className="form-input rounded border border-gray-300 p-2" placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
      </SettingItem>

      <SettingItem
        label="Google PaLM API Key"
        description="Enter your Google PaLM API key for PaLM models"
      >
        <input type="password" className="form-input rounded border border-gray-300 p-2" placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
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

const AccountSettings = () => (
  <div>
    <SettingSection title="Profile">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden">
          {/* Placeholder for user avatar */}
          <div className="w-full h-full flex items-center justify-center">
            <ion-icon name="person-circle-outline" size="large" className="text-gray-500"></ion-icon>
          </div>
        </div>
        <div>
          <h4 className="font-medium">Your Profile</h4>
          <p className="text-sm text-gray-500">Manage your profile information</p>
        </div>
      </div>

      <SettingItem
        label="Username"
        description="Choose a public username"
      >
        <input type="text" className="form-input rounded border border-gray-300 p-2" placeholder="YourUsername" />
      </SettingItem>

      <SettingItem
        label="Email Address"
        description="Your primary email address"
      >
        <input type="email" className="form-input rounded border border-gray-300 p-2" placeholder="your@email.com" />
      </SettingItem>

      <SettingItem
        label="Change Password"
        description="Update your account password"
      >
        <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
          Change Password
        </button>
      </SettingItem>
    </SettingSection>

    <SettingSection title="Account Security">
      <SettingItem
        label="Two-Factor Authentication"
        description="Enable 2FA for enhanced security"
      >
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
      </SettingItem>

      <SettingItem
        label="Session Management"
        description="View and manage active sessions"
      >
        <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
          Manage Sessions
        </button>
      </SettingItem>
    </SettingSection>

    <SettingSection title="Data Management">
      <SettingItem
        label="Export Account Data"
        description="Download a copy of your account data"
      >
        <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
          Export Data
        </button>
      </SettingItem>

      <SettingItem
        label="Delete Account"
        description="Permanently delete your account and data"
      >
        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
          Delete Account
        </button>
      </SettingItem>
    </SettingSection>
  </div>
);

const AdvancedSettings = () => (
  <div>
    <SettingSection title="Developer Options">
      <SettingItem
        label="Enable Developer Mode"
        description="Unlock advanced features for development and debugging"
      >
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
      </SettingItem>

      <SettingItem
        label="Show Hidden Files"
        description="Display hidden files and folders in file explorers"
      >
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
      </SettingItem>

      <SettingItem
        label="Override High DPI Scaling"
        description="Force application scaling for high DPI displays"
      >
        <select className="form-select rounded border border-gray-300 p-2">
          <option>System Default</option>
          <option>Application</option>
          <option>System (Enhanced)</option>
        </select>
      </SettingItem>
    </SettingSection>

    <SettingSection title="Logging">
      <SettingItem
        label="Enable Debug Logging"
        description="Enable detailed logging for debugging purposes"
      >
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
      </SettingItem>

      <SettingItem
        label="Log File Location"
        description="Specify the location for log files"
      >
        <div className="flex items-center">
          <input type="text" className="form-input rounded border border-gray-300 p-2 flex-grow" placeholder="/path/to/logs" />
          <button className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded">
            <ion-icon name="folder-open-outline"></ion-icon>
          </button>
        </div>
      </SettingItem>

      <SettingItem
        label="Clear Logs on Startup"
        description="Automatically delete log files each time the application starts"
      >
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
      </SettingItem>
    </SettingSection>

    <SettingSection title="Experimental Features">
      <SettingItem
        label="Enable Experimental Features"
        description="Access features that are still in development (may be unstable)"
      >
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
      </SettingItem>

      <SettingItem
        label="Feature Flags"
        description="Configure specific experimental features"
      >
        <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
          Edit Flags
        </button>
      </SettingItem>
    </SettingSection>
  </div>
);


export default SettingsModal;