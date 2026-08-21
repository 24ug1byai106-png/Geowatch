import React, { useState } from 'react';
import { Mail, X, Send, AlertTriangle, Download, CheckCircle, FileText } from 'lucide-react';
import type { GovernmentAlert } from '../types';
import { generateGovernmentPdfReport } from '../utils/pdfGenerator';

interface EmailShareModalProps {
  alert: GovernmentAlert;
  isOpen: boolean;
  onClose: () => void;
  onLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export const EmailShareModal: React.FC<EmailShareModalProps> = ({
  alert,
  isOpen,
  onClose,
  onLog
}) => {
  const [recipient, setRecipient] = useState<string>('planning.directorate@bbmp.gov.in');
  const [cc, setCc] = useState<string>('field.verification@karnataka.gov.in');
  const [subject, setSubject] = useState<string>(`Hydra Positioning System — Geospatial Change Alert ${alert.id}`);
  const [message, setMessage] = useState<string>(
`Dear Sir/Madam,

Hydra Positioning System has detected a potential geospatial change requiring review within the monitored area (${alert.aoiName} — ${alert.location}).

Alert ID: ${alert.id}
Classification: ${alert.category}
Affected Footprint: ${alert.affectedAreaSqm.toLocaleString()} m²
Confidence: ${alert.confidence}%
Severity: ${alert.severity}
Status: ${alert.status}

Please find the attached satellite-based change detection report for your reference and field verification.

Regards,
Hydra Positioning System
Satellite Intelligence & Civic Alert Network`
  );

  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendError(null);
    setSendSuccess(false);

    try {
      // Check backend email endpoint
      const response = await fetch('http://localhost:8000/api/v1/alerts/email-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert_id: alert.id,
          recipient,
          cc,
          subject,
          message
        })
      });

      if (!response.ok) {
        throw new Error('SMTP service unconfigured');
      }

      setSendSuccess(true);
      onLog(`Email successfully dispatched for Alert ${alert.id} to ${recipient}`, 'success');
    } catch {
      // Safe fallback when backend SMTP is unconfigured
      setSendError('Email service is not configured on the backend server. Use DOWNLOAD PDF as the guaranteed fallback to manually dispatch this dossier.');
      onLog(`SMTP service unconfigured. Fallback to direct PDF download for ${alert.id}.`, 'warn');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadFallbackPdf = async () => {
    const { pdfBlob, filename } = await generateGovernmentPdfReport(alert);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onLog(`Downloaded PDF dossier: ${filename}`, 'success');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="hud-panel" style={{
        width: '100%',
        maxWidth: '620px',
        background: '#0a0f1a',
        border: '1.5px solid var(--accent-amber)',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div className="hud-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={16} color="var(--accent-amber)" />
            <span>DISPATCH GOVERNMENT ALERT // {alert.id}</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSendEmail} style={{ padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {sendError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #ef4444',
              padding: '10px 14px',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                <AlertTriangle size={15} />
                <span>SMTP SERVICE UNCONFIGURED</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                {sendError}
              </p>
              <button
                type="button"
                onClick={handleDownloadFallbackPdf}
                style={{
                  alignSelf: 'flex-start',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  borderRadius: '2px'
                }}
              >
                <Download size={13} />
                <span>DOWNLOAD PDF DOSSIER (GUARANTEED FALLBACK)</span>
              </button>
            </div>
          )}

          {sendSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid #10b981',
              padding: '10px 14px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#10b981',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <CheckCircle size={16} />
              <span>Dossier successfully transmitted to official government inbox.</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '4px' }}>
              RECIPIENT OFFICIAL INBOX:
            </label>
            <input
              type="email"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{
                width: '100%',
                background: '#07090e',
                border: '1px solid var(--border-dim)',
                color: '#fff',
                padding: '8px 10px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '4px' }}>
              CC INBOX (OPTIONAL):
            </label>
            <input
              type="email"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              style={{
                width: '100%',
                background: '#07090e',
                border: '1px solid var(--border-dim)',
                color: '#fff',
                padding: '8px 10px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '4px' }}>
              SUBJECT LINE:
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                background: '#07090e',
                border: '1px solid var(--border-dim)',
                color: '#fff',
                padding: '8px 10px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '4px' }}>
              FORMAL TRANSMITTAL MEMO:
            </label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                background: '#07090e',
                border: '1px solid var(--border-dim)',
                color: '#fff',
                padding: '8px 10px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1.4,
                resize: 'vertical'
              }}
            />
          </div>

          {/* Attached Document Pill */}
          <div style={{
            background: 'rgba(0, 240, 255, 0.06)',
            border: '1px dashed #00f0ff',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#00f0ff' }}>
              <FileText size={15} />
              <span>ATTACHMENT: Hydra_Positioning_System_Alert_{alert.id}.pdf (6 Pages)</span>
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Auto-Generated</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-dim)',
                color: 'var(--text-dim)',
                padding: '8px 16px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer'
              }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSending}
              style={{
                background: 'var(--accent-amber)',
                color: '#07090e',
                border: 'none',
                padding: '8px 18px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                cursor: isSending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={14} />
              <span>{isSending ? 'DISPATCHING...' : 'DISPATCH EMAIL'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
