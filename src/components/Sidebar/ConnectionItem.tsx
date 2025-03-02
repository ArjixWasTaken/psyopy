import React from 'react';
import { Server, Edit, Trash2, UserCircle } from 'lucide-react';
import { SSHConnection, SSHIdentity } from '../../types';

interface ConnectionItemProps {
  connection: SSHConnection;
  identity?: SSHIdentity;
  isActive: boolean;
  onConnect: (connection: SSHConnection) => void;
  onEdit: (connection: SSHConnection) => void;
  onDelete: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, connection: SSHConnection) => void;
}

const ConnectionItem: React.FC<ConnectionItemProps> = ({
  connection,
  identity,
  isActive,
  onConnect,
  onEdit,
  onDelete,
  onContextMenu
}) => {
  return (
    <div 
      className={`flex items-center justify-between p-2 pl-8 text-sm hover:bg-gray-800 rounded cursor-pointer ${isActive ? 'bg-gray-800' : ''}`}
      onContextMenu={(e) => onContextMenu(e, connection)}
    >
      <div 
        className="flex items-center flex-1 overflow-hidden"
        onClick={() => onConnect(connection)}
      >
        <Server className="h-4 w-4 mr-2 text-blue-400" />
        <div className="truncate">{connection.name}</div>
        {identity && (
          <div className="flex items-center ml-2 text-xs text-gray-400">
            <UserCircle className="h-3 w-3 mr-1 text-green-400" />
            <span className="truncate">{identity.name}</span>
          </div>
        )}
      </div>
      <div className="flex space-x-1">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(connection);
          }}
          className="p-1 hover:bg-gray-700 rounded"
          title="Edit connection"
        >
          <Edit className="h-3.5 w-3.5 text-gray-400" />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(connection.id);
          }}
          className="p-1 hover:bg-gray-700 rounded"
          title="Delete connection"
        >
          <Trash2 className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default ConnectionItem;