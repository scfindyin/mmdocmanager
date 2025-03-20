import React, { useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Table as TableIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  PilcrowSquare,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start typing here...',
  readOnly = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline decoration-primary cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const insertTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  return (
    <div className="border border-border rounded-md overflow-hidden">
      {!readOnly && (
        <div className="flex flex-wrap gap-1 p-2 bg-secondary/30 border-b border-border">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded ${editor.isActive('bold') ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded ${editor.isActive('italic') ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1 rounded ${editor.isActive('strike') ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1 rounded ${editor.isActive('code') ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Code"
          >
            <Code size={16} />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Ordered List"
          >
            <ListOrdered size={16} />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            onClick={addLink}
            className={`p-1 rounded ${editor.isActive('link') ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Add Link"
          >
            <LinkIcon size={16} />
          </button>
          <button
            onClick={insertTable}
            className={`p-1 rounded hover:bg-secondary/80`}
            title="Insert Table"
          >
            <TableIcon size={16} />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-1 rounded hover:bg-secondary/80"
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-1 rounded hover:bg-secondary/80"
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo size={16} />
          </button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 focus:outline-none min-h-[200px]"
      />

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex bg-background shadow-lg rounded-md border border-border p-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded ${editor.isActive('bold') ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            >
              <Bold size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded ${editor.isActive('italic') ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            >
              <Italic size={14} />
            </button>
            <button
              onClick={addLink}
              className={`p-1 rounded ${editor.isActive('link') ? 'bg-secondary' : 'hover:bg-secondary/80'}`}
            >
              <LinkIcon size={14} />
            </button>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
};

export default RichTextEditor; 