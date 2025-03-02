import React, { useState, useRef } from 'react';
import { X, Plus, Maximize2, Minimize2 } from 'lucide-react';
import { TabItem, SSHConnection } from '../../types';

interface TabBarProps {
  tabs: TabItem[];
  connections: SSHConnection[];
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onAddTab: () => void;
  onTabContextMenu: (e: React.MouseEvent, tab: TabItem) => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  connections,
  onTabClick,
  onTabClose,
  onAddTab,
  onTabContextMenu,
  onToggleFullscreen,
  isFullscreen
}) => {
  const [draggingTab, setDraggingTab] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Get connection details for a tab
  const getConnectionForTab = (tab: TabItem) => {
    return connections.find(conn => conn.id === tab.connectionId);
  };
  
  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tabId: string) => {
    setDraggingTab(tabId);
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    e.dataTransfer.setData('text/plain', tabId);
    
    // Set ghost drag image
    const draggedTab = e.currentTarget;
    if (draggedTab) {
      const rect = draggedTab.getBoundingClientRect();
      const ghostElement = document.createElement('div');
      ghostElement.style.width = `${rect.width}px`;
      ghostElement.style.height = `${rect.height}px`;
      ghostElement.style.backgroundColor = 'rgba(59, 130, 246, 0.5)';
      ghostElement.style.position = 'absolute';
      ghostElement.style.top = '-1000px';
      document.body.appendChild(ghostElement);
      
      e.dataTransfer.setDragImage(ghostElement, rect.width / 2, rect.height / 2);
      
      setTimeout(() => {
        document.body.removeChild(ghostElement);
      }, 0);
    }
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetTabId: string) => {
    e.preventDefault();
    
    if (!draggingTab || draggingTab === targetTabId) {
      return;
    }
    
    // Find indices
    const draggedIndex = tabs.findIndex(tab => tab.id === draggingTab);
    const targetIndex = tabs.findIndex(tab => tab.id === targetTabId);
    
    // Reorder tabs
    const newTabs = [...tabs];
    const [draggedTab] = newTabs.splice(draggedIndex, 1);
    newTabs.splice(targetIndex, 0, draggedTab);
    
    // Update tabs state
    // This would be handled by the parent component
    // onReorderTabs(newTabs);
    
    setDraggingTab(null);
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDraggingTab(null);
  };
  
  return (
    <div className="flex items-center bg-gray-800 border-b border-gray-700">
      <div 
        ref={tabsRef}
        className="flex-1 flex items-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {tabs.map(tab => {
          const connection = getConnectionForTab(tab);
          return (
            <div
              key={tab.id}
              className={`flex items-center min-w-[150px] max-w-[200px] h-9 px-3 border-r border-gray-700 cursor-pointer select-none ${
                tab.active ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-750'
              }`}
              onClick={() => onTabClick(tab.id)}
              onContextMenu={(e) => onTabContextMenu(e, tab)}
              draggable
              onDragStart={(e) => handleDragStart(e, tab.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, tab.id)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex-1 flex items-center overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
                <div className="truncate text-sm">
                  {connection ? connection.name : 'Terminal'}
                </div>
              </div>
              <button
                className="ml-2 p-1 rounded-sm hover:bg-gray-600 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center px-2">
        <button
          className="p-1.5 rounded hover:bg-gray-700"
          onClick={onAddTab}
          title="New tab"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-700 ml-1"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TabBar;