import React from 'react';
import ContextMenu from '../components/ContextMenu/ContextMenu';
import { ContextMenuItem } from '../types';

interface ContextMenuContainerProps {
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
  };
  onClose: () => void;
}

const ContextMenuContainer: React.FC<ContextMenuContainerProps> = ({
  contextMenu,
  onClose
}) => {
  return (
    <>
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default ContextMenuContainer;