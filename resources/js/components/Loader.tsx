import { CSSProperties } from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  overlay?: boolean;
  text?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Loader({ 
  size = 'medium', 
  overlay = false, 
  text = 'Memuat...', 
  className = '',
  style = {}
}: LoaderProps) {
  
  // Size configurations
  const sizeConfig = {
    small: {
      spinner: '30px',
      text: 'var(--font-size-small)',
      gap: '10px'
    },
    medium: {
      spinner: '50px',
      text: 'var(--font-size-medium)',
      gap: '15px'
    },
    large: {
      spinner: '70px',
      text: 'var(--font-size-large)',
      gap: '20px'
    }
  };

  const config = sizeConfig[size];

  const loaderStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--main-font)',
    gap: config.gap,
    ...style
  };

  const overlayStyles: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const spinnerStyles: CSSProperties = {
    width: config.spinner,
    height: config.spinner,
    border: '4px solid #f3f3f3',
    borderTop: '4px solid var(--primary-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const textStyles: CSSProperties = {
    color: 'var(--grey-text)',
    fontSize: config.text,
    fontWeight: 'var(--font-weight-medium)',
    margin: 0,
    animation: 'pulse 2s ease-in-out infinite'
  };

  const keyframesCSS = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .loader-container {
      animation: fadeIn 0.3s ease-in-out;
    }
  `;

  const LoaderContent = () => (
    <div 
      className={`loader-container ${className}`}
      style={loaderStyles}
    >
      <style>{keyframesCSS}</style>
      <div style={spinnerStyles}></div>
      {text && <p style={textStyles}>{text}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div style={overlayStyles}>
        <LoaderContent />
      </div>
    );
  }

  return <LoaderContent />;
}

// Additional preset loaders for common use cases
export const PageLoader = ({ text = 'Memuat halaman...' }: { text?: string }) => (
  <Loader size="large" overlay={true} text={text} />
);

export const SectionLoader = ({ text = 'Memuat...' }: { text?: string }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: '40px 20px',
    minHeight: '200px'
  }}>
    <Loader size="medium" text={text} />
  </div>
);

export const ButtonLoader = () => (
  <Loader 
    size="small" 
    text="" 
    style={{ 
      display: 'inline-flex',
      margin: '0 10px'
    }} 
  />
);

export const InlineLoader = ({ text = 'Memuat...' }: { text?: string }) => (
  <div style={{ 
    display: 'inline-flex', 
    alignItems: 'center', 
    gap: '10px',
    padding: '5px 0'
  }}>
    <Loader size="small" text={text} />
  </div>
);
