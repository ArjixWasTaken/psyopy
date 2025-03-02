import React, { useState } from 'react';
import { X, Save, Upload, Download, User, Monitor, Type, Palette, Bell, Shield, Globe } from 'lucide-react';
import { AppSettings, ThemeSettings } from '../../types';
import { getColorValue } from '../../utils/colorUtils';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose
}) => {
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(settings);
  const [activeTab, setActiveTab] = useState<string>('appearance');
  
  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };
  
  const handleChange = (section: keyof AppSettings, key: string, value: any) => {
    setCurrentSettings({
      ...currentSettings,
      [section]: {
        ...currentSettings[section],
        [key]: value
      }
    });
  };
  
  const handleThemeChange = (key: keyof ThemeSettings, value: string) => {
    handleChange('appearance', 'theme', {
      ...currentSettings.appearance.theme,
      [key]: value
    });
  };
  
  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedSettings = JSON.parse(event.target?.result as string);
            setCurrentSettings(importedSettings);
          } catch (error) {
            console.error('Failed to parse settings file:', error);
            // Show error notification
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  
  const handleExportSettings = () => {
    const dataStr = JSON.stringify(currentSettings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'ssh-manager-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Settings</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-700 p-2">
            <nav className="space-y-1">
              <button
                className={`w-full text-left px-3 py-2 rounded flex items-center ${activeTab === 'appearance' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('appearance')}
              >
                <Palette className="h-4 w-4 mr-2" />
                <span>Appearance</span>
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded flex items-center ${activeTab === 'terminal' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('terminal')}
              >
                <Monitor className="h-4 w-4 mr-2" />
                <span>Terminal</span>
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded flex items-center ${activeTab === 'account' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('account')}
              >
                <User className="h-4 w-4 mr-2" />
                <span>Account</span>
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded flex items-center ${activeTab === 'security' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('security')}
              >
                <Shield className="h-4 w-4 mr-2" />
                <span>Security</span>
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded flex items-center ${activeTab === 'network' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('network')}
              >
                <Globe className="h-4 w-4 mr-2" />
                <span>Network</span>
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded flex items-center ${activeTab === 'notifications' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="h-4 w-4 mr-2" />
                <span>Notifications</span>
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded flex items-center ${activeTab === 'data' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('data')}
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Data Management</span>
              </button>
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Appearance</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        className={`p-3 rounded border ${currentSettings.appearance.theme.mode === 'dark' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-600'}`}
                        onClick={() => handleThemeChange('mode', 'dark')}
                      >
                        <div className="h-20 bg-gray-900 rounded mb-2"></div>
                        <div className="text-center text-sm">Dark</div>
                      </button>
                      <button
                        className={`p-3 rounded border ${currentSettings.appearance.theme.mode === 'light' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-600'}`}
                        onClick={() => handleThemeChange('mode', 'light')}
                      >
                        <div className="h-20 bg-gray-100 rounded mb-2"></div>
                        <div className="text-center text-sm">Light</div>
                      </button>
                      <button
                        className={`p-3 rounded border ${currentSettings.appearance.theme.mode === 'system' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-600'}`}
                        onClick={() => handleThemeChange('mode', 'system')}
                      >
                        <div className="h-20 bg-gradient-to-r from-gray-900 to-gray-100 rounded mb-2"></div>
                        <div className="text-center text-sm">System</div>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Accent Color
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {['blue', 'purple', 'green', 'red', 'orange', 'pink'].map(color => (
                        <button
                          key={color}
                          className={`h-8 rounded-full ${currentSettings.appearance.theme.accentColor === color ? 'ring-2 ring-white' : ''}`}
                          style={{ backgroundColor: getColorValue(color) }}
                          onClick={() => handleThemeChange('accentColor', color)}
                        ></button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Sidebar Position
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                          checked={currentSettings.appearance.sidebarPosition === 'left'}
                          onChange={() => handleChange('appearance', 'sidebarPosition', 'left')}
                        />
                        <span className="ml-2 text-sm">Left</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                          checked={currentSettings.appearance.sidebarPosition === 'right'}
                          onChange={() => handleChange('appearance', 'sidebarPosition', 'right')}
                        />
                        <span className="ml-2 text-sm">Right</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                        checked={currentSettings.appearance.compactMode}
                        onChange={(e) => handleChange('appearance', 'compactMode', e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Compact Mode</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'terminal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Terminal</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Font Family
                    </label>
                    <select
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={currentSettings.terminal.fontFamily}
                      onChange={(e) => handleChange('terminal', 'fontFamily', e.target.value)}
                    >
                      <option value="monospace">Monospace</option>
                      <option value="'Fira Code', monospace">Fira Code</option>
                      <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                      <option value="'Source Code Pro', monospace">Source Code Pro</option>
                      <option value="'Courier New', monospace">Courier New</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Font Size
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="8"
                        max="24"
                        step="1"
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        value={currentSettings.terminal.fontSize}
                        onChange={(e) => handleChange('terminal', 'fontSize', parseInt(e.target.value))}
                      />
                      <span className="ml-3 w-8 text-center">{currentSettings.terminal.fontSize}px</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Cursor Style
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                          checked={currentSettings.terminal.cursorStyle === 'block'}
                          onChange={() => handleChange('terminal', 'cursorStyle', 'block')}
                        />
                        <span className="ml-2 text-sm">Block</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                          checked={currentSettings.terminal.cursorStyle === 'underline'}
                          onChange={() => handleChange('terminal', 'cursorStyle', 'underline')}
                        />
                        <span className="ml-2 text-sm">Underline</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                          checked={currentSettings.terminal.cursorStyle === 'bar'}
                          onChange={() => handleChange('terminal', 'cursorStyle', 'bar')}
                        />
                        <span className="ml-2 text-sm">Bar</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Terminal Colors
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Background</label>
                        <div className="flex items-center">
                          <div 
                            className="h-6 w-6 rounded border border-gray-600 mr-2"
                            style={{ backgroundColor: currentSettings.terminal.colors.background }}
                          ></div>
                          <input
                            type="text"
                            className="flex-1 bg-gray-700 text-white px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={currentSettings.terminal.colors.background}
                            onChange={(e) => handleChange('terminal', 'colors', {
                              ...currentSettings.terminal.colors,
                              background: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Foreground</label>
                        <div className="flex items-center">
                          <div 
                            className="h-6 w-6 rounded border border-gray-600 mr-2"
                            style={{ backgroundColor: currentSettings.terminal.colors.foreground }}
                          ></div>
                          <input
                            type="text"
                            className="flex-1 bg-gray-700 text-white px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={currentSettings.terminal.colors.foreground}
                            onChange={(e) => handleChange('terminal', 'colors', {
                              ...currentSettings.terminal.colors,
                              foreground: e.target.value
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                        checked={currentSettings.terminal.ligatures}
                        onChange={(e) => handleChange('terminal', 'ligatures', e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Enable Font Ligatures</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                        checked={currentSettings.terminal.scrollback}
                        onChange={(e) => handleChange('terminal', 'scrollback', e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Unlimited Scrollback</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Account</h3>
                
                {currentSettings.account.isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="bg-gray-700 p-4 rounded flex items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold mr-4">
                        {currentSettings.account.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{currentSettings.account.username}</div>
                        <div className="text-sm text-gray-400">{currentSettings.account.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded"
                        onClick={() => handleChange('account', 'isLoggedIn', false)}
                      >
                        Sign Out
                      </button>
                      <button className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded">
                        Manage Account
                      </button>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Subscription</h4>
                      <div className="bg-gray-700 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Pro Plan</div>
                            <div className="text-sm text-gray-400">Renews on Nov 15, 2025</div>
                          </div>
                          <button className="text-sm text-blue-400 hover:text-blue-300">
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-400">Sign in to sync your settings and connections across devices.</p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded"
                        onClick={() => handleChange('account', 'isLoggedIn', true)}
                      >
                        Sign In
                      </button>
                      <button className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded">
                        Create Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Security</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Connection Timeout
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="30"
                        max="300"
                        step="30"
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        value={currentSettings.security.connectionTimeout}
                        onChange={(e) => handleChange('security', 'connectionTimeout', parseInt(e.target.value))}
                      />
                      <span className="ml-3 w-16 text-center">{currentSettings.security.connectionTimeout}s</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                        checked={currentSettings.security.storePasswords}
                        onChange={(e) => handleChange('security', 'storePasswords', e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Store Passwords</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Passwords will be encrypted and stored locally
                    </p>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                        checked={currentSettings.security.verifyHostKeys}
                        onChange={(e) => handleChange('security', 'verifyHostKeys', e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Verify Host Keys</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                        checked={currentSettings.security.lockOnIdle}
                        onChange={(e) => handleChange('security', 'lockOnIdle', e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Lock After Inactivity</span>
                    </label>
                  </div>
                  
                  {currentSettings.security.lockOnIdle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Idle Timeout (minutes)
                      </label>
                      <select
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={currentSettings.security.idleTimeout}
                        onChange={(e) => handleChange('security', 'idleTimeout', parseInt(e.target.value))}
                      >
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'network' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Network</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Proxy Configuration
                    </label>
                    <select
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={currentSettings.network.proxyType}
                      onChange={(e) => handleChange('network', 'proxyType', e.target.value)}
                    >
                      <option value="none">No Proxy</option>
                      <option value="system">Use System Proxy</option>
                      <option value="manual">Manual Configuration</option>
                    </select>
                  </div>
                  
                  {currentSettings.network.proxyType === 'manual' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Proxy Host
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={currentSettings.network.proxyHost}
                          onChange={(e) => handleChange('network', 'proxyHost', e.target.value)}
                          placeholder="proxy.example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Proxy Port
                        </label>
                        <input
                          type="number"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={currentSettings.network.proxyPort}
                          onChange={(e) => handleChange('network', 'proxyPort', parseInt(e.target.value))}
                          placeholder="8080"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Connection Retry
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                          checked={currentSettings.network.autoReconnect}
                          onChange={(e) => handleChange('network', 'autoReconnect', e.target.checked)}
                        />
                        <span className="ml-2 text-sm">Auto Reconnect</span>
                      </label>
                    </div>
                  </div>
                  
                  {currentSettings.network.autoReconnect && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Max Retry Attempts
                      </label>
                      <select
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={currentSettings.network.maxRetries}
                        onChange={(e) => handleChange('network', 'maxRetries', parseInt(e.target.value))}
                      >
                        <option value="3">3 attempts</option>
                        <option value="5">5 attempts</option>
                        <option value="10">10 attempts</option>
                        <option value="-1">Unlimited</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Notifications</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                        checked={currentSettings.notifications.enabled}
                        onChange={(e) => handleChange('notifications', 'enabled', e.target.checked)}
                      />
                      <span className="ml-2 text-sm">Enable Notifications</span>
                    </label>
                  </div>
                  
                  {currentSettings.notifications.enabled && (
                    <div className="space-y-3 ml-6">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                            checked={currentSettings.notifications.connectionEvents}
                            onChange={(e) => handleChange('notifications', 'connectionEvents', e.target.checked)}
                          />
                          <span className="ml-2 text-sm">Connection Events</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                            checked={currentSettings.notifications.commandCompletion}
                            onChange={(e) => handleChange('notifications', 'commandCompletion', e.target.checked)}
                          />
                          <span className="ml-2 text-sm">Command Completion</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                            checked={currentSettings.notifications.sessionTimeout}
                            onChange={(e) => handleChange('notifications', 'sessionTimeout', e.target.checked)}
                          />
                          <span className="ml-2 text-sm">Session Timeout</span>
                        </label>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Sound
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                          checked={currentSettings.notifications.sound}
                          onChange={(e) => handleChange('notifications', 'sound', e.target.checked)}
                        />
                        <span className="ml-2 text-sm">Play Sound</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'data' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Data Management</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Import/Export</h4>
                    <div className="flex space-x-3">
                      <button 
                        className="flex items-center py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded"
                        onClick={handleImportSettings}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Import Settings
                      </button>
                      <button 
                        className="flex items-center py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded"
                        onClick={handleExportSettings}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Settings
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Sync</h4>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                          checked={currentSettings.data.syncEnabled}
                          onChange={(e) => handleChange('data', 'syncEnabled', e.target.checked)}
                          disabled={!currentSettings.account.isLoggedIn}
                        />
                        <span className="ml-2 text-sm">Enable Cloud Sync</span>
                      </label>
                    </div>
                    {!currentSettings.account.isLoggedIn && (
                      <p className="text-xs text-gray-500 mt-1 ml-6">
                        Sign in to enable cloud sync
                      </p>
                    )}
                  </div>
                  
                  {currentSettings.data.syncEnabled && currentSettings.account.isLoggedIn && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Sync Options</h4>
                      <div className="space-y-2 ml-6">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                            checked={currentSettings.data.syncConnections}
                            onChange={(e) => handleChange('data', 'syncConnections', e.target.checked)}
                          />
                          <span className="ml-2 text-sm">Connections</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                            checked={currentSettings.data.syncIdentities}
                            onChange={(e) => handleChange('data', 'syncIdentities', e.target.checked)}
                          />
                          <span className="ml-2 text-sm">Identities</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                            checked={currentSettings.data.syncSettings}
                            onChange={(e) => handleChange('data', 'syncSettings', e.target.checked)}
                          />
                          <span className="ml-2 text-sm">Settings</span>
                        </label>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Data Reset</h4>
                    <button className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded">
                      Reset All Data
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      This will delete all connections, identities, and settings
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;