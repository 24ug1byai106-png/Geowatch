import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Eye, 
  Search, 
  Sparkles
} from 'lucide-react';
import type { GovernmentAlert, GovernmentAlertStatus, PresetDataset } from '../types';

interface GovernmentMonitoringViewProps {
  alerts: GovernmentAlert[];
  dataset: PresetDataset;
  onSelectAlert: (alert: GovernmentAlert) => void;
  onOpenAskAi: () => void;
  onLog?: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export const GovernmentMonitoringView: React.FC<GovernmentMonitoringViewProps> = ({
  alerts,
  dataset,
  onSelectAlert,
  onOpenAskAi
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter alerts
  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = 
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // KPI Metrics
  const totalCount = alerts.length;
  const highPriorityCount = alerts.filter(a => a.severity === 'HIGH').length;
  const fieldVerificationCount = alerts.filter(a => a.status === 'FIELD VERIFICATION REQUIRED' || a.status === 'NEW').length;
  const resolvedCount = alerts.filter(a => a.status === 'VERIFIED' || a.status === 'RESOLVED').length;
  const totalAffectedArea = alerts.reduce((acc, a) => acc + a.affectedAreaSqm, 0);

  const getStatusColor = (status: GovernmentAlertStatus) => {
    switch (status) {
      case 'FIELD VERIFICATION REQUIRED': return '#ff9900';
      case 'UNDER REVIEW': return '#38bdf8';
      case 'VERIFIED': return '#10b981';
      case 'RESOLVED': return '#22c55e';
      case 'DISMISSED': return '#94a3b8';
      default: return '#f59e0b';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
      
      {/* Top Banner */}
      <div className="hud-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
            <ShieldAlert size={16} />
            <span>HYDRA POSITIONING SYSTEM // SATELLITE SURVEILLANCE & CIVIC ALERT DISPATCH</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 0 0' }}>
            CIVIC MONITORING & GOVERNMENT ALERTS // {dataset.name.toUpperCase()}
          </h2>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
            Satellite-Based Change Observation & Civic Infrastructure Verification Queue
          </div>
        </div>

        <button
          onClick={onOpenAskAi}
          style={{
            background: 'rgba(0, 240, 255, 0.12)',
            border: '1px solid #00f0ff',
            color: '#00f0ff',
            padding: '7px 14px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            borderRadius: '2px'
          }}
        >
          <Sparkles size={14} />
          <span>QUERY HYDRA AI ON ALERTS</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        
        {/* Card 1: Total Active Alerts */}
        <div className="hud-panel" style={{ padding: '14px 18px', borderLeft: '3px solid var(--accent-amber)' }}>
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            TOTAL MONITORED ALERTS
          </div>
          <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-tech)', color: '#fff', margin: '4px 0' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.62rem', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
            {totalAffectedArea.toLocaleString()} m² Total Area Monitored
          </div>
        </div>

        {/* Card 2: High Priority */}
        <div className="hud-panel" style={{ padding: '14px 18px', borderLeft: '3px solid #ef4444' }}>
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            HIGH PRIORITY ALERTS
          </div>
          <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-tech)', color: '#ef4444', margin: '4px 0' }}>
            {highPriorityCount}
          </div>
          <div style={{ fontSize: '0.62rem', color: '#f87171', fontFamily: 'var(--font-mono)' }}>
            Require Immediate Zonal Inspection
          </div>
        </div>

        {/* Card 3: Field Verification Required */}
        <div className="hud-panel" style={{ padding: '14px 18px', borderLeft: '3px solid #ff9900' }}>
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            FIELD VERIFICATION REQUIRED
          </div>
          <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-tech)', color: '#ff9900', margin: '4px 0' }}>
            {fieldVerificationCount}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Awaiting Ground Revenue Officers
          </div>
        </div>

        {/* Card 4: Verified / Resolved */}
        <div className="hud-panel" style={{ padding: '14px 18px', borderLeft: '3px solid #10b981' }}>
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            VERIFIED / RESOLVED
          </div>
          <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-tech)', color: '#10b981', margin: '4px 0' }}>
            {resolvedCount}
          </div>
          <div style={{ fontSize: '0.62rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
            Audit Complete & Action Taken
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="hud-panel" style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#07090e', border: '1px solid var(--border-dim)', padding: '6px 10px', width: '280px' }}>
            <Search size={14} color="var(--text-dim)" />
            <input
              type="text"
              placeholder="Search by ID, category, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                marginLeft: '8px',
                width: '100%',
                outline: 'none'
              }}
            />
          </div>

