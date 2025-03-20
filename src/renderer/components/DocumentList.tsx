import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useDocuments, Document, DocumentType } from '../context/DocumentContext';
import { useToast } from '../context/ToastContext';
import { FileText, Minus, FileSpreadsheet, Image, File, Plus, Heading, GripVertical, Eye, Trash2 } from 'lucide-react';
import SeparatorMenu from './SeparatorMenu';
import ImageLayoutDialog from './ImageLayoutDialog';
import NoteDialog from './NoteDialog';
import SectionDialog from './SectionDialog';
import RichTextEditor from './RichTextEditor';

// Separator component that appears between documents
const Separator: React.FC<{ index: number }> = ({ index }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  
  const { showToast } = useToast();
  const { addDocuments, addNote, addSection, addImages } = useDocuments();

  const handlePlusClick = (e: React.MouseEvent) => {
    // Prevent event bubbling
    e.stopPropagation();
    
    // Calculate position for the menu
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom,
    });
    
    setMenuOpen(true);
  };

  const handleOptionSelected = async (option: string) => {
    switch (option) {
      case 'document':
        try {
          const files = await window.electron.selectFiles();
          if (files.length > 0) {
            addDocuments(files, index);
            showToast(`Added ${files.length} document(s)`, 'success');
          }
        } catch (error) {
          showToast('Failed to import documents', 'error');
        }
        break;
      case 'note':
        setNoteDialogOpen(true);
        break;
      case 'image':
        setImageDialogOpen(true);
        break;
      case 'section':
        setSectionDialogOpen(true);
        break;
    }
  };

  // Helper function to create a document from a file path
  const createFileDocument = (path: string): Document => {
    const name = path.split('\\').pop() || path.split('/').pop() || 'Unknown';
    return {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 9), // Generate a unique ID
      name,
      type: getFileTypeFromPath(path),
      path,
      documentType: 'FILE',
    };
  };

  // Helper function to get file type from path
  const getFileTypeFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase() || '';
    const typeMap: {[key: string]: string} = {
      'pdf': 'PDF', 'doc': 'DOC', 'docx': 'DOCX', 'xls': 'XLS', 'xlsx': 'XLSX',
      'jpg': 'JPG', 'jpeg': 'JPEG', 'png': 'PNG', 'gif': 'GIF', 'txt': 'TXT'
    };
    return typeMap[extension] || extension.toUpperCase() || 'Unknown';
  };

  const handleImageLayoutSelected = (layout: string, files: string[]) => {
    addImages(files, layout, index);
    showToast(`Added ${files.length} image(s) with ${layout} layout`, 'success');
  };

  const handleNoteAdded = (content: string) => {
    addNote(content, index);
    showToast('Note added', 'success');
  };

  const handleSectionAdded = (title: string) => {
    addSection(title, index);
    showToast('Section header added', 'success');
  };

  return (
    <div className="py-2 flex justify-center">
      <div className="w-full max-w-md flex items-center gap-2 p-1.5 rounded-md hover:bg-secondary/50 cursor-pointer group transition-colors">
        <div className="h-px flex-1 bg-border group-hover:bg-muted-foreground/50" />
        <button 
          className="p-1 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          onClick={handlePlusClick}
        >
          <Plus size={16} />
        </button>
        <div className="h-px flex-1 bg-border group-hover:bg-muted-foreground/50" />
      </div>
      
      {menuOpen && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setMenuOpen(false)}
          />
          
          <SeparatorMenu 
            position={menuPosition} 
            onClose={() => setMenuOpen(false)} 
            onSelectOption={handleOptionSelected} 
          />
        </>
      )}

      {imageDialogOpen && (
        <ImageLayoutDialog
          onClose={() => setImageDialogOpen(false)}
          onSelectLayout={handleImageLayoutSelected}
        />
      )}

      {noteDialogOpen && (
        <NoteDialog
          onClose={() => setNoteDialogOpen(false)}
          onSave={handleNoteAdded}
        />
      )}

      {sectionDialogOpen && (
        <SectionDialog
          onClose={() => setSectionDialogOpen(false)}
          onSave={handleSectionAdded}
        />
      )}
    </div>
  );
};

