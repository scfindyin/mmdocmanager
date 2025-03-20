import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import DocumentList from './components/DocumentList';
import Toolbar from './components/Toolbar';
import { DocumentProvider, useDocuments } from './context/DocumentContext';
import { ToastProvider } from './context/ToastContext';
import { useToast } from './context/ToastContext';
import { AuditTrailProvider } from './context/AuditTrailContext';

const AppContent: React.FC = () => {
  const { reorderDocuments, addDocuments } = useDocuments();
  const { showToast } = useToast();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    reorderDocuments(result.source.index, result.destination.index);
  };

  // Handle file dropping from file system
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);
    
    if (event.dataTransfer.files.length > 0) {
      try {
        // Convert FileList to array of paths
        const fileList = event.dataTransfer.files;
        const filePaths: string[] = [];
        
        // Collecting all local file paths from the drop event
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i] as any; // Use any to bypass TypeScript check
          if (file.path) { // Electron adds the path property to File objects
            filePaths.push(file.path);
          }
        }
        
        if (filePaths.length > 0) {
          // We're adding at the end of the list, so no specific afterIndex needed
          addDocuments(filePaths);
          showToast(`Added ${filePaths.length} document(s)`, 'success');
        }
      } catch (error) {
        console.error('Error handling dropped files:', error);
        showToast('Failed to add documents', 'error');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  return (
    <div 
      className="min-h-screen bg-background"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className={`container mx-auto p-4 min-h-screen transition-colors relative ${
        isDraggingOver ? 'bg-primary/10' : ''
      }`}>
        {isDraggingOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg border-2 border-dashed border-primary z-10">
            <div className="text-center p-6">
              <h3 className="text-xl font-medium text-primary">Drop Files to Add</h3>
              <p className="text-muted-foreground">Release to add documents to your project</p>
            </div>
          </div>
        )}
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Document Manager</h1>
        </header>
        
        <Toolbar />
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="document-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="mt-6"
              >
                <DocumentList />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuditTrailProvider>
      <ToastProvider>
        <DocumentProvider>
          <AppContent />
        </DocumentProvider>
      </ToastProvider>
    </AuditTrailProvider>
  );
};

export default App; 