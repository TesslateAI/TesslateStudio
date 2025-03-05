import React from 'react';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';

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

export default AccountSettings;
