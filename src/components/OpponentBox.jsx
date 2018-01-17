import React from 'react';
import '../styles/App.css';

const checkIfBoxHit = (storageObj, currCoord) => {
  if (storageObj[JSON.stringify(currCoord)]) {
    return storageObj[JSON.stringify(currCoord)];
  }
};

const OpponentBox = (props) => {
  console.log(checkIfBoxHit(props.hitAndMissStorage, props.i));
  if (checkIfBoxHit(props.hitAndMissStorage, props.i) === 'hit') {
    return (
      <div className="opponent-box-container-hit" onClick={() => {props.fireShots(props.i)}}>
        <div className="opponent-box">
          HIT!
        </div>
      </div>
    )
  } else if (checkIfBoxHit(props.hitAndMissStorage, props.i) === 'miss') {
    return (
      <div className="opponent-box-container-miss" onClick={() => {props.fireShots(props.i)}}>
        <div className="opponent-box">
          MISS!
        </div>
      </div>
    )
  } else {
    return (
      <div className="opponent-box-container" onClick={() => {props.fireShots(props.i)}}>
        <div className="opponent-box">

        </div>
      </div>
    )
  }
};

export default OpponentBox;
