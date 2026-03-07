import React, { useContext } from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-wrapper" role="status" aria-live="polite" aria-label="Loading">
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;


