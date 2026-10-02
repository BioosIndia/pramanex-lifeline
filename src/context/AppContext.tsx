import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import {
  ShortageEvent,
  SourceHealthRecord,
  SourceConflict,
  WatchlistItem,
  TriageReview,
  AuditEntry,
  JurisdictionCode
} from '../types';
import {
  INITIAL_SHORTAGE_EVENTS,
  INITIAL_SOURCE_HEALTH,
  INITIAL_CONFLICTS,
  INITIAL_AUDIT_LOGS
} from '../data/seedData';

interface AppContextType {
  events: ShortageEvent[];
  sourceHealth: SourceHealthRecord[];
  conflicts: SourceConflict[];
  watchlists: WatchlistItem[];
  auditLogs: AuditEntry[];
  selectedEvent: ShortageEvent | null;
  setSelectedEvent: (evt: ShortageEvent | null) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  isSearchGroundingOpen: boolean;
  setIsSearchGroundingOpen: (open: boolean) => void;
  searchFilter: string;
  setSearchFilter: (q: string) => void;
  selectedJurisdiction: JurisdictionCode | 'ALL';
  setSelectedJurisdiction: (j: JurisdictionCode | 'ALL') => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (s: string) => void;
  toggleWatchlist: (event: ShortageEvent) => Promise<boolean>;
  isWatched: (medicineId: string) => boolean;
  submitTriageReview: (
    eventId: string,
    decision: 'APPROVE_RECONCILIATION' | 'MAINTAIN_SPLIT' | 'REQUEST_MANUAL_PULL' | 'ESCALATE',
    rationale: string
  ) => Promise<void>;
  notifications: { id: string; title: string; message: string; timestamp: string; read: boolean }[];
  markNotificationRead: (id: string) => void;
  unreadNotificationsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, profile } = useAuth();
  const [events, setEvents] = useState<ShortageEvent[]>(INITIAL_SHORTAGE_EVENTS);
  const [sourceHealth] = useState<SourceHealthRecord[]>(INITIAL_SOURCE_HEALTH);
  const [conflicts, setConflicts] = useState<SourceConflict[]>(INITIAL_CONFLICTS);
  const [watchlists, setWatchlists] = useState<WatchlistItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [selectedEvent, setSelectedEvent] = useState<ShortageEvent | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSearchGroundingOpen, setIsSearchGroundingOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionCode | 'ALL'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'FDA Shortage Update: Amoxicillin',
      message: 'US FDA published a new status observation for Oral Suspension 250mg/5mL.',
      timestamp: '15 mins ago',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Discrepancy Alert: Cefepime 2g',
      message: 'Cross-source divergence flagged between US FDA and Health Canada.',
      timestamp: '45 mins ago',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Cadence Notice: Australian TGA',
      message: 'Scheduled 24h sync overdue by 60 mins. Background worker scheduled.',
      timestamp: '2 hours ago',
      read: true,
    }
  ]);

  // Sync Watchlist from Firestore if user logged in
  useEffect(() => {
    if (!currentUser) {
      // Local demo watchlist for guest
      setWatchlists([
        {
          id: 'watch-demo-1',
          userId: 'guest',
          medicineId: 'med-amox',
          genericName: 'Amoxicillin',
          brandName: 'Amoxil',
          jurisdiction: 'US',
          currentStatus: 'SHORTAGE_DECLARED',
          notifyEmail: true,
          notifyInApp: true,
          addedAt: new Date().toISOString(),
        }
      ]);
      return;
    }

    try {
      const watchlistCol = collection(db, 'users', currentUser.uid, 'watchlist');
      const unsubscribe = onSnapshot(
        watchlistCol,
        (snapshot) => {
          const items: WatchlistItem[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...(docSnap.data() as Omit<WatchlistItem, 'id'>) });
          });
          setWatchlists(items);
        },
        (err) => {
          console.warn('Watchlist listener warning:', err);
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn('Firestore subscription not available:', e);
    }
  }, [currentUser]);

  const isWatched = (medicineId: string) => {
    return watchlists.some((w) => w.medicineId === medicineId);
  };

  const toggleWatchlist = async (event: ShortageEvent): Promise<boolean> => {
    const existing = watchlists.find((w) => w.medicineId === event.medicineId);
    if (existing) {
      // Remove
      setWatchlists((prev) => prev.filter((w) => w.medicineId !== event.medicineId));
      if (currentUser) {
        try {
          await deleteDoc(doc(db, 'users', currentUser.uid, 'watchlist', existing.id));
        } catch (e) {
          console.warn('Failed deleting watchlist from firestore:', e);
        }
      }
      return false;
    } else {
      // Add
      const newItem: WatchlistItem = {
        id: `watch-${Date.now()}`,
        userId: currentUser?.uid || 'guest',
        medicineId: event.medicineId,
        genericName: event.genericName,
        brandName: event.brandName,
        jurisdiction: event.jurisdiction,
        currentStatus: event.status,
        notifyEmail: true,
        notifyInApp: true,
        addedAt: new Date().toISOString(),
      };
      setWatchlists((prev) => [...prev, newItem]);
      if (currentUser) {
        try {
          await setDoc(doc(db, 'users', currentUser.uid, 'watchlist', newItem.id), newItem);
        } catch (e) {
          console.warn('Failed saving watchlist to firestore:', e);
        }
      }
      return true;
    }
  };

  const submitTriageReview = async (
    eventId: string,
    decision: 'APPROVE_RECONCILIATION' | 'MAINTAIN_SPLIT' | 'REQUEST_MANUAL_PULL' | 'ESCALATE',
    rationale: string
  ) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const reviewRecord: TriageReview = {
      id: `rev-${Date.now()}`,
      eventId,
      medicineName: targetEvent.genericName,
      reviewerId: currentUser?.uid || 'reviewer-session',
      reviewerName: profile?.displayName || 'Senior Regulatory Reviewer',
      reviewerRole: profile?.role || 'mah_regulatory',
      decision,
      rationale,
      timestamp: new Date().toISOString(),
      evidenceSnapshotHash: targetEvent.snapshotHash,
    };

    // Add audit entry
    const auditRecord: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: profile?.displayName || 'Reviewer',
      role: profile?.role || 'Clinical Reviewer',
      action: `TRIAGE_${decision}`,
      resource: `${targetEvent.genericName} (${targetEvent.presentation})`,
      evidenceHash: targetEvent.snapshotHash,
      details: rationale,
    };

    setAuditLogs((prev) => [auditRecord, ...prev]);

    // Update conflict status if present
    setConflicts((prev) =>
      prev.map((c) =>
        c.eventId === eventId
          ? {
              ...c,
              triageStatus: decision === 'APPROVE_RECONCILIATION' ? 'RECONCILED' : 'SPLIT_MAINTAINED',
              assignedTo: profile?.displayName || 'Assigned Reviewer'
            }
          : c
      )
    );

    // Save to Firestore if available
    try {
      await addDoc(collection(db, 'triage_reviews'), reviewRecord);
    } catch (e) {
      console.warn('Firestore review write warning:', e);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        events,
        sourceHealth,
        conflicts,
        watchlists,
        auditLogs,
        selectedEvent,
        setSelectedEvent,
        isAssistantOpen,
        setIsAssistantOpen,
        isSearchGroundingOpen,
        setIsSearchGroundingOpen,
        searchFilter,
        setSearchFilter,
        selectedJurisdiction,
        setSelectedJurisdiction,
        selectedStatusFilter,
        setSelectedStatusFilter,
        toggleWatchlist,
        isWatched,
        submitTriageReview,
        notifications,
        markNotificationRead,
        unreadNotificationsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
