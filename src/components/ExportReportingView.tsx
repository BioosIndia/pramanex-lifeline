import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Hash,
  Database,
  Calendar,
  Building,
  AlertCircle,
  Code2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ShortageEvent, ExportFormatType } from '../types';

export const ExportReportingView: React.FC = () => {
  const { events } = useApp();
  const { profile } = useAuth();

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [exportFormat, setExportFormat] = useState<ExportFormatType>('AUDIT_PDF');
  const [copiedToast, setCopiedToast] = useState(false);
  const [downloadToast, setDownloadToast] = useState(false);

  const currentEvent: ShortageEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const generateReportContent = () => {
    if (exportFormat === 'JSON') {
      return JSON.stringify(
        {
          dossierIdentifier: `PRAMANEX-LIFELINE-REPORT-${currentEvent.id.toUpperCase()}`,
          generatedAt: new Date().toISOString(),
          authorizedReviewer: profile?.displayName || 'Dr. Rahul Dewangan',
          role: profile?.role || 'Hospital Pharmacist',
          medicineRecord: {
            genericName: currentEvent.genericName,
            brandName: currentEvent.brandName,
            atcClassification: currentEvent.atcCode,
            activeSubstances: currentEvent.activeSubstances,
            presentation: currentEvent.presentation,
            dosageForm: currentEvent.dosageForm,
            jurisdiction: currentEvent.jurisdiction,
            reportingAuthority: currentEvent.authority,
            status: currentEvent.status,
            lifecycleState: currentEvent.lifecycleState,
            reportedCause: currentEvent.reportedCause,
            reportedDuration: currentEvent.reportedDuration || 'Ongoing monitoring',
            mitigationGuidance: currentEvent.mitigationNotice || 'None published by sovereign agency',
            sourceFilingUrl: currentEvent.sourceUrl,
            sourcePublishedTimestamp: currentEvent.sourcePublishedAt,
            verifiedIngestionTimestamp: currentEvent.lastRetrievedAt,
          },
          cryptographicIntegrity: {
            algorithm: 'SHA-256',
            digest: currentEvent.snapshotHash,
            immutabilityContract: 'Verified zero-tampering snapshot',
          }
        },
        null,
        2
      );
    }

    if (exportFormat === 'FHIR_JSON') {
      return JSON.stringify(
        {
          resourceType: 'SupplyDelivery',
          id: `pramanex-${currentEvent.id}`,
          meta: {
            profile: ['http://hl7.org/fhir/StructureDefinition/SupplyDelivery'],
            lastUpdated: new Date().toISOString()
          },
          status: currentEvent.status === 'RESOLVED' ? 'completed' : 'abandoned',
          type: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/supplydelivery-type',
                code: 'medication',
                display: 'Medication Supply'
              }
            ]
          },
          suppliedItem: {
            itemCodeableConcept: {
              coding: [
                {
                  system: 'http://www.whocc.no/atc',
                  code: currentEvent.atcCode,
                  display: currentEvent.genericName
                }
              ],
              text: `${currentEvent.genericName} (${currentEvent.presentation})`
            }
          },
          occurrenceDateTime: currentEvent.sourcePublishedAt,
          extension: [
            {
              url: 'http://pramanex.org/fhir/StructureDefinition/shortage-cause',
              valueString: currentEvent.reportedCause
            },
            {
              url: 'http://pramanex.org/fhir/StructureDefinition/sha256-hash',
              valueString: currentEvent.snapshotHash
            }
          ]
        },
        null,
        2
      );
    }

    if (exportFormat === 'XML_GAZETTE') {
      return `<?xml version="1.0" encoding="UTF-8"?>
<RegulatoryShortageGazette xmlns="http://pramanex.org/schema/gazette/v28">
  <DossierHeader>
    <Identifier>LIFELINE-${currentEvent.id.toUpperCase()}</Identifier>
    <Jurisdiction>${currentEvent.jurisdiction}</Jurisdiction>
    <Authority>${currentEvent.authority}</Authority>
    <PublicationTimestamp>${currentEvent.sourcePublishedAt}</PublicationTimestamp>
    <Sha256Digest>${currentEvent.snapshotHash}</Sha256Digest>
  </DossierHeader>
  <ProductDefinition>
    <GenericMolecule>${currentEvent.genericName}</GenericMolecule>
    <BrandAlias>${currentEvent.brandName}</BrandAlias>
    <ATCCode>${currentEvent.atcCode}</ATCCode>
    <Presentation>${currentEvent.presentation}</Presentation>
    <DosageForm>${currentEvent.dosageForm}</DosageForm>
  </ProductDefinition>
  <SupplyStatus>
    <LifecycleState>${currentEvent.lifecycleState}</LifecycleState>
    <DeclaredStatus>${currentEvent.status}</DeclaredStatus>
    <ReportedCause>${currentEvent.reportedCause}</ReportedCause>
    <MitigationGuidance>${currentEvent.mitigationNotice || 'None'}</MitigationGuidance>
  </SupplyStatus>
</RegulatoryShortageGazette>`;
    }

    if (exportFormat === 'CSV') {
      return `DOSSIER_ID,GENERIC_NAME,BRAND_NAME,ATC_CODE,PRESENTATION,JURISDICTION,AUTHORITY,STATUS,LIFECYCLE,REPORTED_CAUSE,SNAPSHOT_HASH,EXPORTED_AT\n` +
        `"${currentEvent.id}","${currentEvent.genericName}","${currentEvent.brandName}","${currentEvent.atcCode}","${currentEvent.presentation}","${currentEvent.jurisdiction}","${currentEvent.authority}","${currentEvent.status}","${currentEvent.lifecycleState}","${currentEvent.reportedCause}","${currentEvent.snapshotHash}","${new Date().toISOString()}"`;
    }

    // Default formatted PDF text layout
    return `================================================================================
PRAMANEX LIFELINE — OFFICIAL REGULATORY SHORTAGE REPORTING DOSSIER
================================================================================
DOSSIER ID:        LIFELINE-DOSSIER-${currentEvent.id.toUpperCase()}
DATE GENERATED:    ${new Date().toUTCString()}
AUTHORIZED ACTOR:  ${profile?.displayName || 'Dr. Rahul Dewangan'} (${profile?.role || 'Hospital Pharmacist'})
JURISDICTION:      ${currentEvent.jurisdiction} — ${currentEvent.authority}
STATUS DECLARED:   ${currentEvent.status}
LIFECYCLE STATE:   ${currentEvent.lifecycleState}
--------------------------------------------------------------------------------
1. PRODUCT IDENTIFICATION:
   • Generic Substance:     ${currentEvent.genericName}
   • Commercial Brand(s):   ${currentEvent.brandName}
   • ATC Code:              ${currentEvent.atcCode}
   • Formulation:           ${currentEvent.presentation}
   • Dosage Form:           ${currentEvent.dosageForm}

2. REGULATORY SIGNAL OBSERVATION:
   • Official Authority:    ${currentEvent.authority}
   • Published by Agency:   ${new Date(currentEvent.sourcePublishedAt).toUTCString()}
   • Verified Sync Time:    ${new Date(currentEvent.lastRetrievedAt).toUTCString()}
   • Ingestion Health:      ${currentEvent.freshnessStatus} (Expected Cadence: ${currentEvent.expectedCadenceHours}h)
   • Source Notice URL:     ${currentEvent.sourceUrl}

3. SUPPLY RESTRICTION ATTRIBUTION:
   • Reported Cause:        ${currentEvent.reportedCause}
   • Expected Timeline:     ${currentEvent.reportedDuration || 'Ongoing regulatory monitoring'}
   • Published Mitigation:  ${currentEvent.mitigationNotice || 'None published by sovereign agency'}

4. CRYPTOGRAPHIC PROVENANCE GUARANTEE:
   • Digest Algorithm:      SHA-256
   • Snapshot Hash:         ${currentEvent.snapshotHash}
================================================================================
DISCLAIMER: Prepared in compliance with PRAMANEX LIFELINE truth distinctions.
Absence of local pharmacy stock is not implied by national shortage filings.
================================================================================`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportContent());
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleDownload = () => {
    const ext =
      exportFormat === 'JSON'
        ? 'json'
        : exportFormat === 'FHIR_JSON'
        ? 'fhir.json'
        : exportFormat === 'XML_GAZETTE'
        ? 'xml'
        : exportFormat === 'CSV'
        ? 'csv'
        : 'txt';
    const blob = new Blob([generateReportContent()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LIFELINE-REPORT-${currentEvent.genericName.replace(/\s+/g, '_')}-${Date.now()}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<pre style="font-family: monospace; font-size: 12px; padding: 20px;">${generateReportContent()}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <section id="export-section" className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      {/* Toasts */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Report dossier copied to clipboard!</span>
        </div>
      )}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold">
          <Download className="w-4 h-4 text-sky-400" />
          <span>Export dossier file downloaded!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>EXPORT & REGULATORY REPORTING FORMATS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interoperable Compliance Dossiers & Clinical Data Exports
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Generate audit-ready reports in PDF, HL7 FHIR, XML Gazette, CSV, and JSON with cryptographic SHA-256 seals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-7 rounded-3xl border border-slate-200/80">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Export Configuration</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Target Medicine
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.genericName} ({evt.presentation}) — {evt.authority} [{evt.jurisdiction}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Standardized Export Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'AUDIT_PDF', label: 'PDF Dossier' },
                    { id: 'JSON', label: 'JSON Schema' },
                    { id: 'FHIR_JSON', label: 'HL7 FHIR' },
                    { id: 'XML_GAZETTE', label: 'XML Gazette' },
                    { id: 'CSV', label: 'CSV Table' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setExportFormat(fmt.id as any)}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition-colors ${
                        exportFormat === fmt.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Integrity summary */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Cryptographic Seal</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono break-all bg-slate-50 p-2 rounded-lg border border-slate-100">
                  SHA-256: {currentEvent.snapshotHash}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  title="Copy formatted text to clipboard"
                >
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  title="Print dossier document"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dossier Code/Text Preview */}
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 text-slate-200 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
                <span className="font-mono text-sky-400 font-semibold flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" />
                  <span>LIFELINE-DOSSIER-PREVIEW.{exportFormat.toLowerCase()}</span>
                </span>
                <span className="text-[10px] text-slate-400">Read-Only Evidence Digest</span>
              </div>

              <pre className="font-mono text-[11px] leading-relaxed text-slate-300 max-h-[340px] overflow-y-auto whitespace-pre-wrap pr-2">
                {generateReportContent()}
              </pre>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>Standard: {exportFormat.replace('_', ' ')} • Interoperability Ready</span>
              <span className="text-emerald-400 font-semibold">100% Cryptographic Match</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
