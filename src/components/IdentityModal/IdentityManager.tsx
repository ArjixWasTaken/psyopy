import React from 'react';
import { X, UserCircle, Edit, Trash2, Plus } from 'lucide-react';
import { SSHIdentity } from '../../types';

interface IdentityManagerProps {
  identities: SSHIdentity[];
  onClose: () => void;
  onAddNew: () => void;
  onEdit: (identity: SSHIdentity) => void;
  onDelete: (id: string) => void;
  onIdentityContextMenu: (e: React.MouseEvent, identity: SSHIdentity) => void;
}

const IdentityManager: React.FC<IdentityManagerProps> = ({
  identities,
  onClose,
  onAddNew,
  onEdit,
  onDelete,
  onIdentityContextMenu
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Identities</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-400">
            Identities can be assigned to multiple connections to reuse authentication settings.
          </p>
          <button
            onClick={onAddNew}
            className="flex items-center py-1.5 px-3 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Identity
          </button>
        </div>
        
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {identities.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <UserCircle className="h-12 w-12 mx-auto mb-2 text-gray-600" />
              <p>No identities created yet</p>
              <button
                onClick={onAddNew}
                className="mt-3 text-blue-500 hover:text-blue-400"
              >
                Create your first identity
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-800 text-left text-sm">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Auth Type</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {identities.map(identity => (
                  <tr 
                    key={identity.id} 
                    className="hover:bg-gray-800"
                    onContextMenu={(e) => onIdentityContextMenu(e, identity)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <UserCircle className="h-4 w-4 mr-2 text-green-400" />
                        {identity.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">{identity.username}</td>
                    <td className="px-4 py-3">
                      {identity.authType === 'password' ? 'Password' : 'SSH Key'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(identity)}
                          className="p-1 hover:bg-gray-700 rounded"
                          title="Edit identity"
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => onDelete(identity.id)}
                          className="p-1 hover:bg-gray-700 rounded"
                          title="Delete identity"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentityManager;