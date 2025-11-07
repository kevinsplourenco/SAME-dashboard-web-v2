import React from "react";

export default function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100%',
      backgroundColor: '#0f0f1e',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTop: '4px solid #8b5cf6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 2rem'
        }}></div>
        
        <h2 style={{
          color: '#ffffff',
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '0.5rem'
        }}>
          Carregando
        </h2>
        
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.875rem'
        }}>
          Aguarde um momento...
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}