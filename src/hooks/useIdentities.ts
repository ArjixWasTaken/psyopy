import { useState, useEffect } from 'react';
import { SSHIdentity } from '../types';
import { identityService } from '../services/identityService';

// Initial identity data
const initialIdentities: SSHIdentity[] = [
  {
    id: '1',
    name: 'Production Admin',
    username: 'admin',
    authType: 'key',
    keyPath: '~/.ssh/id_rsa'
  },
  {
    id: '2',
    name: 'Development User',
    username: 'developer',
    authType: 'password',
    password: '********'
  }
];

export const useIdentities = () => {
  const [identities, setIdentities] = useState<SSHIdentity[]>(initialIdentities);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState<SSHIdentity | null>(null);
  const [showIdentityManager, setShowIdentityManager] = useState(false);
  
  // Load identities from storage on initial render
  useEffect(() => {
    const storedIdentities = identityService.getIdentities();
    if (storedIdentities.length > 0) {
      setIdentities(storedIdentities);
    } else {
      // If no stored identities, use initial data and save it
      identityService.saveIdentities(initialIdentities);
    }
  }, []);
  
  const handleAddNewIdentity = () => {
    // Close identity manager if it's open
    setShowIdentityManager(false);
    
    const newIdentity: SSHIdentity = {
      id: Date.now().toString(),
      name: 'New Identity',
      username: '',
      authType: 'password'
    };
    
    setEditingIdentity(newIdentity);
    setIsEditingIdentity(true);
  };
  
  const handleEditIdentity = (identity: SSHIdentity) => {
    // Close identity manager if it's open
    setShowIdentityManager(false);
    
    setEditingIdentity({...identity});
    setIsEditingIdentity(true);
  };
  
  const handleDeleteIdentity = (id: string) => {
    const updatedIdentities = identityService.deleteIdentity(id);
    setIdentities(updatedIdentities);
  };
  
  const handleSaveIdentity = () => {
    if (!editingIdentity) return;
    
    const isNew = !identities.some(identity => identity.id === editingIdentity.id);
    let updatedIdentities: SSHIdentity[];
    
    if (isNew) {
      updatedIdentities = identityService.addIdentity(editingIdentity);
    } else {
      updatedIdentities = identityService.updateIdentity(editingIdentity);
    }
    
    setIdentities(updatedIdentities);
    setIsEditingIdentity(false);
    setEditingIdentity(null);
    
    // Reopen identity manager if it was open before
    if (showIdentityManager) {
      setTimeout(() => setShowIdentityManager(true), 100);
    }
  };
  
  const handleCancelIdentity = () => {
    setIsEditingIdentity(false);
    setEditingIdentity(null);
    
    // Reopen identity manager if it was open before
    if (showIdentityManager) {
      setTimeout(() => setShowIdentityManager(true), 100);
    }
  };
  
  const handleManageIdentities = () => {
    setShowIdentityManager(true);
  };
  
  const handleCloseIdentityManager = () => {
    setShowIdentityManager(false);
  };

  return {
    identities,
    isEditingIdentity,
    editingIdentity,
    showIdentityManager,
    setEditingIdentity,
    handleAddNewIdentity,
    handleEditIdentity,
    handleDeleteIdentity,
    handleSaveIdentity,
    handleCancelIdentity,
    handleManageIdentities,
    handleCloseIdentityManager
  };
};