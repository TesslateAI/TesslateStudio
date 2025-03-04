// src/components/settings/GeneralSettings.jsx
import React from 'react';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';

const GeneralSettings = ({ settings, handleSettingChange }) => (
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

export default GeneralSettings;
