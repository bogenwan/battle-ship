import React from 'react';
import '../styles/App.css';

const checkIfBoxHit = (storageObj, currCoord) => {
  if (storageObj[JSON.stringify(currCoord)]) {
    return storageObj[JSON.stringify(currCoord)];
  }
};

const OpponentBox = (props) => {
  const _fireShots = () => {
    props.fireShots(props.i);
  };
  if (checkIfBoxHit(props.enemyHitAndMissStorage, props.i) === 'hit') {
    return (
      <div className="opponent-box-container-hit" onClick={_fireShots}>
        <div className="opponent-box">
          HIT!
        </div>
      </div>
    )
  } else if (checkIfBoxHit(props.enemyHitAndMissStorage, props.i) === 'miss') {
    return (
      <div className="opponent-box-container-miss"
      onClick={_fireShots}>
        <div className="opponent-box">
          MISS!
        </div>
      </div>
    )
  } else {
    return (
      <div className="opponent-box-container" onClick={_fireShots}>
        <div className="opponent-box">

        </div>
      </div>
    )
  }
};

export default OpponentBox;
