import React from 'react';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';

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

export default PluginsSettings;
