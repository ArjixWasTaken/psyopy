import React from 'react';
import ConnectionModal from '../components/ConnectionModal/ConnectionModal';
import IdentityModal from '../components/IdentityModal/IdentityModal';
import IdentityManager from '../components/IdentityModal/IdentityManager';
import SettingsModal from '../components/Settings/SettingsModal';
import { SSHConnection, SSHIdentity, AppSettings } from '../types';

interface ModalsContainerProps {
  isEditing: boolean;
  editingConnection: SSHConnection | null;
  connections: SSHConnection[];
  identities: SSHIdentity[];
  isEditingIdentity: boolean;
  editingIdentity: SSHIdentity | null;
  showIdentityManager: boolean;
  showSettings: boolean;
  settings: AppSettings;
  onConnectionChange: (connection: SSHConnection) => void;
  onSaveConnection: () => void;
  onCancelConnection: () => void;
  onIdentityChange: (identity: SSHIdentity) => void;
  onSaveIdentity: () => void;
  onCancelIdentity: () => void;
  onCloseIdentityManager: () => void;
  onAddNewIdentity: () => void;
  onEditIdentity: (identity: SSHIdentity) => void;
  onDeleteIdentity: (id: string) => void;
  onIdentityContextMenu: (e: React.MouseEvent, identity: SSHIdentity) => void;
  onSaveSettings: (settings: AppSettings) => void;
  onCloseSettings: () => void;
}

const ModalsContainer: React.FC<ModalsContainerProps> = ({
  isEditing,
  editingConnection,
  connections,
  identities,
  isEditingIdentity,
  editingIdentity,
  showIdentityManager,
  showSettings,
  settings,
  onConnectionChange,
  onSaveConnection,
  onCancelConnection,
  onIdentityChange,
  onSaveIdentity,
  onCancelIdentity,
  onCloseIdentityManager,
  onAddNewIdentity,
  onEditIdentity,
  onDeleteIdentity,
  onIdentityContextMenu,
  onSaveSettings,
  onCloseSettings
}) => {
  // Only render one modal at a time, with priority order:
  // 1. Identity Modal (highest priority)
  // 2. Connection Modal
  // 3. Identity Manager
  // 4. Settings Modal
  
  return (
    <>
      {/* Edit/Add identity modal (highest priority) */}
      {isEditingIdentity && editingIdentity && (
        <IdentityModal
          editingIdentity={editingIdentity}
          identities={identities}
          onSave={onSaveIdentity}
          onCancel={onCancelIdentity}
          onIdentityChange={onIdentityChange}
        />
      )}
      
      {/* Edit/Add connection modal */}
      {!isEditingIdentity && isEditing && editingConnection && (
        <ConnectionModal
          editingConnection={editingConnection}
          connections={connections}
          identities={identities}
          onSave={onSaveConnection}
          onCancel={onCancelConnection}
          onConnectionChange={onConnectionChange}
        />
      )}
      
      {/* Identity manager modal */}
      {!isEditingIdentity && !isEditing && showIdentityManager && (
        <IdentityManager
          identities={identities}
          onClose={onCloseIdentityManager}
          onAddNew={onAddNewIdentity}
          onEdit={onEditIdentity}
          onDelete={onDeleteIdentity}
          onIdentityContextMenu={onIdentityContextMenu}
        />
      )}
      
      {/* Settings modal */}
      {!isEditingIdentity && !isEditing && !showIdentityManager && showSettings && (
        <SettingsModal
          settings={settings}
          onSave={onSaveSettings}
          onClose={onCloseSettings}
        />
      )}
    </>
  );
};

export default ModalsContainer;