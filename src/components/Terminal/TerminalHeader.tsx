import React from 'react';
import { Server } from 'lucide-react';
import { SSHConnection } from '../../types';

interface TerminalHeaderProps {
  activeConnection: SSHConnection | null;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({ activeConnection }) => {
  return (
    <div className="h-12 border-b border-gray-700 flex items-center px-4">
      {activeConnection ? (
        <div className="flex items-center">
          <Server className="h-5 w-5 mr-2 text-blue-400" />
          <span className="font-medium">{activeConnection.name}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-gray-400">{activeConnection.username}@{activeConnection.host}:{activeConnection.port}</span>
        </div>
      ) : (
        <div className="text-gray-400">No active connection</div>
      )}
    </div>
  );
};

export default TerminalHeader;