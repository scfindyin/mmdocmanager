import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SectionDialogProps {
  onClose: () => void;
  onSave: (title: string) => void;
}

const SectionDialog: React.FC<SectionDialogProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');

  const handleSave = () => {
    if (title.trim()) {
      onSave(title);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-medium">Add Section Header</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="section-title">
              Section Title
            </label>
            <input
              id="section-title"
              type="text"
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter section title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              disabled={!title.trim()}
            >
              Add Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionDialog; 