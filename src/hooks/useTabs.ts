import { useState, useCallback } from 'react';
import { TabItem, SSHConnection } from '../types';

export const useTabs = () => {
  const [tabs, setTabs] = useState<TabItem[]>([]);
  
  // Open a new tab for a connection
  const openTab = useCallback((connection: SSHConnection) => {
    const tabId = `tab-${Date.now()}`;
    
    // Deactivate all existing tabs
    const updatedTabs = tabs.map(tab => ({
      ...tab,
      active: false
    }));
    
    // Add new tab
    const newTab: TabItem = {
      id: tabId,
      connectionId: connection.id,
      title: connection.name,
      active: true
    };
    
    setTabs([...updatedTabs, newTab]);
    return tabId;
  }, [tabs]);
  
  // Activate a specific tab
  const activateTab = useCallback((tabId: string) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      active: tab.id === tabId
    })));
  }, [tabs]);
  
  // Close a tab
  const closeTab = useCallback((tabId: string) => {
    // Get the tab to be closed
    const tabToClose = tabs.find(tab => tab.id === tabId);
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    
    // Remove the tab
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    // If the closed tab was active, activate another tab
    if (tabToClose?.active && newTabs.length > 0) {
      // Try to activate the tab to the left, or the first tab if it was the first one
      const newActiveIndex = Math.max(0, tabIndex - 1);
      newTabs[newActiveIndex].active = true;
    }
    
    setTabs(newTabs);
  }, [tabs]);
  
  // Reorder tabs by drag and drop
  const reorderTabs = useCallback((startIndex: number, endIndex: number) => {
    const result = Array.from(tabs);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    setTabs(result);
  }, [tabs]);
  
  // Get the active tab
  const activeTab = tabs.find(tab => tab.active);
  
  return {
    tabs,
    activeTab,
    openTab,
    activateTab,
    closeTab,
    reorderTabs
  };
};