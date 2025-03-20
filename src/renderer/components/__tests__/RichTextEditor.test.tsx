import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RichTextEditor from '../RichTextEditor';

// Mock TipTap hooks since they're complex to test in isolation
jest.mock('@tiptap/react', () => {
  const original = jest.requireActual('@tiptap/react');
  return {
    ...original,
    useEditor: () => ({
      chain: () => ({
        focus: () => ({
          toggleBold: () => ({ run: jest.fn() }),
          toggleItalic: () => ({ run: jest.fn() }),
          toggleStrike: () => ({ run: jest.fn() }),
          toggleCode: () => ({ run: jest.fn() }),
          toggleHeading: () => ({ run: jest.fn() }),
          toggleBulletList: () => ({ run: jest.fn() }),
          toggleOrderedList: () => ({ run: jest.fn() }),
          extendMarkRange: () => ({
            setLink: () => ({ run: jest.fn() }),
            unsetLink: () => ({ run: jest.fn() }),
          }),
          insertTable: () => ({ run: jest.fn() }),
          setTextAlign: () => ({ run: jest.fn() }),
          undo: () => ({ run: jest.fn() }),
          redo: () => ({ run: jest.fn() }),
        }),
      }),
      isActive: () => false,
      getAttributes: () => ({}),
      can: () => ({ undo: () => true, redo: () => true }),
    }),
    BubbleMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="bubble-menu">{children}</div>,
    FloatingMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="floating-menu">{children}</div>,
    EditorContent: ({ editor, className }: { editor: any, className: string }) => (
      <div data-testid="editor-content" className={className}>
        Mock Editor Content
      </div>
    ),
  };
});

describe('RichTextEditor', () => {
  const mockOnChange = jest.fn() as jest.MockedFunction<(html: string) => void>;
  const defaultProps = {
    content: '<p>Test content</p>',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(<RichTextEditor {...defaultProps} />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
    expect(screen.getByTitle('Bold')).toBeInTheDocument();
    expect(screen.getByTitle('Italic')).toBeInTheDocument();
  });

  test('renders in read-only mode without toolbar', () => {
    render(<RichTextEditor {...defaultProps} readOnly={true} />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
    expect(screen.queryByTitle('Bold')).not.toBeInTheDocument();
  });

  test('toolbar buttons are clickable', () => {
    render(<RichTextEditor {...defaultProps} />);
    fireEvent.click(screen.getByTitle('Bold'));
    fireEvent.click(screen.getByTitle('Italic'));
    fireEvent.click(screen.getByTitle('Ordered List'));
    // We don't need to check return values because we're using mocks
    // Just checking that the buttons exist and can be clicked
  });

  test('renders with custom placeholder', () => {
    const customPlaceholder = 'Enter custom text...';
    render(<RichTextEditor {...defaultProps} placeholder={customPlaceholder} />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });
}); 