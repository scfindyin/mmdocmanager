import React from 'react';
import { Plus, Save, FileUp } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';

const Toolbar: React.FC = () => {
  const { addDocuments, addSeparator } = useDocuments();

  const handleImportFiles = async () => {
    try {
      const files = await window.electron.selectFiles();
      if (files.length > 0) {
        addDocuments(files);
      }
    } catch (error) {
      console.error('Error importing files:', error);
    }
  };

  const handleSaveProject = async () => {
    try {
      const projectData = {
        // TODO: Add project data
      };
      await window.electron.saveProject(projectData);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-secondary rounded-lg">
      <button
        onClick={handleImportFiles}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        <FileUp size={16} />
        Import Files
      </button>
      
      <button
        onClick={handleSaveProject}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        <Save size={16} />
        Save Project
      </button>
      
      <button
        onClick={addSeparator}
        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
      >
        <Plus size={16} />
        Add Separator
      </button>
    </div>
  );
};

export default Toolbar; 