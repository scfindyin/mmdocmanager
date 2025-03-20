import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define document types
export type DocumentType = 'FILE' | 'SEPARATOR' | 'NOTE' | 'IMAGE' | 'SECTION';

export interface Document {
  id: string;
  name: string;
  type: string;
  path: string;
  documentType: DocumentType;
  content?: string;
  metadata?: {
    layout?: string;
    files?: string[];
    [key: string]: any;
  };
}

interface DocumentContextType {
  documents: Document[];
  addDocuments: (files: string[], afterIndex?: number) => void;
  addNote: (content: string, afterIndex?: number) => void;
  addSection: (title: string, afterIndex?: number) => void;
  addImages: (files: string[], layout: string, afterIndex?: number) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  reorderDocuments: (startIndex: number, endIndex: number) => void;
  addSeparator: (afterIndex?: number) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

const getFileType = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase() || '';
  
  // Map common extensions to more readable types
  const typeMap: {[key: string]: string} = {
    'pdf': 'PDF',
    'doc': 'DOC',
    'docx': 'DOCX',
    'xls': 'XLS',
    'xlsx': 'XLSX',
    'jpg': 'JPG',
    'jpeg': 'JPEG',
    'png': 'PNG',
    'gif': 'GIF',
    'txt': 'TXT'
  };

  return typeMap[extension] || extension.toUpperCase() || 'Unknown';
};

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const addDocuments = useCallback((filePaths: string[], afterIndex?: number) => {
    const newDocuments = filePaths.map(path => {
      // Extract filename from path
      const name = path.split('\\').pop() || path.split('/').pop() || 'Unknown';
      
      return {
        id: uuidv4(),
        name,
        type: getFileType(path),
        path,
        documentType: 'FILE' as DocumentType,
      };
    });

    setDocuments(prev => {
      if (typeof afterIndex === 'number') {
        const copy = [...prev];
        copy.splice(afterIndex + 1, 0, ...newDocuments);
        return copy;
      }
      return [...prev, ...newDocuments];
    });
  }, []);

  const addNote = useCallback((content: string, afterIndex?: number) => {
    const newNote: Document = {
      id: uuidv4(),
      name: 'Note',
      type: 'NOTE',
      path: '',
      documentType: 'NOTE',
      content,
    };

    setDocuments(prev => {
      if (typeof afterIndex === 'number') {
        const copy = [...prev];
        copy.splice(afterIndex + 1, 0, newNote);
        return copy;
      }
      return [...prev, newNote];
    });
  }, []);

  const addSection = useCallback((title: string, afterIndex?: number) => {
    const newSection: Document = {
      id: uuidv4(),
      name: title,
      type: 'SECTION',
      path: '',
      documentType: 'SECTION',
    };

    setDocuments(prev => {
      if (typeof afterIndex === 'number') {
        const copy = [...prev];
        copy.splice(afterIndex + 1, 0, newSection);
        return copy;
      }
      return [...prev, newSection];
    });
  }, []);

  const addImages = useCallback((files: string[], layout: string, afterIndex?: number) => {
    const newImages = files.map(path => {
      const name = path.split('\\').pop() || path.split('/').pop() || 'Unknown';
      
      return {
        id: uuidv4(),
        name,
        type: getFileType(path),
        path,
        documentType: 'IMAGE' as DocumentType,
        metadata: {
          layout,
          files: [path],
        },
      };
    });

    setDocuments(prev => {
      if (typeof afterIndex === 'number') {
        const copy = [...prev];
        copy.splice(afterIndex + 1, 0, ...newImages);
        return copy;
      }
      return [...prev, ...newImages];
    });
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc)
    );
  }, []);

  const removeDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  }, []);

  const reorderDocuments = useCallback((startIndex: number, endIndex: number) => {
    setDocuments(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const addSeparator = useCallback((afterIndex?: number) => {
    const separator: Document = {
      id: uuidv4(),
      name: 'Separator',
      type: 'SEPARATOR',
      path: '',
      documentType: 'SEPARATOR',
    };
    
    setDocuments(prev => {
      if (typeof afterIndex === 'number') {
        const copy = [...prev];
        copy.splice(afterIndex + 1, 0, separator);
        return copy;
      }
      return [...prev, separator];
    });
  }, []);

  return (
    <DocumentContext.Provider value={{ 
      documents, 
      addDocuments, 
      addNote,
      addSection,
      addImages,
      updateDocument,
      removeDocument,
      reorderDocuments, 
      addSeparator 
    }}>
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