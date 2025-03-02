import React from 'react';
import { Terminal, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddNew }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400">
      <Terminal className="h-16 w-16 mb-4 text-gray-600" />
      <h2 className="text-xl font-medium mb-2">No Active Connection</h2>
      <p className="mb-4">Select a connection from the sidebar or create a new one</p>
      <button 
        onClick={onAddNew}
        className="flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        <span>New Connection</span>
      </button>
    </div>
  );
};

export default EmptyState;