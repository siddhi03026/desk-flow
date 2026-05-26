import React, { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking'); // 'connected' | 'disconnected' | 'checking'
  const [retryIn, setRetryIn] = useState(0);

  useEffect(() => {
    let mounted = true;
    
    const check = async () => {
      if (!mounted) return;
      setStatus('checking');
      const ok = await checkHealth();
      if (!mounted) return;
      
      if (ok) {
        setStatus('connected');
      } else {
        setStatus('disconnected');
        setRetryIn(15);
      }
    };

    check();
    const interval = setInterval(check, 30000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (retryIn <= 0) return;
    const timer = setInterval(() => {
      setRetryIn(prev => {
        if (prev <= 1) {
          checkHealth().then(ok => setStatus(ok ? 'connected' : 'disconnected'));
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [retryIn > 0]);

  if (status === 'connected') return null;

  return (
    <div className={`connection-bar px-4 py-2 text-center text-sm font-medium transition-all ${
      status === 'checking' 
        ? 'bg-yellow-50 text-yellow-800 border-b border-yellow-200' 
        : 'bg-red-50 text-red-800 border-b border-red-200'
    }`}>
      {status === 'checking' ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Connecting to server...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Server unavailable — retrying in {retryIn}s
          <button 
            onClick={() => { setRetryIn(0); setStatus('checking'); checkHealth().then(ok => setStatus(ok ? 'connected' : 'disconnected')); }}
            className="ml-2 underline hover:no-underline"
          >
            Retry now
          </button>
        </span>
      )}
    </div>
  );
};

export default ConnectionStatus;
