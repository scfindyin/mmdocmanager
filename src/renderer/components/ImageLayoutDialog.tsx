import React, { useState } from 'react';
import { X, Image, Rows2, Rows3, Grid } from 'lucide-react';

interface ImageLayoutOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface ImageLayoutDialogProps {
  onClose: () => void;
  onSelectLayout: (layout: string, files: string[]) => void;
}

const ImageLayoutDialog: React.FC<ImageLayoutDialogProps> = ({ onClose, onSelectLayout }) => {
  const [selectedLayout, setSelectedLayout] = useState('single');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const layoutOptions: ImageLayoutOption[] = [
    {
      id: 'single',
      name: 'Single Image',
      icon: <Image className="text-primary" />,
      description: 'One image per page'
    },
    {
      id: 'stacked',
      name: 'Stacked Images',
      icon: <Rows2 className="text-primary" />,
      description: 'Two images stacked vertically'
    },
    {
      id: 'triple',
      name: 'Triple Stack',
      icon: <Rows3 className="text-primary" />,
      description: 'Three images stacked vertically'
    },
    {
      id: 'grid',
      name: 'Grid Layout',
      icon: <Grid className="text-primary" />,
      description: 'Four images in a 2x2 grid'
    }
  ];

  const handleSelectFiles = async () => {
    try {
      const files = await window.electron.selectFiles();
      if (files.length > 0) {
        setSelectedFiles(files);
      }
    } catch (error) {
      console.error('Error selecting files:', error);
    }
  };

  const handleConfirm = () => {
    if (selectedFiles.length > 0) {
      onSelectLayout(selectedLayout, selectedFiles);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-medium">Select Image Layout</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {layoutOptions.map(option => (
              <button
                key={option.id}
                className={`p-3 border rounded-md flex flex-col items-center gap-2 transition-colors
                  ${selectedLayout === option.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:bg-secondary/50'
                  }`}
                onClick={() => setSelectedLayout(option.id)}
              >
                {option.icon}
                <span className="font-medium">{option.name}</span>
                <span className="text-xs text-muted-foreground text-center">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Selected Images</h4>
            <div className="border border-border rounded-md p-3">
              {selectedFiles.length > 0 ? (
                <ul className="text-sm">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="truncate mb-1 last:mb-0">
                      {file.split('/').pop() || file.split('\\').pop()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No images selected</p>
              )}
            </div>
            <button
              onClick={handleSelectFiles}
              className="mt-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80"
            >
              Select Images
            </button>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              disabled={selectedFiles.length === 0}
            >
              Add Images
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLayoutDialog; 