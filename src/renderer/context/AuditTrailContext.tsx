import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Define types for audit events
export type AuditEventType = 
  | 'document_add' 
  | 'document_open' 
  | 'document_remove' 
  | 'document_reorder'
  | 'note_add'
  | 'note_edit'
  | 'note_remove'
  | 'section_add'
  | 'section_edit'
  | 'section_remove'
  | 'image_add'
  | 'separator_add'
  | 'pdf_generate'
  | 'project_save'
  | 'project_load'
  | 'error';

export interface AuditEvent {
  id: string;
  timestamp: string;
  type: AuditEventType;
  details: any;
  user?: string;
}

interface AuditTrailContextType {
  events: AuditEvent[];
  logEvent: (type: AuditEventType, details: any) => void;
  clearEvents: () => void;
  getEventsByType: (type: AuditEventType) => AuditEvent[];
  getRecentEvents: (count: number) => AuditEvent[];
}

const AuditTrailContext = createContext<AuditTrailContextType | undefined>(undefined);

// Maximum number of events to keep in memory
const MAX_EVENTS = 1000;

export const AuditTrailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<AuditEvent[]>([]);

  // Load events from localStorage on component mount
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem('auditTrail');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }
    } catch (err) {
      console.error('Failed to load audit trail:', err);
    }
  }, []);

  // Save events to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('auditTrail', JSON.stringify(events.slice(-MAX_EVENTS)));
    } catch (err) {
      console.error('Failed to save audit trail:', err);
    }
  }, [events]);

  const logEvent = useCallback((type: AuditEventType, details: any) => {
    const newEvent: AuditEvent = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
      timestamp: new Date().toISOString(),
      type,
      details,
    };

    // Add to state
    setEvents(prev => {
      // Maintain a maximum number of events to prevent memory issues
      const updatedEvents = [...prev, newEvent];
      if (updatedEvents.length > MAX_EVENTS) {
        return updatedEvents.slice(-MAX_EVENTS);
      }
      return updatedEvents;
    });

    // Log to console in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Audit] ${type}:`, details);
    }
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
    localStorage.removeItem('auditTrail');
  }, []);

  const getEventsByType = useCallback((type: AuditEventType) => {
    return events.filter(event => event.type === type);
  }, [events]);

  const getRecentEvents = useCallback((count: number) => {
    return events.slice(-count);
  }, [events]);

  return (
    <AuditTrailContext.Provider value={{
      events,
      logEvent,
      clearEvents,
      getEventsByType,
      getRecentEvents,
    }}>
      {children}
    </AuditTrailContext.Provider>
  );
};

export const useAuditTrail = () => {
  const context = useContext(AuditTrailContext);
  if (context === undefined) {
    throw new Error('useAuditTrail must be used within an AuditTrailProvider');
  }
  return context;
}; 