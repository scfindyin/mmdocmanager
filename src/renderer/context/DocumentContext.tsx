import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Document {
  id: string;
  name: string;
  type: string;
  path: string;
}

interface DocumentContextType {
  documents: Document[];
  addDocuments: (files: string[]) => void;
  reorderDocuments: (startIndex: number, endIndex: number) => void;
  addSeparator: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const addDocuments = useCallback((filePaths: string[]) => {
    const newDocuments = filePaths.map(path => ({
      id: uuidv4(),
      name: path.split('\\').pop() || path.split('/').pop() || 'Unknown',
      type: path.split('.').pop()?.toUpperCase() || 'Unknown',
      path,
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
  }, []);

  const reorderDocuments = useCallback((startIndex: number, endIndex: number) => {
    setDocuments(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const addSeparator = useCallback(() => {
    const separator: Document = {
      id: uuidv4(),
      name: 'Separator',
      type: 'SEPARATOR',
      path: '',
    };
    setDocuments(prev => [...prev, separator]);
  }, []);

  return (
    <DocumentContext.Provider value={{ documents, addDocuments, reorderDocuments, addSeparator }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}; 