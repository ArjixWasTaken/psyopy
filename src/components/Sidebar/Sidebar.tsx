import React, { useState } from 'react';
import { Server, Plus, Settings, UserCircle } from 'lucide-react';
import { SSHConnection, SSHIdentity } from '../../types';
import SearchBar from './SearchBar';
import ConnectionGroup from './ConnectionGroup';

interface SidebarProps {
  connections: SSHConnection[];
  identities: SSHIdentity[];
  activeConnection: SSHConnection | null;
  searchTerm: string;
  expandedGroups: Record<string, boolean>;
  filteredGroups: Record<string, SSHConnection[]>;
  onSearchChange: (value: string) => void;
  onAddNew: () => void;
  onAddNewIdentity: () => void;
  onConnect: (connection: SSHConnection) => void;
  onEdit: (connection: SSHConnection) => void;
  onDelete: (id: string) => void;
  onToggleGroup: (group: string) => void;
  onManageIdentities: () => void;
  onOpenSettings: () => void;
  onConnectionContextMenu: (e: React.MouseEvent, connection: SSHConnection) => void;
  onGroupContextMenu: (e: React.MouseEvent, group: string) => void;
  onIdentityContextMenu: (e: React.MouseEvent, identity: SSHIdentity) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeConnection,
  connections,
  identities,
  searchTerm,
  expandedGroups,
  filteredGroups,
  onSearchChange,
  onAddNew,
  onAddNewIdentity,
  onConnect,
  onEdit,
  onDelete,
  onToggleGroup,
  onManageIdentities,
  onOpenSettings,
  onConnectionContextMenu,
  onGroupContextMenu,
  onIdentityContextMenu
}) => {
  const [showConnectionsMenu, setShowConnectionsMenu] = useState(false);
  
  return (
    <div className="w-64 border-r border-gray-700 flex flex-col">
      {/* App title */}
      <div className="p-4 border-b border-gray-700 flex items-center">
        <Server className="h-6 w-6 mr-2 text-blue-400" />
        <h1 className="text-xl font-bold">SSH Manager</h1>
      </div>
      
      {/* Search */}
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />
      
      {/* Connection list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-gray-400">CONNECTIONS</h2>
            <div className="relative">
              <button 
                onClick={() => setShowConnectionsMenu(!showConnectionsMenu)}
                className="p-1 hover:bg-gray-700 rounded"
                title="Add new"
              >
                <Plus className="h-4 w-4 text-gray-400" />
              </button>
              
              {showConnectionsMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onAddNew();
                        setShowConnectionsMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-700"
                    >
                      <Server className="h-4 w-4 mr-2 text-blue-400" />
                      New Connection
                    </button>
                    <button
                      onClick={() => {
                        onAddNewIdentity();
                        setShowConnectionsMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-700"
                    >
                      <UserCircle className="h-4 w-4 mr-2 text-green-400" />
                      New Identity
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {Object.keys(filteredGroups).length === 0 ? (
            <div className="text-gray-500 text-sm p-2">No connections found</div>
          ) : (
            Object.entries(filteredGroups).map(([group, conns]) => (
              <ConnectionGroup
                key={group}
                group={group}
                connections={conns}
                identities={identities}
                isExpanded={expandedGroups[group] || false}
                activeConnectionId={activeConnection?.id || null}
                onToggleGroup={onToggleGroup}
                onConnect={onConnect}
                onEdit={onEdit}
                onDelete={onDelete}
                onContextMenu={onConnectionContextMenu}
                onGroupContextMenu={onGroupContextMenu}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Bottom buttons */}
      <div className="p-3 border-t border-gray-700 space-y-2">
        <button 
          onClick={onManageIdentities}
          className="w-full flex items-center justify-center py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded"
          onContextMenu={(e) => {
            e.preventDefault();
            if (identities.length > 0) {
              onIdentityContextMenu(e, identities[0]);
            }
          }}
        >
          <UserCircle className="h-4 w-4 mr-2" />
          <span>Manage Identities</span>
        </button>
        <button 
          className="w-full flex items-center justify-center py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded"
          onClick={onOpenSettings}
        >
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
