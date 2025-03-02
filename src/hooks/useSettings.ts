import { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { settingsService } from '../services/settingsService';

export const useSettings = () => {
  // Load settings from service
  const [settings, setSettings] = useState<AppSettings>(settingsService.getSettings());
  const [showSettings, setShowSettings] = useState(false);
  
  // Load settings from storage on initial render
  useEffect(() => {
    const storedSettings = settingsService.getSettings();
    setSettings(storedSettings);
  }, []);
  
  const saveSettings = (newSettings: AppSettings) => {
    settingsService.saveSettings(newSettings);
    setSettings(newSettings);
  };
  
  const openSettings = () => {
    setShowSettings(true);
  };
  
  const closeSettings = () => {
    setShowSettings(false);
  };
  
  const updateSettingsSection = (section: keyof AppSettings, values: Partial<AppSettings[keyof AppSettings]>) => {
    const updatedSettings = settingsService.updateSettings(section, values);
    setSettings(updatedSettings);
    return updatedSettings;
  };
  
  const resetSettings = () => {
    const defaultSettings = settingsService.resetSettings();
    setSettings(defaultSettings);
    return defaultSettings;
  };
  
  const exportSettings = () => {
    return settingsService.exportSettings();
  };
  
  const importSettings = (settingsJson: string) => {
    const importedSettings = settingsService.importSettings(settingsJson);
    setSettings(importedSettings);
    return importedSettings;
  };
  
  return {
    settings,
    showSettings,
    saveSettings,
    openSettings,
    closeSettings,
    updateSettingsSection,
    resetSettings,
    exportSettings,
    importSettings
  };
};