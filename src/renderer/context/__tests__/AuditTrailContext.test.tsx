import React from 'react';
import { render, act } from '@testing-library/react';
import { AuditTrailProvider, useAuditTrail, AuditEventType } from '../AuditTrailContext';

// Test component that uses the AuditTrailContext
const TestComponent = () => {
  const { events, logEvent, clearEvents } = useAuditTrail();
  
  return (
    <div>
      <div data-testid="event-count">{events.length}</div>
      <button
        data-testid="log-event"
        onClick={() => logEvent('document_add' as AuditEventType, { path: 'test-path.pdf' })}
      >
        Log Event
      </button>
      <button
        data-testid="clear-events"
        onClick={() => clearEvents()}
      >
        Clear Events
      </button>
    </div>
  );
};

describe('AuditTrailContext', () => {
  // Mock localStorage before each test
  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(null);
    jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {});
    jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('provides audit trail state and actions', () => {
    const { getByTestId } = render(
      <AuditTrailProvider>
        <TestComponent />
      </AuditTrailProvider>
    );

    // Initially there should be no events
    expect(getByTestId('event-count').textContent).toBe('0');

    // Log an event
    act(() => {
      getByTestId('log-event').click();
    });
    expect(getByTestId('event-count').textContent).toBe('1');

    // Clear events
    act(() => {
      getByTestId('clear-events').click();
    });
    expect(getByTestId('event-count').textContent).toBe('0');
  });

  test('throws error when used outside provider', () => {
    // Suppress error output for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    expect(() => render(<TestComponent />)).toThrow(
      'useAuditTrail must be used within an AuditTrailProvider'
    );

    // Restore console.error
    console.error = originalConsoleError;
  });
}); 