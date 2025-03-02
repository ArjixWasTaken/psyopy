import { useState } from 'react';
import { SSHConnection } from '../types';

export const useSearch = (connections: SSHConnection[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Production': true,
    'Development': true,
    'Staging': true
  });
  
  // Group connections by their group property
  const groupedConnections = connections.reduce((groups: Record<string, SSHConnection[]>, conn) => {
    const group = conn.group || 'Ungrouped';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(conn);
    return groups;
  }, {});
  
  // Filter connections based on search term
  const filteredGroups = Object.entries(groupedConnections).reduce(
    (acc: Record<string, SSHConnection[]>, [group, conns]) => {
      const filtered = conns.filter(conn => 
        conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filtered.length > 0) {
        acc[group] = filtered;
      }
      
      return acc;
    }, 
    {}
  );
  
  const toggleGroup = (group: string) => {
    setExpandedGroups({
      ...expandedGroups,
      [group]: !expandedGroups[group]
    });
  };
  
  return {
    searchTerm,
    setSearchTerm,
    expandedGroups,
    filteredGroups,
    toggleGroup
  };
};