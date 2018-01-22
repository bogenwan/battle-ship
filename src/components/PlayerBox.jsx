import React from 'react';
import '../styles/App.css';

const checkHasShipCoord = (shipCoords, boxCoord) => {
  return shipCoords.some(eachCoord => JSON.stringify(eachCoord) === JSON.stringify(boxCoord));
};

// check if own ship got damage
const checkIfBoxHit = (storageObj, currCoord) => {
  if (storageObj[JSON.stringify(currCoord)]) {
    return storageObj[JSON.stringify(currCoord)];
  }
};

const PlayerBox = (props) => {
  const _addShipToMap = () => {
    props.addShipToMap(props.i);
  };
  if ( checkIfBoxHit(props.playerHitAndMissStorage, props.i) === 'hit') {
    return (
    <div className="player-box-container-hit">
      <div className="player-box">
        HIT!
      </div>
    </div>
    )
  } else if ( checkIfBoxHit(props.playerHitAndMissStorage, props.i) === 'miss') {
    return (
    <div className="player-box-container-miss">
      <div className="player-box">
        MISS!
      </div>
    </div>
    )
  } else if (checkHasShipCoord(props.playerShipsCoordinates, props.i)) {
    return (
    <div className="player-box-container-has-ship">
      <div className="player-box">
      </div>
    </div>
    )
  } else {
    return (
    <div className="player-box-container" onClick={_addShipToMap}>
      <div className="player-box">
      </div>
    </div>
    )
  }
};

export default PlayerBox;