          {/* Status Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginRight: '4px' }}>STATUS:</span>
            {['all', 'NEW', 'UNDER REVIEW', 'FIELD VERIFICATION REQUIRED', 'VERIFIED', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                style={{
                  background: selectedStatus === st ? 'var(--accent-amber)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedStatus === st ? '#07090e' : 'var(--text-dim)',
                  border: '1px solid ' + (selectedStatus === st ? 'var(--accent-amber)' : 'var(--border-dim)'),
                  padding: '3px 8px',
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: selectedStatus === st ? 800 : 500,
                  cursor: 'pointer',
                  borderRadius: '2px'
                }}
              >
                {st}
              </button>
            ))}
          </div>

        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid var(--border-dim)', paddingTop: '8px' }}>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', alignSelf: 'center', marginRight: '4px' }}>CATEGORY:</span>
          {[
            { id: 'all', label: 'ALL CATEGORIES' },
            { id: 'Potential Unauthorized Construction', label: '🏢 UNAUTHORIZED CONSTRUCTION' },
            { id: 'Potential Road Expansion', label: '🛣️ ROAD EXPANSION' },
            { id: 'Vegetation Clearing', label: '🌳 VEGETATION CLEARING' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: selectedCategory === cat.id ? '#00f0ff' : 'var(--text-dim)',
                border: '1px solid ' + (selectedCategory === cat.id ? '#00f0ff' : 'var(--border-dim)'),
                padding: '2px 8px',
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: selectedCategory === cat.id ? 700 : 400,
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Alerts Table / Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredAlerts.length === 0 ? (
          <div className="hud-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            No government monitoring alerts match your active filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="hud-panel"
              style={{
                padding: '14px 18px',
                display: 'grid',
                gridTemplateColumns: 'minmax(140px, 1.2fr) minmax(200px, 2fr) minmax(140px, 1.2fr) minmax(130px, 1fr) minmax(130px, 1fr) auto',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 0.15s ease',
                borderLeft: `3px solid ${alert.severity === 'HIGH' ? '#ef4444' : '#ff9900'}`
              }}
            >
              
              {/* Col 1: ID & Date */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#00f0ff', fontWeight: 'bold' }}>
                  {alert.id}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {alert.beforeDate} ➔ {alert.afterDate}
                </div>
              </div>

              {/* Col 2: Category & Description */}
              <div>
                <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-tech)', color: '#fff', fontWeight: 'bold' }}>
                  {alert.category}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {alert.description}
                </div>
              </div>

              {/* Col 3: Footprint & Confidence */}
              <div>
                <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#fff' }}>
                  <strong>{alert.affectedAreaSqm.toLocaleString()} m²</strong>
                </div>
                <div style={{ fontSize: '0.62rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  Confidence: {alert.confidence}%
                </div>
              </div>

              {/* Col 4: Severity Badge */}
              <div>
                <span style={{
                  background: alert.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(234, 179, 8, 0.18)',
                  border: `1px solid ${alert.severity === 'HIGH' ? '#ef4444' : '#eab308'}`,
                  color: alert.severity === 'HIGH' ? '#ef4444' : '#eab308',
                  padding: '2px 7px',
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 'bold',
                  borderRadius: '2px'
                }}>
                  {alert.severity} PRIORITY
                </span>
              </div>

              {/* Col 5: Status Badge */}
              <div>
                <span style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: `1px solid ${getStatusColor(alert.status)}`,
                  color: getStatusColor(alert.status),
                  padding: '2px 7px',
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 'bold',
                  borderRadius: '2px'
                }}>
                  {alert.status}
                </span>
              </div>

              {/* Col 6: Action Button */}
              <div>
                <button
                  onClick={() => onSelectAlert(alert)}
                  style={{
                    background: 'var(--accent-amber)',
                    color: '#07090e',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '2px'
                  }}
                >
                  <Eye size={13} />
                  <span>INSPECT</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
