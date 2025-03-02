import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import TerminalContainer from './containers/TerminalContainer';
import ModalsContainer from './containers/ModalsContainer';
import ContextMenuContainer from './containers/ContextMenuContainer';
import { useConnections } from './hooks/useConnections';
import { useIdentities } from './hooks/useIdentities';
import { useTerminal } from './hooks/useTerminal';
import { useTabs } from './hooks/useTabs';
import { useSearch } from './hooks/useSearch';
import { useContextMenu } from './hooks/useContextMenu';
import { useSettings } from './hooks/useSettings';
import { TabItem } from './types';

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Custom hooks
  const {
    connections,
    activeConnection,
    isEditing,
    editingConnection,
    setEditingConnection,
    handleConnect,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel
  } = useConnections();
  
  const {
    identities,
    isEditingIdentity,
    editingIdentity,
    showIdentityManager,
    setEditingIdentity,
    handleAddNewIdentity,
    handleEditIdentity,
    handleDeleteIdentity,
    handleSaveIdentity,
    handleCancelIdentity,
    handleManageIdentities,
    handleCloseIdentityManager
  } = useIdentities();
  
  const {
    tabs,
    activeTab,
    openTab,
    activateTab,
    closeTab,
    reorderTabs
  } = useTabs();
  
  const {
    terminalOutput,
    handleTerminalInput,
    updateTerminalForConnection
  } = useTerminal(activeConnection, activeTab?.id || null);
  
  const {
    searchTerm,
    setSearchTerm,
    expandedGroups,
    filteredGroups,
    toggleGroup
  } = useSearch(connections);
  
  const {
    settings,
    showSettings,
    saveSettings,
    openSettings,
    closeSettings
  } = useSettings();
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Apply fullscreen class to parent container
    const terminalContainer = document.querySelector('.terminal-container');
    if (terminalContainer) {
      if (!isFullscreen) {
        terminalContainer.classList.add('fullscreen-terminal');
      } else {
        terminalContainer.classList.remove('fullscreen-terminal');
      }
    }
  };
  
  // Duplicate tab
  const duplicateTab = (tabId: string) => {
    const tabToDuplicate = tabs.find(tab => tab.id === tabId);
    if (tabToDuplicate && activeConnection) {
      const newTabId = openTab(activeConnection);
      updateTerminalForConnection(activeConnection, newTabId);
    }
  };
  
  // Context menu hook
  const {
    contextMenu,
    showContextMenu,
    closeContextMenu
  } = useContextMenu(
    handleConnect,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleAddNewIdentity,
    handleEditIdentity,
    handleDeleteIdentity,
    closeTab,
    duplicateTab,
    toggleFullscreen,
    isFullscreen
  );
  
  // Connect to a server and update terminal
  const connectToServer = (connection: any) => {
    handleConnect(connection);
    const tabId = openTab(connection);
    updateTerminalForConnection(connection, tabId);
  };
  
  // Handle adding a new tab
  const handleAddTab = () => {
    if (activeConnection) {
      const tabId = openTab(activeConnection);
      updateTerminalForConnection(activeConnection, tabId);
    }
  };
  
  // Handle tab context menu
  const handleTabContextMenu = (e: React.MouseEvent, tab: TabItem) => {
    showContextMenu(e, 'tab', tab);
  };
  
  // Handle terminal context menu
  const handleTerminalContextMenu = (e: React.MouseEvent) => {
    showContextMenu(e, 'terminal', null);
  };
  
  // Handle connection context menu
  const handleConnectionContextMenu = (e: React.MouseEvent, connection: any) => {
    showContextMenu(e, 'connection', connection);
  };
  
  // Handle group context menu
  const handleGroupContextMenu = (e: React.MouseEvent, group: string) => {
    showContextMenu(e, 'group', group);
  };
  
  // Handle identity context menu
  const handleIdentityContextMenu = (e: React.MouseEvent, identity: any) => {
    showContextMenu(e, 'identity', identity);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <MainLayout
        connections={connections}
        identities={identities}
        activeConnection={activeConnection}
        searchTerm={searchTerm}
        expandedGroups={expandedGroups}
        filteredGroups={filteredGroups}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
        onAddNewIdentity={handleAddNewIdentity}
        onConnect={connectToServer}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleGroup={toggleGroup}
        onManageIdentities={handleManageIdentities}
        onOpenSettings={openSettings}
        onConnectionContextMenu={handleConnectionContextMenu}
        onGroupContextMenu={handleGroupContextMenu}
        onIdentityContextMenu={handleIdentityContextMenu}
      />
      
      <TerminalContainer
        activeConnection={activeConnection}
        tabs={tabs}
        terminalOutput={terminalOutput}
        onTabClick={activateTab}
        onTabClose={closeTab}
        onAddTab={handleAddTab}
        onTabContextMenu={handleTabContextMenu}
        onTerminalInput={handleTerminalInput}
        onTerminalContextMenu={handleTerminalContextMenu}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        settings={settings.terminal}
      />
      
      <ModalsContainer
        isEditing={isEditing}
        editingConnection={editingConnection}
        connections={connections}
        identities={identities}
        isEditingIdentity={isEditingIdentity}
        editingIdentity={editingIdentity}
        showIdentityManager={showIdentityManager}
        showSettings={showSettings}
        settings={settings}
        onConnectionChange={setEditingConnection}
        onSaveConnection={handleSave}
        onCancelConnection={handleCancel}
        onIdentityChange={setEditingIdentity}
        onSaveIdentity={handleSaveIdentity}
        onCancelIdentity={handleCancelIdentity}
        onCloseIdentityManager={handleCloseIdentityManager}
        onAddNewIdentity={handleAddNewIdentity}
        onEditIdentity={handleEditIdentity}
        onDeleteIdentity={handleDeleteIdentity}
        onIdentityContextMenu={handleIdentityContextMenu}
        onSaveSettings={saveSettings}
        onCloseSettings={closeSettings}
      />
      
      <ContextMenuContainer
        contextMenu={contextMenu}
        onClose={closeContextMenu}
      />
    </div>
  );
}

export default App;