import React from 'react';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';

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
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" defaultChecked />
      </SettingItem>

      <SettingItem
        label="Line Numbers"
        description="Show line numbers in the editor"
      >
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" defaultChecked />
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
          <input type="range" min="8" max="24" defaultValue="14" className="form-range w-48" />
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
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" defaultChecked />
      </SettingItem>

      <SettingItem
        label="Parameter Hints"
        description="Show parameter hints for functions"
      >
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" defaultChecked />
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

export default EditorSettings;
