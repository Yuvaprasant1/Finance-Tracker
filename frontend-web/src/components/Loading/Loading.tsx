import React from 'react';
import { useLoading } from '../../context/LoadingContext';
import './Loading.css';

const Loading: React.FC = () => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-text">{loadingMessage}</p>
      </div>
    </div>
  );
};

export default Loading;

