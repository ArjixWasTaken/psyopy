import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import { SSHConnection, SSHIdentity } from '../types';

interface MainLayoutProps {
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

const MainLayout: React.FC<MainLayoutProps> = ({
  connections,
  identities,
  activeConnection,
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
  return (
    <Sidebar
      connections={connections}
      identities={identities}
      activeConnection={activeConnection}
      searchTerm={searchTerm}
      expandedGroups={expandedGroups}
      filteredGroups={filteredGroups}
      onSearchChange={onSearchChange}
      onAddNew={onAddNew}
      onAddNewIdentity={onAddNewIdentity}
      onConnect={onConnect}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleGroup={onToggleGroup}
      onManageIdentities={onManageIdentities}
      onOpenSettings={onOpenSettings}
      onConnectionContextMenu={onConnectionContextMenu}
      onGroupContextMenu={onGroupContextMenu}
      onIdentityContextMenu={onIdentityContextMenu}
    />
  );
};

export default MainLayout;