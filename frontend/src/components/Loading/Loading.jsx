import React, { useContext } from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-wrapper">
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


