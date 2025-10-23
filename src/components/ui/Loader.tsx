import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Loader: React.FC<LoaderProps> = ({
  fullScreen = false,
  size = 'medium',
}) => {
  const sizeMap = {
    small: '40px',
    medium: '60px',
    large: '80px',
  };

  const containerStyle: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      };

  const loaderSize = sizeMap[size];

  const styles = `
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .spinner {
      position: relative;
      width: ${loaderSize};
      height: ${loaderSize};
    }

    .spinner::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      border: 4px solid rgba(249, 115, 22, 0.2);
      border-top-color: #f97316;
      border-right-color: #fb923c;
      border-bottom-color: transparent;
      border-left-color: transparent;
      border-radius: 50%;
      animation: spin 1.2s linear infinite;
    }

    .spinner::before {
      content: "";
      position: absolute;
      width: calc(100% - 12px);
      height: calc(100% - 12px);
      top: 6px;
      left: 6px;
      border: 3px solid rgba(249, 115, 22, 0.1);
      border-top-color: #fb923c;
      border-right-color: transparent;
      border-bottom-color: transparent;
      border-left-color: #f97316;
      border-radius: 50%;
      animation: spin 1.8s linear infinite reverse;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div style={containerStyle}>
        <div className="spinner"></div>
      </div>
    </>
  );
};

export default Loader;
