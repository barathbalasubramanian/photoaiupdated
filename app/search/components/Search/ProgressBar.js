import React from "react";
import "./progressBar.css";

const ProgressBar = ({ occupiedSpace, fullSpace }) => {
    const percentageUsed = (occupiedSpace / fullSpace) * 100;
    return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${Math.round(percentageUsed)}%` }}>
        <span className="progress-text">{` ${(fullSpace - occupiedSpace).toFixed(2)}GB`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
