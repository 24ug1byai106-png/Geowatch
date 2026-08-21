import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface LandingHeroLoginProps {
  onLoginSuccess: (email: string) => void;
}

export const LandingHeroLogin: React.FC<LandingHeroLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('officer.bengaluru@isro.gov.in');
  const [password, setPassword] = useState<string>('Hydra@2026!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Real-time password restriction validation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isPasswordValid = hasMinLength && hasNumber && hasUppercase && hasSpecialChar;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isEmailValid) {
      setErrorMessage('Please enter a valid official municipal / departmental email address.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Password must satisfy all security restrictions (8+ chars, number, uppercase, special symbol).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(email);
    }, 600);
  };

  const handleQuickDemoFill = () => {
    setEmail('officer.bengaluru@isro.gov.in');
    setPassword('Hydra@2026!');
    setErrorMessage('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#040711',
      zIndex: 9999
    }}>
      
      {/* Background Satellite Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center right',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <source src="/videos/hydra-hero.mp4" type="video/mp4" />
      </video>

      {/* Subtle Readability Dark Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(4, 7, 17, 0.94) 0%, rgba(4, 7, 17, 0.82) 48%, rgba(4, 7, 17, 0.45) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Main Grid Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '1240px',
        padding: '24px 32px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.25fr) minmax(360px, 440px)',
        gap: '48px',
        alignItems: 'center'
      }}>
        
        {/* LEFT COLUMN: HERO CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Brand Lockup */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src="/hydra_logo.png" 
              alt="Hydra Positioning System Logo" 
              style={{ 
                width: '54px', 
                height: '54px', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 14px rgba(0, 240, 255, 0.45))',
                background: 'rgba(6, 10, 20, 0.85)',
                padding: '4px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 240, 255, 0.35)'
              }} 
            />
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#00f0ff',
                letterSpacing: '0.12em'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                <span>OFFICIAL SATELLITE SURVEILLANCE PORTAL</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 'bold' }}>
                ISRO / SENTINEL MULTI-TEMPORAL EARTH OBSERVATION
              </div>
            </div>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '3.2rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            color: '#ffffff',
            lineHeight: 1.05,
            margin: 0,
            textTransform: 'uppercase'
          }}>
            HYDRA POSITIONING<br />SYSTEM
          </h1>

          <h2 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--accent-amber)',
            margin: 0,
            letterSpacing: '0.03em'
          }}>
            Satellite Intelligence for a Changing Earth
          </h2>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.02rem',
            color: '#cbd5e1',
            lineHeight: 1.55,
            margin: 0,
            maxWidth: '560px',
            borderLeft: '2px solid #00f0ff',
            paddingLeft: '14px'
          }}>
            Monitor satellite imagery, detect meaningful human-made changes, and generate actionable geospatial alerts for municipal urban planning and environmental enforcement.
          </p>

          {/* Quick Metrics Ticker */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginTop: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem'
          }}>
            <div style={{ borderLeft: '1px solid rgba(0, 240, 255, 0.3)', paddingLeft: '10px' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.62rem' }}>SENTINEL-2B GSD</div>
              <div style={{ color: '#00f0ff', fontWeight: 800 }}>10.0m MSI Multi-Spectral</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255, 153, 0, 0.3)', paddingLeft: '10px' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.62rem' }}>AI CORE</div>
              <div style={{ color: 'var(--accent-amber)', fontWeight: 800 }}>Groq Llama 3.3 70B</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(16, 185, 129, 0.3)', paddingLeft: '10px' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.62rem' }}>GEO ENGINE</div>
              <div style={{ color: '#10b981', fontWeight: 800 }}>PostGIS + GDAL Tile Engine</div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: OFFICIAL LOGIN PORTAL */}
        <div style={{
          background: 'rgba(8, 12, 22, 0.92)',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 240, 255, 0.1)',
          borderRadius: '4px',
          padding: '28px',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          
          {/* Form Header */}
          <div style={{ borderBottom: '1px solid rgba(0, 240, 255, 0.2)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={16} color="#00f0ff" />
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '1.05rem', fontWeight: 800, color: '#fff', letterSpacing: '0.06em' }}>
                  OFFICER ACCESS AUTHENTICATION
                </span>
              </div>
              <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: '#10b981', border: '1px solid #10b981', padding: '1px 6px', borderRadius: '2px' }}>
                SECURE SSL
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', margin: '4px 0 0 0' }}>
              Enter departmental credentials to access real-time geospatial intelligence dockets.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={12} color="#00f0ff" />
                <span>OFFICIAL EMAIL ADDRESS</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer.name@isro.gov.in"
                  required
                  style={{
                    width: '100%',
                    background: '#040711',
                    border: `1px solid ${email && isEmailValid ? '#10b981' : 'rgba(0, 240, 255, 0.3)'}`,
                    color: '#ffffff',
                    padding: '9px 12px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '2px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={12} color="var(--accent-amber)" />
                  <span>PASSWORD</span>
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>Strict Security Policy</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security password..."
                  required
                  style={{
                    width: '100%',
                    background: '#040711',
                    border: `1px solid ${password && isPasswordValid ? '#10b981' : 'rgba(0, 240, 255, 0.3)'}`,
                    color: '#ffffff',
                    padding: '9px 38px 9px 12px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '2px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Live Password Restrictions Matrix */}
            <div style={{
              background: 'rgba(4, 7, 17, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '8px 10px',
              borderRadius: '2px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: hasMinLength ? '#10b981' : 'var(--text-dim)' }}>
                {hasMinLength ? <Check size={11} color="#10b981" /> : <X size={11} color="#ef4444" />}
                <span>8+ Characters</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: hasNumber ? '#10b981' : 'var(--text-dim)' }}>
                {hasNumber ? <Check size={11} color="#10b981" /> : <X size={11} color="#ef4444" />}
                <span>Contains Number (0-9)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: hasUppercase ? '#10b981' : 'var(--text-dim)' }}>
                {hasUppercase ? <Check size={11} color="#10b981" /> : <X size={11} color="#ef4444" />}
                <span>Uppercase Letter (A-Z)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: hasSpecialChar ? '#10b981' : 'var(--text-dim)' }}>
                {hasSpecialChar ? <Check size={11} color="#10b981" /> : <X size={11} color="#ef4444" />}
                <span>Special Symbol (!@#$)</span>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#f87171',
                padding: '6px 10px',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <AlertCircle size={13} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: '#00f0ff',
                color: '#040711',
                border: 'none',
                padding: '11px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '2px',
                marginTop: '4px',
                boxShadow: '0 0 16px rgba(0, 240, 255, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              {isSubmitting ? (
                <span>VERIFYING SATELLITE CREDENTIALS...</span>
              ) : (
                <>
                  <span>AUTHENTICATE & ENTER PORTAL</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Pre-fill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '10px',
            fontSize: '0.66rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <span style={{ color: 'var(--text-dim)' }}>Officer Demo Profile:</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              style={{
                background: 'rgba(255, 153, 0, 0.12)',
                border: '1px solid var(--accent-amber)',
                color: 'var(--accent-amber)',
                padding: '3px 8px',
                fontSize: '0.64rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                borderRadius: '2px'
              }}
            >
              ⚡ AUTO-FILL CREDENTIALS
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
