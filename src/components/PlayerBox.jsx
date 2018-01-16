import React from 'react';
import '../styles/App.css';

let checkHasShipCoord = (shipCoords, boxCoord) => {
  return shipCoords.some(eachCoord => JSON.stringify(eachCoord) === JSON.stringify(boxCoord));
};

const PlayerBox = (props) => {
  console.log(checkHasShipCoord(props.playerShipsCoordinates, props.i))
  return (
    <div className={checkHasShipCoord(props.playerShipsCoordinates, props.i) ? "player-box-container-has-ship" : "player-box-container"} onClick={() => {props.addShipToMap(props.i)}}>
      <div className="player-box">

      </div>
    </div>
  )
};

export default PlayerBox;