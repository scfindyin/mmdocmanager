import React from 'react';
import { render, act } from '@testing-library/react';
import { DocumentProvider, useDocuments } from '../DocumentContext';

// Test component that uses the DocumentContext
const TestComponent = () => {
  const { documents, addDocuments, addNote, addSection, addSeparator } = useDocuments();
  
  return (
    <div>
      <div data-testid="document-count">{documents.length}</div>
      <button
        data-testid="add-document"
        onClick={() => addDocuments(['test-path.pdf'])}
      >
        Add Document
      </button>
      <button
        data-testid="add-note"
        onClick={() => addNote('Test note content')}
      >
        Add Note
      </button>
      <button
        data-testid="add-section"
        onClick={() => addSection('Test Section')}
      >
        Add Section
      </button>
      <button
        data-testid="add-separator"
        onClick={() => addSeparator()}
      >
        Add Separator
      </button>
    </div>
  );
};

describe('DocumentContext', () => {
  test('provides document state and actions', () => {
    const { getByTestId } = render(
      <DocumentProvider>
        <TestComponent />
      </DocumentProvider>
    );

    // Initially there should be no documents
    expect(getByTestId('document-count').textContent).toBe('0');

    // Add a document
    act(() => {
      getByTestId('add-document').click();
    });
    expect(getByTestId('document-count').textContent).toBe('1');

    // Add a note
    act(() => {
      getByTestId('add-note').click();
    });
    expect(getByTestId('document-count').textContent).toBe('2');

    // Add a section
    act(() => {
      getByTestId('add-section').click();
    });
    expect(getByTestId('document-count').textContent).toBe('3');

    // Add a separator
    act(() => {
      getByTestId('add-separator').click();
    });
    expect(getByTestId('document-count').textContent).toBe('4');
  });

  test('throws error when used outside provider', () => {
    // Suppress error output for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    expect(() => render(<TestComponent />)).toThrow(
      'useDocuments must be used within a DocumentProvider'
    );

    // Restore console.error
    console.error = originalConsoleError;
  });
}); 