const DocumentList: React.FC = () => {
  const { documents, removeDocument } = useDocuments();
  const { showToast } = useToast();

  const handleOpenFile = async (path: string) => {
    if (path) {
      try {
        const result = await window.electron.openFile(path);
        if (!result.success) {
          showToast(result.error || 'Failed to open file', 'error');
        }
      } catch (error) {
        console.error('Error opening file:', error);
        showToast('An unexpected error occurred while opening the file', 'error');
      }
    }
  };

  const getFileIcon = (type: string, documentType: DocumentType) => {
    if (documentType === 'NOTE') {
      return <FileText className="text-yellow-500" size={20} />;
    }
    
    if (documentType === 'SECTION') {
      return <Heading className="text-indigo-500" size={20} />;
    }
    
    if (documentType === 'IMAGE') {
      return <Image className="text-purple-500" size={20} />;
    }
    
    const fileType = type.toLowerCase();
    
    switch(fileType) {
      case 'pdf':
        return <FileText className="text-red-500" size={20} />;
      case 'doc':
      case 'docx':
        return <FileText className="text-blue-500" size={20} />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="text-green-500" size={20} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="text-purple-500" size={20} />;
      case 'separator':
        return <Minus className="text-muted-foreground" size={20} />;
      default:
        return <File className="text-primary" size={20} />;
    }
  };

  const handleDeleteDocument = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeDocument(id);
    showToast(`Deleted ${name}`, 'success');
  };

  // If there are no documents, show an empty state with a separator
  if (documents.length === 0) {
    return (
      <div>
        <div className="text-center p-12 border border-dashed border-border rounded-lg text-muted-foreground bg-card/50 flex flex-col items-center gap-4">
          <File size={48} className="text-muted-foreground/50" />
          <div>
            <p className="font-medium">No documents added yet</p>
            <p className="text-sm">Import some files to get started</p>
          </div>
        </div>
        <Separator index={0} />
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Initial separator at the top */}
      <Separator index={0} />
      
      {/* Map through documents and add separators between them */}
      {documents.map((doc, index) => (
        <React.Fragment key={doc.id}>
          <Draggable draggableId={doc.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={`p-3 rounded-lg shadow-sm border border-border
                  ${snapshot.isDragging ? 'shadow-lg opacity-80' : ''}
                  ${doc.documentType === 'NOTE' ? 'bg-yellow-50/50 hover:bg-yellow-50' : 
                    doc.documentType === 'SECTION' ? 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-200' :
                    'bg-card hover:bg-accent/10'}`}
              >
                <div className="flex items-start">
                  <div 
                    {...provided.dragHandleProps}
                    className="mt-1 mr-2 p-1 rounded hover:bg-secondary/50 cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical size={16} className="text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1">
                    {doc.documentType === 'NOTE' ? (
                      <div>
                        <RichTextEditor 
                          content={doc.content || ''} 
                          onChange={() => {}} 
                          readOnly={true} 
                        />
                      </div>
                    ) : doc.documentType === 'SECTION' ? (
                      <div className="font-bold text-lg text-indigo-800">
                        {doc.name}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type, doc.documentType)}
                          <span className="text-foreground font-medium">{doc.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded font-mono">
                          {doc.type}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2 mt-2">
                      {doc.documentType === 'FILE' && (
                        <button
                          onClick={() => handleOpenFile(doc.path)}
                          className="p-1.5 rounded-full hover:bg-secondary/80 text-primary"
                          title="View Document"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteDocument(doc.id, doc.name, e)}
                        className="p-1.5 rounded-full hover:bg-red-100 text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Draggable>
          
          {/* Separator after each document */}
          <Separator index={index + 1} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default DocumentList; 