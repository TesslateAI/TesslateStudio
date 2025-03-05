// src/components/settings/SettingSection.jsx
import React from 'react';

const SettingSection = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 pb-2 border-b">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

export default SettingSection;
