// src/components/settings/SettingItem.jsx
import React from 'react';

const SettingItem = ({ label, description, children }) => (
  <div className="flex flex-col">
    <div className="flex justify-between items-start mb-1">
      <label className="font-medium text-gray-800">{label}</label>
      {children}
    </div>
    {description && <p className="text-sm text-gray-500">{description}</p>}
  </div>
);

export default SettingItem;
