import React from 'react';
import { FolderClosed, ChevronDown, ChevronRight } from 'lucide-react';
import { SSHConnection, SSHIdentity } from '../../types';
import ConnectionItem from './ConnectionItem';

interface ConnectionGroupProps {
  group: string;
  connections: SSHConnection[];
  identities: SSHIdentity[];
  isExpanded: boolean;
  activeConnectionId: string | null;
  onToggleGroup: (group: string) => void;
  onConnect: (connection: SSHConnection) => void;
  onEdit: (connection: SSHConnection) => void;
  onDelete: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, connection: SSHConnection) => void;
  onGroupContextMenu: (e: React.MouseEvent, group: string) => void;
}

const ConnectionGroup: React.FC<ConnectionGroupProps> = ({
  group,
  connections,
  identities,
  isExpanded,
  activeConnectionId,
  onToggleGroup,
  onConnect,
  onEdit,
  onDelete,
  onContextMenu,
  onGroupContextMenu
}) => {
  return (
    <div className="mb-2">
      <div 
        className="flex items-center p-1.5 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded cursor-pointer"
        onClick={() => onToggleGroup(group)}
        onContextMenu={(e) => onGroupContextMenu(e, group)}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
        )}
        <FolderClosed className="h-4 w-4 mr-2 text-yellow-500" />
        {group}
      </div>
      
      {isExpanded && connections.map(conn => (
        <ConnectionItem
          key={conn.id}
          connection={conn}
          identity={conn.identityId ? identities.find(id => id.id === conn.identityId) : undefined}
          isActive={activeConnectionId === conn.id}
          onConnect={onConnect}
          onEdit={onEdit}
          onDelete={onDelete}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  );
};

export default ConnectionGroup;