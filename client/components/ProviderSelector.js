import { useState, useEffect } from 'react';
import { Settings, Check, AlertCircle } from 'lucide-react';

export default function ProviderSelector({ onProviderChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkApiStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/status`);
      const status = await response.json();
      setApiStatus(status);
    } catch (error) {
      console.error('Failed to check API status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const handleProviderChange = async (provider) => {
    if (onProviderChange) {
      await onProviderChange(provider);
    }
    setIsOpen(false);
    // Recheck status after provider change
    setTimeout(checkApiStatus, 1000);
  };

  const getProviderStatus = (provider) => {
    if (!apiStatus) return 'unknown';
    
    const keyPresent = apiStatus[`${provider}_key_present`];
    const status = apiStatus[`${provider}_status`];
    
    if (!keyPresent) return 'no-key';
    if (status === 'connected') return 'connected';
    if (status === 'error') return 'error';
    return 'unknown';
  };

  const getStatusIcon = (provider) => {
    const status = getProviderStatus(provider);
    switch (status) {
      case 'connected':
        return <Check size={16} style={{ color: '#10b981' }} />;
      case 'error':
        return <AlertCircle size={16} style={{ color: '#ef4444' }} />;
      case 'no-key':
        return <AlertCircle size={16} style={{ color: '#f59e0b' }} />;
      default:
        return <div style={{ width: 16, height: 16, background: '#d1d5db', borderRadius: '50%' }} />;
    }
  };

  const getStatusText = (provider) => {
    const status = getProviderStatus(provider);
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      case 'no-key':
        return 'No API Key';
      default:
        return 'Unknown';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        <Settings size={20} />
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '0.75rem',
      padding: '1rem',
      minWidth: '280px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>AI Provider Settings</h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ×
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
          Checking API status...
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Current: {apiStatus?.provider || 'Unknown'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['openai', 'anthropic', 'gemini'].map((provider) => (
              <button
                key={provider}
                onClick={() => handleProviderChange(provider)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  background: apiStatus?.provider === provider ? '#f0f9ff' : 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (apiStatus?.provider !== provider) {
                    e.target.style.background = '#f9fafb';
                  }
                }}
                onMouseOut={(e) => {
                  if (apiStatus?.provider !== provider) {
                    e.target.style.background = 'white';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{provider}</span>
                  {apiStatus?.provider === provider && (
                    <div style={{
                      background: '#3b82f6',
                      color: 'white',
                      fontSize: '0.625rem',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.25rem'
                    }}>
                      Active
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {getStatusText(provider)}
                  </span>
                  {getStatusIcon(provider)}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={checkApiStatus}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '1rem',
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Refresh Status
          </button>

          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
            <strong>Getting API Keys:</strong>
            <div>• OpenAI: platform.openai.com</div>
            <div>• Anthropic: console.anthropic.com</div>
            <div>• Gemini: makersuite.google.com</div>
          </div>
        </>
      )}
    </div>
  );
}
