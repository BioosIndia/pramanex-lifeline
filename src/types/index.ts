export type ShortageStatus =
  | 'SHORTAGE_DECLARED'
  | 'SUPPLY_DISRUPTION'
  | 'RESOLVED'
  | 'MONITOR'
  | 'CONFLICTING_SOURCES';

export type LifecycleState =
  | 'OPEN'
  | 'STALE'
  | 'CONFLICT'
  | 'RESOLVED'
  | 'HOLD';

export type FreshnessStatus =
  | 'FRESH'
  | 'SYNC_DUE'
  | 'STALE'
  | 'SOURCE_FAILED';

export type JurisdictionCode = 'US' | 'EU' | 'UK' | 'CA' | 'AU';

export type UserRole =
  | 'consumer'
  | 'pharmacist'
  | 'mah_regulatory'
  | 'supply_analyst'
  | 'admin';

export type ExportFormatType = 'AUDIT_PDF' | 'JSON' | 'CSV' | 'FHIR_JSON' | 'XML_GAZETTE';

export interface MedicinePresentation {
  id: string;
  strength: string;
  dosageForm: string;
  route: string;
  packSize: string;
  nationalIdentifier?: string; // NDC, DIN, etc.
  manufacturer: string;
  status: ShortageStatus;
}

export interface ShortageEvent {
  id: string;
  medicineId: string;
  genericName: string; // Real generic chemical name
  brandName: string; // Brand trade names
  activeSubstances: string[]; // Active Pharmaceutical Ingredient (API)
  atcCode: string; // WHO ATC code
  presentation: string;
  dosageForm: string;
  jurisdiction: JurisdictionCode;
  authority: string; // FDA, EMA, MHRA, Health Canada, TGA
  status: ShortageStatus;
  lifecycleState: LifecycleState;
  reportedCause: string;
  reportedDuration?: string;
  affectedPresentationsCount: number;
  freshnessStatus: FreshnessStatus;
  expectedCadenceHours: number;
  sourcePublishedAt: string;
  lastRetrievedAt: string;
  sourceUrl: string;
  snapshotHash: string;
  mitigationNotice?: string; // Authority published mitigation ONLY
  hasCrossSourceConflict?: boolean;
  notes?: string;
  officialBulletinRef?: string;
  rawSignalFallback?: string;
}

export interface SourceHealthRecord {
  id: string;
  authorityName: string;
  jurisdiction: JurisdictionCode;
  feedType: 'REST API' | 'Official RSS' | 'Structured Portal' | 'Gazette Notice';
  cadenceHours: number;
  lastPublishedUpdate: string;
  lastSuccessfulRetrieval: string;
  uptimePct: number;
  health: 'HEALTHY' | 'DELAYED' | 'DOWN';
  activeEventsCount: number;
  latestSnapshotHash: string;
  endpointUrl: string;
}

export interface SourceConflict {
  id: string;
  eventId: string;
  medicineName: string;
  presentation: string;
  authorities: {
    authority: string;
    jurisdiction: JurisdictionCode;
    status: ShortageStatus;
    publishedAt: string;
    sourceUrl: string;
  }[];
  discrepancyType: 'STATUS_DIVERGENCE' | 'TIMELINE_GAP' | 'PRESENTATION_MISMATCH';
  triageStatus: 'PENDING_REVIEW' | 'RECONCILED' | 'SPLIT_MAINTAINED';
  assignedTo?: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  medicineId: string;
  genericName: string;
  brandName: string;
  jurisdiction: JurisdictionCode;
  currentStatus: ShortageStatus;
  notifyEmail: boolean;
  notifyInApp: boolean;
  addedAt: string;
  lastAlertAt?: string;
}

export interface TriageReview {
  id: string;
  eventId: string;
  medicineName: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  decision: 'APPROVE_RECONCILIATION' | 'MAINTAIN_SPLIT' | 'REQUEST_MANUAL_PULL' | 'ESCALATE';
  rationale: string;
  timestamp: string;
  evidenceSnapshotHash: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  evidenceHash: string;
  details: string;
}

export interface DependencyNode {
  id: string;
  label: string;
  category: 'MEDICINE' | 'PRESENTATION' | 'MANUFACTURER' | 'API_SITE' | 'MARKET';
  status?: ShortageStatus;
  details: string;
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  organization?: string;
  jurisdictionPreference?: JurisdictionCode;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  evidenceSources?: {
    authority: string;
    jurisdiction: string;
    status: string;
    publishedDate: string;
    sourceUrl?: string;
    snapshotHash?: string;
  }[];
  limitations?: string;
}

// New Real-time Collaborative Annotation
export interface CollaborativeAnnotation {
  id: string;
  eventId: string;
  medicineName: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  visibility: 'CLINICAL_INTERNAL' | 'HOSPITAL_WIDE' | 'MAH_CONFIDENTIAL';
  tags: string[];
  createdAt: string;
  status: 'OPEN' | 'RESOLVED';
  replies?: {
    id: string;
    authorName: string;
    authorRole: string;
    content: string;
    createdAt: string;
  }[];
}

// Official Sovereign Government Notice / Gazette
export interface OfficialBulletin {
  id: string;
  authority: string;
  jurisdiction: JurisdictionCode;
  gazetteNumber: string;
  title: string;
  publishedDate: string;
  summary: string;
  fullLegalText: string;
  verifiedSourceUrl: string;
  sha256Hash: string;
  classification: 'EMERGENCY_DISCRETION' | 'SAP_IMPORT_PERMIT' | 'SECTION_19A' | 'DISRUPTION_ALERT' | 'RESOLVED_GAZETTE';
}

// Real-Time Ingestion Cadence & Tracking Telemetry
export interface LiveCadenceTelemetry {
  nextIngestionSeconds: number;
  lastCycleMs: number;
  activeSurveillanceRuns: number;
  totalObservations24h: number;
  unresolvedDiscrepancies: number;
  liveWorkerStatus: 'SYNCHRONIZING' | 'RESTING_ON_CADENCE' | 'PROCESSING_SNAPSHOT';
}
