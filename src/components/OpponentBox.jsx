import React from 'react';
import '../styles/App.css';

const OpponentBox = (props) => {
  return (
    <div className="opponent-box-container" onClick={() => {props.getIndex(props.i)}}>
      <div className="opponent-box">

      </div>
    </div>
  )
};

export default OpponentBox;
