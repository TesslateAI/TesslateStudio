// src/components/settings/AppearanceSettings.jsx
import React from 'react';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';

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

    {/* More sections (Layout, Font Settings, etc.) can be added similarly */}
  </div>
);

export default AppearanceSettings;
