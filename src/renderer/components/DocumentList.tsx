import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useDocuments } from '../context/DocumentContext';
import { FileText, Minus } from 'lucide-react';

const DocumentList: React.FC = () => {
  const { documents } = useDocuments();

  const handleOpenFile = async (path: string) => {
    if (path) {
      try {
        await window.electron.openFile(path);
      } catch (error) {
        console.error('Error opening file:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {documents.map((doc, index) => (
        <Draggable key={doc.id} draggableId={doc.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`p-4 rounded-lg shadow-sm border border-border ${
                doc.type === 'SEPARATOR' 
                  ? 'bg-secondary/50' 
                  : 'bg-card hover:bg-accent/10 cursor-pointer'
              }`}
              onClick={() => doc.type !== 'SEPARATOR' && handleOpenFile(doc.path)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {doc.type === 'SEPARATOR' ? (
                    <Minus className="text-muted-foreground" size={20} />
                  ) : (
                    <FileText className="text-primary" size={20} />
                  )}
                  <span className="text-foreground">{doc.name}</span>
                </div>
                {doc.type !== 'SEPARATOR' && (
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
                    {doc.type}
                  </span>
                )}
              </div>
            </div>
          )}
        </Draggable>
      ))}
      {documents.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          No documents added yet. Import some files to get started.
        </div>
      )}
    </div>
  );
};

export default DocumentList; 