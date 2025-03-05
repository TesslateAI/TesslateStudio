// src/components/settings/SettingsModal.jsx
import React, { useState } from 'react';
import GeneralSettings from './GeneralSettings';
import AppearanceSettings from './AppearanceSettings';
import EditorSettings from './EditorSettings';
import AIModelSettings from './AIModelSettings';
import AccountSettings from './AccountSettings';
import AdvancedSettings from './AdvancedSettings';
import KeyboardSettings from './KeyboardSettings';
import PluginsSettings from './PluginsSettings';

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

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    autoSave: {
      enabled: true,
      interval: '5 minutes',
    },
    defaultProjectLocation: 'C:\\Users\\Documents\\Projects',
    startupBehavior: 'Open new chat',
    hardwareAcceleration: true,
    memoryUsage: 'Medium (4GB)',
    checkUpdates: true,
    updateChannel: 'Stable',
    // Additional settings can be added here
  });

  const handleSettingChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object'
        ? { ...prev[section], [setting]: value }
        : value,
    }));
  };

  if (!isOpen) return null;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings settings={settings} handleSettingChange={handleSettingChange} />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'editor':
        return <EditorSettings />;
      case 'ai':
        return <AIModelSettings />;
      case 'account':
        return <AccountSettings />;
      case 'advanced':
        return <AdvancedSettings />;
      case 'keyboard':
        return <KeyboardSettings />;
      case 'plugins':
        return <PluginsSettings />;
      default:
        return null;
    }
  };

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
            {renderActiveTab()}
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

export default SettingsModal;
