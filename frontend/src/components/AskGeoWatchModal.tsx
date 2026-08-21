import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Loader2,
  HelpCircle
} from 'lucide-react';
import { GROQ_API_KEY } from '../utils/groqClient';
import type { PresetDataset } from '../types';

interface AskGeoWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: PresetDataset;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AskGeoWatchModal: React.FC<AskGeoWatchModalProps> = ({
  isOpen,
  onClose,
  dataset
}) => {
  const result = dataset.analysisResult;
  const audit = result?.governmentAudit;

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **GeoWatch AI**, your geospatial remote-sensing assistant. I have indexed the active analysis for **${dataset.name}** (${dataset.beforeYear} vs ${dataset.afterYear}). You can ask me about newly built structures, road network expansion, tree canopy loss, or municipal zoning risks.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = [
    "What are the major human-made changes?",
    "How many new buildings and roads were built?",
    "What is the estimated tree canopy loss?",
    "Are there any unauthorized encroachment risks?",
    "Summarize this analysis for government authorities."
  ];

  const handleSendMessage = async (queryText?: string) => {
    const text = (queryText || inputQuery).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Formulate Contextual Remote-Sensing Prompt for Groq AI
    const systemPrompt = `
You are GeoWatch AI, an authoritative, professional geospatial intelligence assistant for ISRO & SIH change detection.
Use STRICTLY the following calculated satellite change detection metrics for this analysis:

CURRENT ANALYSIS CONTEXT:
- AOI / Location: ${dataset.name} (${dataset.region})
- Observation Window: ${dataset.beforeYear} vs ${dataset.afterYear}
- Satellite Source: ${dataset.dataSource}
- Surface Area Modified: ${result?.changedAreaPercentage || 0}% (~${(result?.totalChangedSqMeters || 0).toLocaleString()} m²)
- Total Change Contours: ${result?.totalChangeRegions || 0}
- Potential Structural Shifts: ${result?.structuralCount || 0}
- Potential Vegetation Shifts: ${result?.vegetationCount || 0}
- High-Intensity Changes: ${result?.highIntensityCount || 0}
- Change Severity: ${result?.changeIntensityLabel || 'Moderate'}
- New Buildings Constructed: ~${audit?.newBuildingsConstructed || 0} units (~${(audit?.builtUpAreaSqm || 0).toLocaleString()} m²)
- Roads Expanded: +${audit?.roadExpansionKm || 0} km (~${(audit?.roadWidenedAreaSqm || 0).toLocaleString()} m²)
- Estimated Trees Felled: ~${audit?.treesFelledEstimated || 0} trees (~${(audit?.deforestedCanopySqm || 0).toLocaleString()} m² canopy loss)
- Zoning Compliance Score: ${audit?.zoningComplianceScore || 85}% (${audit?.unauthorizedEncroachmentsCount || 0} flagged zones)
- Actionable Directive: ${audit?.actionableRecommendation || 'Continuous monitoring advised.'}
- AI Summary: ${result?.aiSummary || 'Analysis completed.'}

INSTRUCTIONS:
- Answer accurately based ONLY on the metrics above.
- Be concise, professional, and clear for urban planners and government stakeholders.
- Format with markdown bolding or bullets where helpful.
`;

    try {
      const key = GROQ_API_KEY || (window as any).__GROQ_KEY__;
      let replyText = '';

      if (key) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.slice(-4).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
              { role: 'user', content: text }
            ],
            temperature: 0.25,
            max_tokens: 450
          })
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data.choices?.[0]?.message?.content?.trim();
        }
      }

      if (!replyText) {
        // High-fidelity fallback based on query keywords
        if (text.toLowerCase().includes('building') || text.toLowerCase().includes('structur')) {
          replyText = `Satellite differencing detected approximately **${audit?.newBuildingsConstructed || result?.structuralCount} new buildings/structures**, covering a built-up footprint of **~${(audit?.builtUpAreaSqm || 0).toLocaleString()} m²** with **${audit?.highDensityClusters || 0} high-density clusters**.`;
        } else if (text.toLowerCase().includes('road') || text.toLowerCase().includes('transport')) {
          replyText = `Transportation network analysis reveals **+${audit?.roadExpansionKm} km** of widened roads and arterial corridors, expanding the transit surface area by **~${(audit?.roadWidenedAreaSqm || 0).toLocaleString()} m²**.`;
        } else if (text.toLowerCase().includes('tree') || text.toLowerCase().includes('vegetation') || text.toLowerCase().includes('forest')) {
          replyText = `Ecological monitoring indicates an estimated **~${audit?.treesFelledEstimated?.toLocaleString()} trees felled** across **~${(audit?.deforestedCanopySqm || 0).toLocaleString()} m²** of cleared green canopy. A 1:10 compensatory replantation of **~${((audit?.treesFelledEstimated || 0) * 10).toLocaleString()} saplings** is mandated.`;
        } else {
          replyText = `Analysis of **${dataset.name}** across **${dataset.beforeYear} → ${dataset.afterYear}** identified **${result?.totalChangeRegions} change regions** over **${result?.changedAreaPercentage}%** of the AOI. Key drivers include **+${audit?.newBuildingsConstructed} new buildings**, **+${audit?.roadExpansionKm} km roads**, and **~${audit?.treesFelledEstimated} trees displaced**.`;
        }
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Analysis indicates **${result?.changedAreaPercentage}% surface modification** with **+${audit?.newBuildingsConstructed} buildings** and **+${audit?.roadExpansionKm} km roads expanded** in ${dataset.name}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2500,
      padding: '16px'
    }}>
      <div className="hud-panel" style={{
        width: '780px',
        maxWidth: '95vw',
        height: '620px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0, 240, 255, 0.4)',
        boxShadow: '0 0 25px rgba(0, 240, 255, 0.15)',
        background: '#090e17'
      }}>
        
        {/* Modal Header */}
        <div className="hud-header" style={{ justifyContent: 'space-between', padding: '12px 18px', borderBottom: '1px solid rgba(0, 240, 255, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              border: '1px solid #00f0ff',
              background: 'rgba(0, 240, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00f0ff'
            }}>
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                  ASK GEOWATCH AI ASSISTANT
                </span>
                <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: '#00f0ff', background: 'rgba(0,240,255,0.1)', padding: '1px 6px', border: '1px solid rgba(0,240,255,0.3)' }}>
                  GROQ LLAMA 3.3 70B
                </span>
              </div>
              <div style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginTop: '2px' }}>
                Active Dataset Context: <strong style={{ color: 'var(--accent-amber)' }}>{dataset.name}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Context Chips */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(11, 15, 22, 0.95)',
          borderBottom: '1px solid var(--border-dim)',
          overflowX: 'auto',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{ color: '#94a3b8', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HelpCircle size={12} /> SUGGESTED QUERIES:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              style={{
                background: 'rgba(0, 240, 255, 0.08)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                color: '#cbd5e1',
                padding: '3px 8px',
                fontSize: '0.65rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          fontFamily: 'var(--font-mono)'
        }}>
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '85%'
                }}
              >
                {isBot && (
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '2px',
                    background: 'rgba(0, 240, 255, 0.15)',
                    border: '1px solid #00f0ff',
                    color: '#00f0ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Bot size={15} />
                  </div>
                )}

                <div style={{
                  background: isBot ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 153, 0, 0.15)',
                  border: '1px solid ' + (isBot ? 'rgba(0, 240, 255, 0.25)' : 'var(--border-amber)'),
                  padding: '10px 14px',
                  borderRadius: '2px'
                }}>
                  <div style={{
                    fontSize: '0.78rem',
                    color: isBot ? '#f1f5f9' : '#ffffff',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {m.text}
                  </div>
                  <div style={{
                    fontSize: '0.58rem',
                    color: 'var(--text-dim)',
                    marginTop: '4px',
                    textAlign: isBot ? 'left' : 'right'
                  }}>
                    {m.timestamp}
                  </div>
                </div>

                {!isBot && (
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '2px',
                    background: 'rgba(255, 153, 0, 0.2)',
                    border: '1px solid var(--accent-amber)',
                    color: 'var(--accent-amber)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <User size={15} />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00f0ff', fontSize: '0.72rem' }}>
              <Loader2 size={14} className="animate-spin" />
              <span>GeoWatch AI is reasoning with multi-spectral change parameters...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Field Form */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-dim)',
          background: '#06080e',
          display: 'flex',
          gap: '10px'
        }}>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask anything about changes, buildings, roads, trees, or zoning..."
            style={{
              flex: 1,
              background: '#0b0f16',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#ffffff',
              padding: '8px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              outline: 'none'
            }}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isTyping}
            className="hud-btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '0.75rem',
              opacity: (!inputQuery.trim() || isTyping) ? 0.5 : 1,
              cursor: (!inputQuery.trim() || isTyping) ? 'not-allowed' : 'pointer'
            }}
          >
            <Send size={14} />
            <span>ASK</span>
          </button>
        </div>

      </div>
    </div>
  );
};
