import React, { Component } from 'react';
import '../styles/App.css';
import OpponentBox from './OpponentBox.jsx';
import PlayerBox from './PlayerBox.jsx';
import { Ship } from '../boardUtils/shipFactory.js';
import _ from 'lodash';

let boardMatrix = [1, 2, 3, 4, 5, 6];

class App extends Component {
  constructor (props) {
    super (props);

    this.state = {
      cruiser: new Ship(3, 'cruiser'),
      cruiserCount: 3,
      destroyer: new Ship(4, 'destroyer'),
      destroyerCount: 2,
      collide: false,
      fleet: 0,
      direction: '',
      addShip: false,
      whatTypeOfShip: '',
      playerShipsCoordinates: [],
      enemyShipsCoordinates: [[0, 1], [0, 2], [0, 3], [2, 2], [3, 2], [4, 2], [5, 2]],
      hitAndMissStorage: {},
      myTurn: false,
      attackStatus: ''
    };

    this.fireShots = this.fireShots.bind(this);
    this.setShipPosition = this.setShipDirection.bind(this);
    this.addShipToMap = this.addShipToMap.bind(this);
    this.fireShots = this.fireShots.bind(this);
  };


  shipIntersectCheck (shipsCoord, currCoord) {
    return shipsCoord.some(eachCoord => JSON.stringify(eachCoord) === JSON.stringify(currCoord));
  };

  containCoordinates (enemyShipList, currCoord) {
    return enemyShipList.some(eachCoord => JSON.stringify(eachCoord) === JSON.stringify(currCoord));
  }

  setShipDirection (direction, shipType) {
    this.setState({
      direction: direction,
      addShip: true,
      whatTypeOfShip: shipType
    });
  };

  addShipToMap (coordinates) {
    let typeOfShip = this.state.whatTypeOfShip;
    if ((this.state.direction === 'vertical' && coordinates[0] + this.state[`${typeOfShip}`].size - 1 > boardMatrix.length - 1) || (this.state.direction === 'horizontal' && coordinates[1] + this.state[`${typeOfShip}`].size - 1 > boardMatrix.length - 1)) {
      window.alert('Ship placement is out of board size, Please select another box!');
      return;
    }
    let copiedShip = Object.assign({}, this.state[typeOfShip]);
    let copyPlayerShipsCoordinates = [];
    let collide = false;
    if (this.state[`${typeOfShip}Count`] > 0) {
        if (this.state.direction === 'vertical') {
          for (let i = 0; i < copiedShip.size; i++) {
            if (this.shipIntersectCheck(this.state.playerShipsCoordinates, [coordinates[0] + i, coordinates[1]])) {
              window.alert('Can\'t have ship placement overlap another ship, please select another box!');
              collide = true;
              break;
            }
          }
          if (!collide) {
            for (let j = 0; j < copiedShip.size; j++) {
              copiedShip.position.push([coordinates[0] + j, coordinates[1]]);
              copyPlayerShipsCoordinates.push([coordinates[0] + j, coordinates[1]]);
            }
          }
        } else if (this.state.direction === 'horizontal') {
          for (let i = 0; i < copiedShip.size; i++) {
            if (this.shipIntersectCheck(this.state.playerShipsCoordinates, [coordinates[0], coordinates[1] + i])) {
              window.alert('Can\'t have ship placement overlap another ship, please select another box!');
              collide = true;
              break;
            }
          }
          if (!collide) {
            for (let j = 0; j < copiedShip.size; j++) {
              copiedShip.position.push([coordinates[0], coordinates[1] + j]);
              copyPlayerShipsCoordinates.push([coordinates[0], coordinates[1] + j]);
            }
          }
        }
      if (typeOfShip === 'cruiser' && copiedShip.position.length !== 0) {
        this.setState({
          cruiserCount: this.state.cruiserCount - 1,
          fleet: this.state.fleet + 1,
          cruiser: copiedShip,
          addShip: false,
          playerShipsCoordinates: [...this.state.playerShipsCoordinates, ...copyPlayerShipsCoordinates]
        });
      } else if (typeOfShip === 'destroyer' && copiedShip.position.length !== 0) {
        this.setState({
          destroyerCount: this.state.destroyerCount - 1,
          fleet: this.state.fleet + 1,
          destroyer: copiedShip,
          addShip: false,
          playerShipsCoordinates: [...this.state.playerShipsCoordinates, ...copyPlayerShipsCoordinates]
        });
      }
    } else {
      window.alert(`You have added the max amount of ${typeOfShip}, please choose another ship!`);
    }
  };

