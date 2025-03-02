import React from 'react';
import { X, Save, User, Key } from 'lucide-react';
import { SSHIdentity } from '../../types';

interface IdentityModalProps {
  editingIdentity: SSHIdentity;
  identities: SSHIdentity[];
  onSave: () => void;
  onCancel: () => void;
  onIdentityChange: (identity: SSHIdentity) => void;
}

const IdentityModal: React.FC<IdentityModalProps> = ({
  editingIdentity,
  identities,
  onSave,
  onCancel,
  onIdentityChange
}) => {
  const isEditing = identities.some(id => id.id === editingIdentity.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Edit Identity' : 'New Identity'}
          </h2>
          <button 
            onClick={onCancel}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Identity Name
            </label>
            <input
              type="text"
              className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={editingIdentity.name}
              onChange={(e) => onIdentityChange({
                ...editingIdentity,
                name: e.target.value
              })}
              placeholder="e.g., Production Admin, Dev User"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Username
            </label>
            <div className="flex items-center bg-gray-700 rounded">
              <User className="h-4 w-4 ml-3 text-gray-400" />
              <input
                type="text"
                className="flex-1 bg-transparent border-none px-2 py-2 focus:outline-none"
                value={editingIdentity.username}
                onChange={(e) => onIdentityChange({
                  ...editingIdentity,
                  username: e.target.value
                })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Authentication
            </label>
            <div className="flex space-x-4 mb-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                  checked={editingIdentity.authType === 'password'}
                  onChange={() => onIdentityChange({
                    ...editingIdentity,
                    authType: 'password'
                  })}
                />
                <span className="ml-2 text-sm">Password</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                  checked={editingIdentity.authType === 'key'}
                  onChange={() => onIdentityChange({
                    ...editingIdentity,
                    authType: 'key'
                  })}
                />
                <span className="ml-2 text-sm">SSH Key</span>
              </label>
            </div>
            
            {editingIdentity.authType === 'password' ? (
              <div className="flex items-center bg-gray-700 rounded">
                <Key className="h-4 w-4 ml-3 text-gray-400" />
                <input
                  type="password"
                  className="flex-1 bg-transparent border-none px-2 py-2 focus:outline-none"
                  value={editingIdentity.password || ''}
                  onChange={(e) => onIdentityChange({
                    ...editingIdentity,
                    password: e.target.value
                  })}
                  placeholder="Password"
                />
              </div>
            ) : (
              <div className="flex items-center bg-gray-700 rounded">
                <Key className="h-4 w-4 ml-3 text-gray-400" />
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none px-2 py-2 focus:outline-none"
                  value={editingIdentity.keyPath || ''}
                  onChange={(e) => onIdentityChange({
                    ...editingIdentity,
                    keyPath: e.target.value
                  })}
                  placeholder="Path to private key"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={onCancel}
              className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityModal;