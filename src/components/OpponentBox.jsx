import React from 'react';
import '../styles/App.css';

const checkIfBoxHit = (storageObj, currCoord) => {
  if (storageObj[JSON.stringify(currCoord)]) {
    return storageObj[JSON.stringify(currCoord)];
  }
};

const OpponentBox = (props) => {
  console.log(checkIfBoxHit(props.hitAndMissStorage, props.i));
  return (
    <div className="opponent-box-container" onClick={() => {props.fireShots(props.i)}}>
      <div className="opponent-box">

      </div>
    </div>
  )
};

export default OpponentBox;
