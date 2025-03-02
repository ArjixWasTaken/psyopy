import { useState, useCallback, useEffect } from 'react';
import { ContextMenuItem, ContextMenuType, SSHConnection, SSHIdentity, TabItem } from '../types';
import { Copy, Clipboard, Edit, Trash2, RefreshCw, Terminal, Plus, Scissors, X, Maximize2, Minimize2, FolderOpen } from 'lucide-react';

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  type: ContextMenuType | null;
  items: ContextMenuItem[];
  data?: any;
}

export const useContextMenu = (
  onConnect: (connection: SSHConnection) => void,
  onEdit: (connection: SSHConnection) => void,
  onDelete: (id: string) => void,
  onAddNew: () => void,
  onAddNewIdentity: () => void,
  onEditIdentity: (identity: SSHIdentity) => void,
  onDeleteIdentity: (id: string) => void,
  onCloseTab: (id: string) => void,
  onDuplicateTab: (id: string) => void,
  onToggleFullscreen: () => void,
  isFullscreen: boolean
) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    type: null,
    items: []
  });
  
  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);
  
  // Generate menu items based on type and data
  const generateMenuItems = useCallback((type: ContextMenuType, data: any): ContextMenuItem[] => {
    switch (type) {
      case 'connection':
        const connection = data as SSHConnection;
        return [
          {
            id: 'connect',
            label: 'Connect',
            icon: <Terminal className="h-4 w-4" />,
            onClick: () => onConnect(connection)
          },
          {
            id: 'edit',
            label: 'Edit Connection',
            icon: <Edit className="h-4 w-4" />,
            onClick: () => onEdit(connection)
          },
          {
            id: 'duplicate',
            label: 'Duplicate Connection',
            icon: <Copy className="h-4 w-4" />,
            onClick: () => {
              const newConnection = {
                ...connection,
                id: Date.now().toString(),
                name: `${connection.name} (Copy)`
              };
              onEdit(newConnection);
            }
          },
          {
            id: 'copy-host',
            label: 'Copy Host',
            icon: <Clipboard className="h-4 w-4" />,
            onClick: () => navigator.clipboard.writeText(connection.host),
            divider: true
          },
          {
            id: 'delete',
            label: 'Delete Connection',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => onDelete(connection.id)
          }
        ];
        
      case 'tab':
        const tab = data as TabItem;
        return [
          {
            id: 'close',
            label: 'Close Tab',
            icon: <X className="h-4 w-4" />,
            onClick: () => onCloseTab(tab.id)
          },
          {
            id: 'duplicate',
            label: 'Duplicate Tab',
            icon: <Copy className="h-4 w-4" />,
            onClick: () => onDuplicateTab(tab.id)
          },
          {
            id: 'close-others',
            label: 'Close Other Tabs',
            icon: <Scissors className="h-4 w-4" />,
            onClick: () => {
              // This would be implemented in the parent component
              console.log('Close other tabs');
            },
            divider: true
          },
          {
            id: 'fullscreen',
            label: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen',
            icon: isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />,
            onClick: onToggleFullscreen
          }
        ];
        
      case 'terminal':
        return [
          {
            id: 'copy',
            label: 'Copy',
            icon: <Copy className="h-4 w-4" />,
            onClick: () => {
              const selection = window.getSelection();
              if (selection) {
                navigator.clipboard.writeText(selection.toString());
              }
            }
          },
          {
            id: 'paste',
            label: 'Paste',
            icon: <Clipboard className="h-4 w-4" />,
            onClick: async () => {
              try {
                const text = await navigator.clipboard.readText();
                const activeElement = document.activeElement as HTMLInputElement;
                if (activeElement && activeElement.tagName === 'INPUT') {
                  const start = activeElement.selectionStart || 0;
                  const end = activeElement.selectionEnd || 0;
                  activeElement.value = 
                    activeElement.value.substring(0, start) + 
                    text + 
                    activeElement.value.substring(end);
                  activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
                }
              } catch (err) {
                console.error('Failed to read clipboard', err);
              }
            },
            divider: true
          },
          {
            id: 'clear',
            label: 'Clear Terminal',
            icon: <RefreshCw className="h-4 w-4" />,
            onClick: () => {
              // This would be implemented in the parent component
              console.log('Clear terminal');
            }
          },
          {
            id: 'fullscreen',
            label: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen',
            icon: isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />,
            onClick: onToggleFullscreen
          }
        ];
        
      case 'identity':
        const identity = data as SSHIdentity;
        return [
          {
            id: 'edit',
            label: 'Edit Identity',
            icon: <Edit className="h-4 w-4" />,
            onClick: () => onEditIdentity(identity)
          },
          {
            id: 'duplicate',
            label: 'Duplicate Identity',
            icon: <Copy className="h-4 w-4" />,
            onClick: () => {
              const newIdentity = {
                ...identity,
                id: Date.now().toString(),
                name: `${identity.name} (Copy)`
              };
              onEditIdentity(newIdentity);
            },
            divider: true
          },
          {
            id: 'delete',
            label: 'Delete Identity',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => onDeleteIdentity(identity.id)
          }
        ];
        
      case 'group':
        const group = data as string;
        return [
          {
            id: 'add-connection',
            label: 'Add Connection to Group',
            icon: <Plus className="h-4 w-4" />,
            onClick: () => {
              onAddNew();
              // The group would be pre-filled in the modal
              console.log(`Add connection to group: ${group}`);
            }
          },
          {
            id: 'rename',
            label: 'Rename Group',
            icon: <Edit className="h-4 w-4" />,
            onClick: () => {
              // This would be implemented in the parent component
              console.log(`Rename group: ${group}`);
            }
          },
          {
            id: 'open-folder',
            label: 'Open in File Explorer',
            icon: <FolderOpen className="h-4 w-4" />,
            onClick: () => {
              // This would be implemented in the parent component
              console.log(`Open folder: ${group}`);
            },
            divider: true
          },
          {
            id: 'delete-group',
            label: 'Delete Group',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => {
              // This would be implemented in the parent component
              console.log(`Delete group: ${group}`);
            }
          }
        ];
        
      default:
        return [];
    }
  }, [onConnect, onEdit, onDelete, onCloseTab, onDuplicateTab, onEditIdentity, onDeleteIdentity, onToggleFullscreen, isFullscreen, onAddNew]);
  
  // Show context menu
  const showContextMenu = useCallback((
    e: React.MouseEvent, 
    type: ContextMenuType, 
    data: any
  ) => {
    e.preventDefault();
    
    const items = generateMenuItems(type, data);
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type,
      items,
      data
    });
  }, [generateMenuItems]);
  
  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        closeContextMenu();
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [contextMenu.visible, closeContextMenu]);
  
  return {
    contextMenu,
    showContextMenu,
    closeContextMenu
  };
};