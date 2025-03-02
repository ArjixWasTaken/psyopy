import React from "react";
import { X, Save, Globe, User, Key, UserCircle } from "lucide-react";
import { SSHConnection, SSHIdentity } from "../../types";

interface ConnectionModalProps {
    editingConnection: SSHConnection;
    connections: SSHConnection[];
    identities: SSHIdentity[];
    onSave: () => void;
    onCancel: () => void;
    onConnectionChange: (connection: SSHConnection) => void;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({ editingConnection, connections, identities, onSave, onCancel, onConnectionChange }) => {
    const isEditing = connections.some((conn) => conn.id === editingConnection.id);
    const selectedIdentity = editingConnection.identityId ? identities.find((id) => id.id === editingConnection.identityId) : undefined;

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{isEditing ? "Edit Connection" : "New Connection"}</h2>
                    <button onClick={onCancel} className="p-1 rounded hover:bg-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-400">Connection Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={editingConnection.name}
                            onChange={(e) =>
                                onConnectionChange({
                                    ...editingConnection,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-400">Group</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={editingConnection.group || ""}
                            onChange={(e) =>
                                onConnectionChange({
                                    ...editingConnection,
                                    group: e.target.value,
                                })
                            }
                            placeholder="e.g., Production, Development"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block mb-1 text-sm font-medium text-gray-400">Host</label>
                            <div className="flex items-center bg-gray-700 rounded">
                                <Globe className="w-4 h-4 ml-3 text-gray-400" />
                                <input
                                    type="text"
                                    className="flex-1 px-2 py-2 bg-transparent border-none focus:outline-none"
                                    value={editingConnection.host}
                                    onChange={(e) =>
                                        onConnectionChange({
                                            ...editingConnection,
                                            host: e.target.value,
                                        })
                                    }
                                    placeholder="hostname or IP"
                                />
                            </div>
                        </div>

                        <div className="w-24">
                            <label className="block mb-1 text-sm font-medium text-gray-400">Port</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={editingConnection.port}
                                onChange={(e) =>
                                    onConnectionChange({
                                        ...editingConnection,
                                        port: parseInt(e.target.value) || 22,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-400">Identity</label>
                        <div className="flex items-center space-x-2">
                            <select
                                className="flex-1 px-3 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={editingConnection.identityId || ""}
                                onChange={(e) => {
                                    const identityId = e.target.value || undefined;
                                    const selectedIdentity = identityId ? identities.find((id) => id.id === identityId) : undefined;

                                    onConnectionChange({
                                        ...editingConnection,
                                        identityId,
                                        // If identity is selected, use its values
                                        ...(selectedIdentity && {
                                            username: selectedIdentity.username,
                                            authType: selectedIdentity.authType,
                                            password: selectedIdentity.password,
                                            keyPath: selectedIdentity.keyPath,
                                        }),
                                    });
                                }}
                            >
                                <option value="">Custom (No Identity)</option>
                                {identities.map((identity) => (
                                    <option key={identity.id} value={identity.id}>
                                        {identity.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {!editingConnection.identityId && (
                        <>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-400">Username</label>
                                <div className="flex items-center bg-gray-700 rounded">
                                    <User className="w-4 h-4 ml-3 text-gray-400" />
                                    <input
                                        type="text"
                                        className="flex-1 px-2 py-2 bg-transparent border-none focus:outline-none"
                                        value={editingConnection.username}
                                        onChange={(e) =>
                                            onConnectionChange({
                                                ...editingConnection,
                                                username: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-400">Authentication</label>
                                <div className="flex mb-3 space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                            checked={editingConnection.authType === "password"}
                                            onChange={() =>
                                                onConnectionChange({
                                                    ...editingConnection,
                                                    authType: "password",
                                                })
                                            }
                                        />
                                        <span className="ml-2 text-sm">Password</span>
                                    </label>

                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                            checked={editingConnection.authType === "key"}
                                            onChange={() =>
                                                onConnectionChange({
                                                    ...editingConnection,
                                                    authType: "key",
                                                })
                                            }
                                        />
                                        <span className="ml-2 text-sm">SSH Key</span>
                                    </label>
                                </div>

                                {editingConnection.authType === "password" ? (
                                    <div className="flex items-center bg-gray-700 rounded">
                                        <Key className="w-4 h-4 ml-3 text-gray-400" />
                                        <input
                                            type="password"
                                            className="flex-1 px-2 py-2 bg-transparent border-none focus:outline-none"
                                            value={editingConnection.password || ""}
                                            onChange={(e) =>
                                                onConnectionChange({
                                                    ...editingConnection,
                                                    password: e.target.value,
                                                })
                                            }
                                            placeholder="Password"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center bg-gray-700 rounded">
                                        <Key className="w-4 h-4 ml-3 text-gray-400" />
                                        <input
                                            type="text"
                                            className="flex-1 px-2 py-2 bg-transparent border-none focus:outline-none"
                                            value={editingConnection.keyPath || ""}
                                            onChange={(e) =>
                                                onConnectionChange({
                                                    ...editingConnection,
                                                    keyPath: e.target.value,
                                                })
                                            }
                                            placeholder="Path to private key"
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {editingConnection.identityId && (
                        <div className="p-3 bg-gray-700 rounded">
                            <div className="flex items-center mb-2">
                                <UserCircle className="w-4 h-4 mr-2 text-green-400" />
                                <span className="text-sm font-medium">{selectedIdentity?.name}</span>
                            </div>
                            <div className="space-y-1 text-xs text-gray-400">
                                <div>Username: {selectedIdentity?.username}</div>
                                <div>Auth Type: {selectedIdentity?.authType === "password" ? "Password" : "SSH Key"}</div>
                                {selectedIdentity?.authType === "key" && <div>Key Path: {selectedIdentity?.keyPath}</div>}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-2 space-x-3">
                        <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                        <button onClick={onSave} className="flex items-center px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectionModal;
