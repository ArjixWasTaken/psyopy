import { useState, useEffect } from 'react';
import { SSHConnection } from '../types';
import { connectionService } from '../services/connectionService';

// Initial connection data
const initialConnections: SSHConnection[] = [
  { 
    id: '1', 
    name: 'Production Server', 
    host: '192.168.1.100', 
    port: 22, 
    username: 'admin', 
    authType: 'key',
    keyPath: '~/.ssh/id_rsa',
    group: 'Production',
    identityId: '1'
  },
  { 
    id: '2', 
    name: 'Development Server', 
    host: '192.168.1.101', 
    port: 22, 
    username: 'developer', 
    authType: 'password',
    password: '********',
    group: 'Development',
    identityId: '2'
  },
  { 
    id: '3', 
    name: 'Staging Server', 
    host: '192.168.1.102', 
    port: 22, 
    username: 'staging', 
    authType: 'password',
    password: '********',
    group: 'Staging'
  }
];

export const useConnections = () => {
  const [connections, setConnections] = useState<SSHConnection[]>(initialConnections);
  const [activeConnection, setActiveConnection] = useState<SSHConnection | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingConnection, setEditingConnection] = useState<SSHConnection | null>(null);
  
  // Load connections from storage on initial render
  useEffect(() => {
    const storedConnections = connectionService.getConnections();
    if (storedConnections.length > 0) {
      setConnections(storedConnections);
    } else {
      // If no stored connections, use initial data and save it
      connectionService.saveConnections(initialConnections);
    }
  }, []);
  
  const handleConnect = (connection: SSHConnection) => {
    setActiveConnection(connection);
  };
  
  const handleAddNew = () => {
    const newConnection: SSHConnection = {
      id: Date.now().toString(),
      name: 'New Connection',
      host: '',
      port: 22,
      username: '',
      authType: 'password',
      group: 'Ungrouped'
    };
    
    setEditingConnection(newConnection);
    setIsEditing(true);
  };
  
  const handleEdit = (connection: SSHConnection) => {
    setEditingConnection({...connection});
    setIsEditing(true);
  };
  
  const handleDelete = (id: string) => {
    const updatedConnections = connectionService.deleteConnection(id);
    setConnections(updatedConnections);
    
    if (activeConnection?.id === id) {
      setActiveConnection(null);
    }
  };
  
  const handleSave = () => {
    if (!editingConnection) return;
    
    const isNew = !connections.some(conn => conn.id === editingConnection.id);
    let updatedConnections: SSHConnection[];
    
    if (isNew) {
      updatedConnections = connectionService.addConnection(editingConnection);
    } else {
      updatedConnections = connectionService.updateConnection(editingConnection);
      
      // Update active connection if it was edited
      if (activeConnection?.id === editingConnection.id) {
        setActiveConnection(editingConnection);
      }
    }
    
    setConnections(updatedConnections);
    setIsEditing(false);
    setEditingConnection(null);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditingConnection(null);
  };

  return {
    connections,
    activeConnection,
    isEditing,
    editingConnection,
    setEditingConnection,
    handleConnect,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel
  };
};