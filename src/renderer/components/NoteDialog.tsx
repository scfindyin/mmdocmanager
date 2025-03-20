import React, { useState } from 'react';
import { X } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface NoteDialogProps {
  onClose: () => void;
  onSave: (content: string) => void;
}

const NoteDialog: React.FC<NoteDialogProps> = ({ onClose, onSave }) => {
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-medium">Add Note</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="note-content">
              Note Content
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Enter your note here..."
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
              disabled={!content.trim()}
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDialog; 