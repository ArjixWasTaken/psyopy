export interface SSHConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  authType: 'password' | 'key';
  password?: string;
  keyPath?: string;
  group?: string;
  identityId?: string;
}

export interface SSHIdentity {
  id: string;
  name: string;
  username: string;
  authType: 'password' | 'key';
  password?: string;
  keyPath?: string;
}

export interface TabItem {
  id: string;
  connectionId: string;
  title: string;
  active: boolean;
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  onClick: () => void;
  divider?: boolean;
  disabled?: boolean;
}

export type ContextMenuType = 'connection' | 'tab' | 'terminal' | 'identity' | 'group';

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  accentColor: string;
}

export interface AppSettings {
  appearance: {
    theme: ThemeSettings;
    sidebarPosition: 'left' | 'right';
    compactMode: boolean;
  };
  terminal: {
    fontFamily: string;
    fontSize: number;
    cursorStyle: 'block' | 'underline' | 'bar';
    colors: {
      background: string;
      foreground: string;
    };
    ligatures: boolean;
    scrollback: boolean;
  };
  account: {
    isLoggedIn: boolean;
    username: string;
    email: string;
  };
  security: {
    connectionTimeout: number;
    storePasswords: boolean;
    verifyHostKeys: boolean;
    lockOnIdle: boolean;
    idleTimeout: number;
  };
  network: {
    proxyType: 'none' | 'system' | 'manual';
    proxyHost: string;
    proxyPort: number;
    autoReconnect: boolean;
    maxRetries: number;
  };
  notifications: {
    enabled: boolean;
    connectionEvents: boolean;
    commandCompletion: boolean;
    sessionTimeout: boolean;
    sound: boolean;
  };
  data: {
    syncEnabled: boolean;
    syncConnections: boolean;
    syncIdentities: boolean;
    syncSettings: boolean;
  };
}