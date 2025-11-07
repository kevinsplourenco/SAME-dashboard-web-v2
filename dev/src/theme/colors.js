export const THEME = {
  colors: {
    // Cores do fundo
    background: {
      primary: '#0f0f1e',
      secondary: '#1a1a2e',
      tertiary: '#1f1f2e',
    },
    
    // Cores de texto
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.6)',
      tertiary: 'rgba(255, 255, 255, 0.4)',
    },
    
    // Cores de status
    status: {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
    
    // Cores de gradientes
    gradient: {
      primary: 'from-purple-600 to-purple-700',
      success: 'from-emerald-500 to-emerald-600',
      error: 'from-red-500 to-red-600',
      warning: 'from-amber-500 to-amber-600',
      info: 'from-cyan-500 to-cyan-600',
    },
    
    // Cores de borda
    border: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
    },
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

export default THEME;