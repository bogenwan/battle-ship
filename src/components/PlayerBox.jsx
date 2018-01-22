import React from 'react';
import '../styles/App.css';

const checkHasShipCoord = (shipCoords, boxCoord) => {
  return shipCoords.some(eachCoord => JSON.stringify(eachCoord) === JSON.stringify(boxCoord));
};

const PlayerBox = (props) => {
  const _addShipToMap = () => {
    props.addShipToMap(props.i);
  };
  return (
    <div className={checkHasShipCoord(props.playerShipsCoordinates, props.i) ?
      "player-box-container-has-ship" :
      "player-box-container"}
      onClick={_addShipToMap}>
      <div className="player-box">
      </div>
    </div>
  )
};

export default PlayerBox;
