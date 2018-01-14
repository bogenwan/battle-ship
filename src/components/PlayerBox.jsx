import React from 'react';
import '../styles/App.css';

const PlayerBox = (props) => {
  return (
    <div className="player-box-container" onClick={() => {props.getIndex(props.i)}}>
      <div className="player-box">

      </div>
    </div>
  )
};

export default PlayerBox;