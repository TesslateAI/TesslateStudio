import React from 'react';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';

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

export default AdvancedSettings;
