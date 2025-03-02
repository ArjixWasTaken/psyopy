import React, { useEffect, useRef } from 'react';
import { ContextMenuItem } from '../../types';
import * as LucideIcons from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Adjust position if menu would go off screen
  const adjustedPosition = () => {
    if (!menuRef.current) return { x, y };
    
    const menuRect = menuRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let adjustedX = x;
    let adjustedY = y;
    
    // Adjust horizontal position
    if (x + menuRect.width > windowWidth) {
      adjustedX = windowWidth - menuRect.width - 5;
    }
    
    // Adjust vertical position
    if (y + menuRect.height > windowHeight) {
      adjustedY = windowHeight - menuRect.height - 5;
    }
    
    return { x: adjustedX, y: adjustedY };
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);
  
  // Handle menu item click
  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      onClose();
    }
  };
  
  const position = adjustedPosition();
  
  // Render icon based on icon name
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="h-4 w-4" />;
    }
    return null;
  };
  
  return (
    <div 
      ref={menuRef}
      className="fixed z-50 bg-gray-800 rounded-md shadow-lg border border-gray-700 py-1 min-w-[180px]"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        animation: 'fadeIn 0.1s ease-out'
      }}
    >
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <div
            className={`px-4 py-2 flex items-center text-sm ${
              item.disabled 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-white hover:bg-gray-700 cursor-pointer'
            }`}
            onClick={() => handleItemClick(item)}
          >
            {typeof item.icon === 'string' && (
              <span className="mr-2">{renderIcon(item.icon)}</span>
            )}
            {item.label}
          </div>
          {item.divider && <div className="border-t border-gray-700 my-1"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ContextMenu;