  findIndexInEnemyShipList (list, coord) {
    return _.findIndex(list, (item) => JSON.stringify(item) === JSON.stringify(coord));
  };

  fireShots (coordinates) {
    let copyHitAndMissStorage = Object.assign({}, this.state.hitAndMissStorage);
    let copyEnemyShipCoordinates = [...this.state.enemyShipsCoordinates];
    console.log(copyEnemyShipCoordinates)
    if (this.containCoordinates(this.state.enemyShipsCoordinates, coordinates)) {
      console.log('hit!');
      copyHitAndMissStorage[JSON.stringify(coordinates)] = 'hit';
      copyEnemyShipCoordinates.splice(this.findIndexInEnemyShipList(copyEnemyShipCoordinates, coordinates), 1);
      this.setState({
        attackStatus: 'HIT!',
        hitAndMissStorage: copyHitAndMissStorage,
        enemyShipsCoordinates: copyEnemyShipCoordinates
      });
      if (copyEnemyShipCoordinates.length === 0) {
        window.alert('You have sunk all enemy ship, you win!!');
      }
    } else {
      console.log('miss!');
      copyHitAndMissStorage[JSON.stringify(coordinates)] = 'miss';
      this.setState({
        attackStatus: "MISS!",
        hitAndMissStorage: copyHitAndMissStorage
      });
    }
  };

  render () {
    console.log(this.state.hitAndMissStorage);
    return (
      <div className="App">
        <h1 className="title">BATTLE SHIP</h1>
        <div className="boards-container">
          <h1>OPPONENT'S MAP</h1>
          <div className="opponent-board-container">
            {
              boardMatrix.map((rowBox, index1) =>
                boardMatrix.map((colBox, index2) =>
                  <OpponentBox
                  key={index2}
                  i={[index1, index2]}
                  fireShots={this.fireShots}
                  hitAndMissStorage={this.state.hitAndMissStorage}
                  />
                )
              )
            }
          </div>
          <h1>YOUR MAP</h1>
          <div className="player-board-container">
            {
              boardMatrix.map((rowBox, index1) =>
                boardMatrix.map((colBox, index2) =>
                  <PlayerBox
                  key={index2}
                  playerShipsCoordinates={this.state.playerShipsCoordinates}
                  i={[index1, index2]}
                  addShipToMap={this.addShipToMap}
                  fireShots={this.fireShots}
                  />
                )
              )
            }
          </div>
        </div>
        <div className="ship-select-container">
          <div>
            <h2>Place your ships</h2>
            <h3>Cruiser x {`${this.state.cruiserCount}`}</h3>
            <input type="button" ref="vertical" value="vertical" onClick={() => this.setShipDirection('vertical', 'cruiser')} />
            <input type="button" ref="horizontal" value="horizontal" onClick={() => this.setShipDirection('horizontal', 'cruiser')} />
          </div>
          <div>
            <h3>Destroyer x {`${this.state.destroyerCount}`}</h3>
            <input type="button" ref="vertical" value="vertical" onClick={() => this.setShipDirection('vertical', 'destroyer')} />
            <input type="button" ref="horizontal" value="horizontal" onClick={() => this.setShipDirection('horizontal', 'destroyer')} />
          </div>
        </div>
      </div>
    );
  };
};

export default App;
