import React from 'react';
import TerminalHeader from '../components/Terminal/TerminalHeader';
import Terminal from '../components/Terminal/Terminal';
import TabBar from '../components/Terminal/TabBar';
import EmptyState from '../components/Terminal/EmptyState';
import { SSHConnection, TabItem } from '../types';

interface TerminalContainerProps {
  activeConnection: SSHConnection | null;
  tabs: TabItem[];
  terminalOutput: string[];
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onAddTab: () => void;
  onTabContextMenu: (e: React.MouseEvent, tab: TabItem) => void;
  onTerminalInput: (input: string) => void;
  onTerminalContextMenu: (e: React.MouseEvent) => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  settings?: {
    fontFamily: string;
    fontSize: number;
    colors: {
      background: string;
      foreground: string;
    };
    ligatures: boolean;
  };
}

const TerminalContainer: React.FC<TerminalContainerProps> = ({
  activeConnection,
  tabs,
  terminalOutput,
  onTabClick,
  onTabClose,
  onAddTab,
  onTabContextMenu,
  onTerminalInput,
  onTerminalContextMenu,
  onToggleFullscreen,
  isFullscreen,
  settings
}) => {
  return (
    <div className="flex-1 flex flex-col terminal-container">
      {/* Top bar */}
      <TerminalHeader activeConnection={activeConnection} />
      
      {/* Terminal or welcome screen */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeConnection && tabs.length > 0 ? (
          <>
            {/* Tab bar */}
            <TabBar
              tabs={tabs}
              connections={[]}
              onTabClick={onTabClick}
              onTabClose={onTabClose}
              onAddTab={onAddTab}
              onTabContextMenu={onTabContextMenu}
              onToggleFullscreen={onToggleFullscreen}
              isFullscreen={isFullscreen}
            />
            
            {/* Terminal */}
            <div className="flex-1">
              <Terminal
                activeConnection={activeConnection}
                terminalOutput={terminalOutput}
                onTerminalInput={onTerminalInput}
                onContextMenu={onTerminalContextMenu}
                settings={settings}
              />
            </div>
          </>
        ) : (
          <EmptyState onAddNew={onAddTab} />
        )}
      </div>
    </div>
  );
};

export default TerminalContainer;