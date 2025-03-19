import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import DocumentList from './components/DocumentList';
import Toolbar from './components/Toolbar';
import { DocumentProvider, useDocuments } from './context/DocumentContext';

const AppContent: React.FC = () => {
  const { reorderDocuments } = useDocuments();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    reorderDocuments(result.source.index, result.destination.index);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
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
    <DocumentProvider>
      <AppContent />
    </DocumentProvider>
  );
};

export default App; 