import { AppSettings } from '../types';

// Default settings
const defaultSettings: AppSettings = {
  appearance: {
    theme: {
      mode: 'dark',
      accentColor: 'blue'
    },
    sidebarPosition: 'left',
    compactMode: false
  },
  terminal: {
    fontFamily: 'monospace',
    fontSize: 14,
    cursorStyle: 'block',
    colors: {
      background: '#000000',
      foreground: '#ffffff'
    },
    ligatures: false,
    scrollback: true
  },
  account: {
    isLoggedIn: false,
    username: '',
    email: ''
  },
  security: {
    connectionTimeout: 60,
    storePasswords: true,
    verifyHostKeys: true,
    lockOnIdle: false,
    idleTimeout: 15
  },
  network: {
    proxyType: 'none',
    proxyHost: '',
    proxyPort: 8080,
    autoReconnect: true,
    maxRetries: 3
  },
  notifications: {
    enabled: true,
    connectionEvents: true,
    commandCompletion: false,
    sessionTimeout: true,
    sound: true
  },
  data: {
    syncEnabled: false,
    syncConnections: true,
    syncIdentities: true,
    syncSettings: true
  }
};

/**
 * Service for managing application settings
 */
class SettingsService {
  private storageKey = 'ssh-manager-settings';
  
  /**
   * Get settings from storage
   */
  getSettings(): AppSettings {
    const storedSettings = localStorage.getItem(this.storageKey);
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings);
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
      }
    }
    return defaultSettings;
  }
  
  /**
   * Save settings to storage
   */
  saveSettings(settings: AppSettings): void {
    localStorage.setItem(this.storageKey, JSON.stringify(settings));
  }
  
  /**
   * Reset settings to default
   */
  resetSettings(): AppSettings {
    localStorage.removeItem(this.storageKey);
    return defaultSettings;
  }
  
  /**
   * Update specific section of settings
   */
  updateSettings(section: keyof AppSettings, values: Partial<AppSettings[keyof AppSettings]>): AppSettings {
    const settings = this.getSettings();
    const updatedSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        ...values
      }
    };
    this.saveSettings(updatedSettings);
    return updatedSettings;
  }
  
  /**
   * Export settings as JSON string
   */
  exportSettings(): string {
    return JSON.stringify(this.getSettings(), null, 2);
  }
  
  /**
   * Import settings from JSON string
   */
  importSettings(settingsJson: string): AppSettings {
    try {
      const settings = JSON.parse(settingsJson);
      this.saveSettings(settings);
      return settings;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return this.getSettings();
    }
  }
}

export const settingsService = new SettingsService();