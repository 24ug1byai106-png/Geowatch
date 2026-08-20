import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, ExternalLink } from 'lucide-react';

interface ApiEndpoint {
  method: 'GET' | 'POST';
  path: string;
  desc: string;
  requestBody?: string;
  responseBody: string;
  status: string;
  latency: string;
}

export const ApiConsoleView: React.FC = () => {
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const endpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/analysis',
      desc: 'Retrieve all historical change detection analysis jobs from PostgreSQL.',
      responseBody: JSON.stringify([
        {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          before_image_id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
          after_image_id: "8c9e6679-7425-40de-944b-e07fc1f90ae8",
          location_id: "9c9e6679-7425-40de-944b-e07fc1f90ae9",
          status: "COMPLETED",
          change_percentage: 14.8,
          explanation: "Major urban expansion detected in Sector 4.",
          created_at: "2026-08-20T10:00:00Z",
          completed_at: "2026-08-20T10:00:15Z"
        }
      ], null, 2),
      status: '200 OK',
      latency: '34ms'
    },
    {
      method: 'POST',
      path: '/api/v1/analysis',
      desc: 'Initiate asynchronous background change detection between two uploaded satellite images.',
      requestBody: JSON.stringify({
        before_image_id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        after_image_id: "8c9e6679-7425-40de-944b-e07fc1f90ae8",
        location_id: "9c9e6679-7425-40de-944b-e07fc1f90ae9"
      }, null, 2),
      responseBody: JSON.stringify({
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        status: "PROCESSING",
        created_at: "2026-08-20T10:00:00Z"
      }, null, 2),
      status: '202 ACCEPTED',
      latency: '52ms'
    },
    {
      method: 'GET',
      path: '/api/v1/analysis/{analysis_id}/map',
      desc: 'Fetch GeoJSON FeatureCollection with spatial polygon boundaries of detected changes.',
      responseBody: JSON.stringify({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [[[77.2, 28.62], [77.22, 28.625], [77.23, 28.605], [77.2, 28.62]]]
            },
            properties: {
              id: "poly-gw-024",
              object_type: "building",
              confidence: 0.964,
              area: 1284.5
            }
          }
        ]
      }, null, 2),
      status: '200 OK',
      latency: '28ms'
    },
    {
      method: 'GET',
      path: '/api/v1/analysis/{analysis_id}/explanation',
      desc: 'Retrieve AI generated natural language summary of detected human-made changes.',
      responseBody: JSON.stringify({
        explanation: "AI Vision analysis detected extensive human-made development in Sector 4. Significant conversion of green cover into newly paved transport corridors and 29 multi-story structures.",
        change_percentage: 14.8
      }, null, 2),
      status: '200 OK',
      latency: '18ms'
    },
    {
      method: 'GET',
      path: '/api/v1/reports/{analysis_id}',
      desc: 'Generate complete structured summary report of the change detection job.',
      responseBody: JSON.stringify({
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        status: "COMPLETED",
        change_percentage: 14.8,
        explanation: "Extensive building and road construction identified.",
        detected_changes: [
          { id: "c1", object_type: "building", confidence: 0.964, area: 1284.5 },
          { id: "c2", object_type: "vegetation", confidence: 0.912, area: 126000 }
        ]
      }, null, 2),
      status: '200 OK',
      latency: '42ms'
    },
    {
      method: 'GET',
      path: '/api/v1/timeline/{location_id}',
      desc: 'Get temporal evolution timeline of changes across multiple years for a location.',
      responseBody: JSON.stringify([
        { id: "job-2022", year: "2022", change_percentage: 4.2 },
        { id: "job-2024", year: "2024", change_percentage: 11.5 },
        { id: "job-2025", year: "2025", change_percentage: 18.4 }
      ], null, 2),
      status: '200 OK',
      latency: '36ms'
    }
  ];

  const currentEndpoint = endpoints[selectedEndpointIndex];

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(`http://localhost:8000${currentEndpoint.path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = () => {
    // simulated request execution
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner */}
      <div className="hud-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
            <Terminal size={14} />
            <span>RESTFUL API & CLIENT SDK INTEGRATION</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 0 0' }}>
            GEOWATCH API // SYSTEM INTEGRATION
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: '#10b981',
            fontWeight: 'bold'
          }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981' }} />
            API ONLINE (FASTAPI)
          </div>

          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="hud-btn-primary"
            style={{ fontSize: '0.72rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ExternalLink size={13} />
            SWAGGER DOCS
          </a>
        </div>
      </div>

      {/* Main Console Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', gap: '20px' }}>
        
        {/* Endpoints Sidebar */}
        <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="hud-header">
            <span className="led-amber" />
            <span>AVAILABLE ENDPOINTS</span>
          </div>

          <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {endpoints.map((ep, idx) => {
              const isSel = selectedEndpointIndex === idx;
              return (
                <div
                  key={ep.path + ep.method}
                  onClick={() => setSelectedEndpointIndex(idx)}
                  style={{
                    padding: '8px 10px',
                    background: isSel ? 'rgba(255, 153, 0, 0.15)' : 'transparent',
                    border: isSel ? '1px solid var(--accent-amber)' : '1px solid var(--border-dim)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 'bold',
                      padding: '1px 5px',
                      background: ep.method === 'GET' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: ep.method === 'GET' ? '#38bdf8' : '#10b981'
                    }}>
                      {ep.method}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: isSel ? '#fff' : 'var(--text-dim)', wordBreak: 'break-all' }}>
                      {ep.path}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Console Request & Response Viewer (Requirement #18) */}
        <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
          
          {/* Path & Copy bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '8px 12px',
            border: '1px solid var(--border-dim)',
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
              <span style={{ color: currentEndpoint.method === 'GET' ? '#38bdf8' : '#10b981', fontWeight: 'bold' }}>
                {currentEndpoint.method}
              </span>
              <span style={{ color: '#ffffff' }}>http://localhost:8000{currentEndpoint.path}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCopyEndpoint}
                className="hud-btn"
                style={{ fontSize: '0.68rem', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? 'COPIED' : 'COPY ENDPOINT'}</span>
              </button>

              <button
                onClick={handleExecute}
                className="hud-btn-primary"
                style={{ fontSize: '0.68rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Play size={12} />
                <span>SEND REQUEST</span>
              </button>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-sans)' }}>
            {currentEndpoint.desc}
          </p>

          {/* Request Body if POST */}
          {currentEndpoint.requestBody && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>REQUEST BODY (JSON)</div>
              <pre style={{
                margin: 0,
                padding: '10px',
                background: '#070a10',
                border: '1px solid var(--border-dim)',
                color: '#e2e8f0',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem'
              }}>
                <code>{currentEndpoint.requestBody}</code>
              </pre>
            </div>
          )}

          {/* Response Payload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--accent-amber)' }}>RESPONSE PAYLOAD</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span>STATUS: <strong style={{ color: '#10b981' }}>{currentEndpoint.status}</strong></span>
                <span>PROCESSING TIME: <strong style={{ color: 'var(--accent-amber)' }}>{currentEndpoint.latency}</strong></span>
              </div>
            </div>

            <pre style={{
              margin: 0,
              padding: '12px',
              background: '#070a10',
              border: '1px solid var(--border-dim)',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              overflowX: 'auto',
              maxHeight: '260px',
              lineHeight: 1.45
            }}>
              <code>{currentEndpoint.responseBody}</code>
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
