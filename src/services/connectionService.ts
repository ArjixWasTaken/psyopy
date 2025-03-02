import { SSHConnection } from '../types';

/**
 * Service for managing SSH connections
 */
class ConnectionService {
  private storageKey = 'ssh-manager-connections';
  
  /**
   * Get all connections from storage
   */
  getConnections(): SSHConnection[] {
    const storedConnections = localStorage.getItem(this.storageKey);
    if (storedConnections) {
      try {
        return JSON.parse(storedConnections);
      } catch (error) {
        console.error('Failed to parse stored connections:', error);
      }
    }
    return [];
  }
  
  /**
   * Save connections to storage
   */
  saveConnections(connections: SSHConnection[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(connections));
  }
  
  /**
   * Add a new connection
   */
  addConnection(connection: SSHConnection): SSHConnection[] {
    const connections = this.getConnections();
    const newConnections = [...connections, connection];
    this.saveConnections(newConnections);
    return newConnections;
  }
  
  /**
   * Update an existing connection
   */
  updateConnection(connection: SSHConnection): SSHConnection[] {
    const connections = this.getConnections();
    const newConnections = connections.map(conn => 
      conn.id === connection.id ? connection : conn
    );
    this.saveConnections(newConnections);
    return newConnections;
  }
  
  /**
   * Delete a connection
   */
  deleteConnection(id: string): SSHConnection[] {
    const connections = this.getConnections();
    const newConnections = connections.filter(conn => conn.id !== id);
    this.saveConnections(newConnections);
    return newConnections;
  }
  
  /**
   * Get connection groups
   */
  getConnectionGroups(): string[] {
    const connections = this.getConnections();
    const groups = new Set<string>();
    
    connections.forEach(conn => {
      if (conn.group) {
        groups.add(conn.group);
      }
    });
    
    return Array.from(groups);
  }
  
  /**
   * Get connections by group
   */
  getConnectionsByGroup(): Record<string, SSHConnection[]> {
    const connections = this.getConnections();
    return connections.reduce((groups: Record<string, SSHConnection[]>, conn) => {
      const group = conn.group || 'Ungrouped';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(conn);
      return groups;
    }, {});
  }
}

export const connectionService = new ConnectionService();