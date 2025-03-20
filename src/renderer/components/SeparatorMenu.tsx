import React, { useState } from 'react';
import { FileUp, FileText, Image, Heading, X } from 'lucide-react';

interface SeparatorMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

const SeparatorMenu: React.FC<SeparatorMenuProps> = ({ position, onClose, onSelectOption }) => {
  const options = [
    { id: 'document', label: 'Add Document', icon: <FileUp size={16} /> },
    { id: 'note', label: 'Add Note', icon: <FileText size={16} /> },
    { id: 'image', label: 'Add Image', icon: <Image size={16} /> },
    { id: 'section', label: 'Add Section Header', icon: <Heading size={16} /> },
  ];

  const handleOptionClick = (optionId: string) => {
    onSelectOption(optionId);
    onClose();
  };

  return (
    <div
      className="fixed z-50 bg-white shadow-lg rounded-md border border-border overflow-hidden"
      style={{
        top: position.y,
        left: position.x,
        transform: 'translate(-50%, 10px)',
      }}
    >
      <div className="flex items-center justify-between px-2 py-1 border-b border-border bg-secondary/50">
        <span className="text-sm font-medium">Insert</span>
        <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full">
          <X size={14} />
        </button>
      </div>
      <div className="p-1">
        {options.map((option) => (
          <button
            key={option.id}
            className="flex items-center gap-2 w-full text-left p-2 text-sm rounded-md hover:bg-accent/10 transition-colors"
            onClick={() => handleOptionClick(option.id)}
          >
            <span className="text-primary">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeparatorMenu; 