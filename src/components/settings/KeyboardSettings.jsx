import React from 'react';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';

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

export default KeyboardSettings;
