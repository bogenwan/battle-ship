import React, { Component } from 'react';
import '../styles/App.css';
import OpponentBox from './OpponentBox.jsx';
import PlayerBox from './PlayerBox.jsx';
import { Ship } from '../boardUtils/shipFactory.js';
import _ from 'lodash';
import io from 'socket.io-client';
let socket = io('/');


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
      playerShipsTracker: [],
      playerShipsCoordinates: [],
      enemyShipsCoordinates: [],
      playerHitAndMissStorage: {},
      enemyHitAndMissStorage: {},
      myTurn: false,
      attackStatus: ''
    };

    this.fireShots = this.fireShots.bind(this);
    this.setShipPosition = this.setShipDirection.bind(this);
    this.addShipToMap = this.addShipToMap.bind(this);
    this.fireShots = this.fireShots.bind(this);
    this.gotHit = this.gotHit.bind(this);
    this.renderHitEnemyBoard = this.renderHitEnemyBoard.bind(this);
    this.renderMissEnemyBoard = this.renderMissEnemyBoard.bind(this);
  };

  componentDidMount () {
    socket.on('fire', fireData => {
      this.gotHit(fireData.coordinates)
    });
    socket.on('youWin', msg => {
      window.alert(msg.enemyWinMsg)
      this.renderHitEnemyBoard(msg.coordinates);
    });
    socket.on('landedHit', msg => {
      this.renderHitEnemyBoard(msg.coordinates);
    });
    socket.on('noHit', msg => {
      this.renderMissEnemyBoard(msg.coordinates);
    });
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
    let copyPlayerShipsTracker = [];
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
              copyPlayerShipsTracker.push([coordinates[0] + j, coordinates[1]]);
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
              copyPlayerShipsTracker.push([coordinates[0], coordinates[1] + j]);
            }
          }
        }
      if (typeOfShip === 'cruiser' && copiedShip.position.length !== 0) {
        this.setState({
          cruiserCount: this.state.cruiserCount - 1,
          fleet: this.state.fleet + 1,
          cruiser: copiedShip,
          addShip: false,
          playerShipsCoordinates: [...this.state.playerShipsCoordinates, ...copyPlayerShipsCoordinates],
          playerShipsTracker: [...this.state.playerShipsTracker, ...copyPlayerShipsTracker]
        });
      } else if (typeOfShip === 'destroyer' && copiedShip.position.length !== 0) {
        this.setState({
          destroyerCount: this.state.destroyerCount - 1,
          fleet: this.state.fleet + 1,
          destroyer: copiedShip,
          addShip: false,
          playerShipsCoordinates: [...this.state.playerShipsCoordinates, ...copyPlayerShipsCoordinates],
          playerShipsTracker: [...this.state.playerShipsTracker, ...copyPlayerShipsTracker]
        });
      }
    } else {
      window.alert(`You have added the max amount of ${typeOfShip}, please choose another ship!`);
    }
  };

  findIndexInShipList (list, coord) {
    return _.findIndex(list, (item) => JSON.stringify(item) === JSON.stringify(coord));
  };

  fireShots (coordinates) {
    let fireData = {
      coordinates,
    };
    socket.emit('fire', fireData);
  };

  gotHit (coordinates) {
    let copyPlayerHitAndMissStorage = Object.assign({}, this.state.playerHitAndMissStorage);
    let copyPlayerShipsTracker = [...this.state.playerShipsTracker];
    if (this.containCoordinates(copyPlayerShipsTracker, coordinates)) {
      console.log("you got hit!");
      copyPlayerHitAndMissStorage[JSON.stringify(coordinates)] = 'hit';
      copyPlayerShipsTracker.splice(this.findIndexInShipList(copyPlayerShipsTracker, coordinates), 1);
      this.setState({
        attackStatus: 'GOT HIT!',
        playerHitAndMissStorage: copyPlayerHitAndMissStorage,
        playerShipsTracker: copyPlayerShipsTracker
      });
      if (copyPlayerShipsTracker.length === 0) {
        window.alert('All your ship sunk, YOU LOOSE!');
        let enemyWinMsg = {
          enemyWinMsg: 'you sunk all enemy ships, YOU WIN!',
          coordinates,
        };
        socket.emit('youWin', enemyWinMsg);
      } else {
        let enemyHitMsg = {
          enemyHitMsg: 'you landed a hit!',
          coordinates,
        };
        socket.emit('landedHit', enemyHitMsg);
      }
    } else {
      console.log('enemy miss!');
      copyPlayerHitAndMissStorage[JSON.stringify(coordinates)] = 'miss';
      this.setState({
        attackStatus: 'ENEMY MISS!',
        playerHitAndMissStorage: copyPlayerHitAndMissStorage,
        playerShipsTracker: copyPlayerShipsTracker
      });
      let enemyMissMsg = {
        enemyMissMsg: 'you miss!',
        coordinates,
      };
      socket.emit('noHit', enemyMissMsg);
    }
  };

  renderHitEnemyBoard (coordinates) {
    let copyEnemyHitAndMissStorage = Object.assign({}, this.state.enemyHitAndMissStorage);
    copyEnemyHitAndMissStorage[JSON.stringify(coordinates)] = 'hit';
    this.setState({
      attackStatus: 'HIT!',
      enemyHitAndMissStorage: copyEnemyHitAndMissStorage
    });
  };

  renderMissEnemyBoard (coordinates) {
    let copyEnemyHitAndMissStorage = Object.assign({}, this.state.enemyHitAndMissStorage);
    copyEnemyHitAndMissStorage[JSON.stringify(coordinates)] = 'miss';
    this.setState({
      attackStatus: 'MISS!',
      enemyHitAndMissStorage: copyEnemyHitAndMissStorage
    });
  };

  render () {
    const _opponentBoard = boardMatrix.map((rowBox, index1) =>
      boardMatrix.map((colBox, index2) =>
        <OpponentBox
        key={index2}
        i={[index1, index2]}
        fireShots={this.fireShots}
        enemyHitAndMissStorage={this.state.enemyHitAndMissStorage}
        />
      )
    );
    const _playerBoard = boardMatrix.map((rowBox, index1) =>
      boardMatrix.map((colBox, index2) =>
        <PlayerBox
        key={index2}
        playerShipsCoordinates={this.state.playerShipsCoordinates}
        i={[index1, index2]}
        addShipToMap={this.addShipToMap}
        fireShots={this.fireShots}
        playerHitAndMissStorage={this.state.playerHitAndMissStorage}
        />
      )
    );
    const _crusierVertical = () => {
      this.setShipDirection('vertical', 'cruiser');
    };
    const _cruiserHorizontal = () => {
      this.setShipDirection('horizontal', 'cruiser');
    };
    const _destroyerVertical = () => {
      this.setShipDirection('vertical', 'destroyer');
    };
    const _destroyerHorizontal = () => {
      this.setShipDirection('horizontal', 'destroyer');
    };
    return (
      <div className="App">
        <h1 className="title">BATTLE SHIP</h1>
        <div className="ship-select-title">
          <h2>Place your ships</h2>
        </div>
        <div className="ship-select-container">
          <div className="ship-select-container-item">
            <h3 className="ship-select-text">Cruiser x {`${this.state.cruiserCount}`}</h3>
            <div className="ship-input-container">
              <input type="button" ref="vertical" value="vertical" onClick={_crusierVertical} />
              <input type="button" ref="horizontal" value="horizontal" onClick={_cruiserHorizontal} />
            </div>
          </div>
          <div className="ship-select-container-item">
            <h3 className="ship-select-text">Destroyer x {`${this.state.destroyerCount}`}</h3>
            <div className="ship-input-container">
              <input type="button" ref="vertical" value="vertical" onClick={_destroyerVertical} />
              <input type="button" ref="horizontal" value="horizontal" onClick={_destroyerHorizontal} />
            </div>
          </div>
        </div>
        <div className="boards-container">
          <div className="board-container">
            <h1 className="map-title">YOUR MAP</h1>
            <div className="player-board-container">
              {_playerBoard}
            </div>
          </div>
          <div className="board-container">
            <h1 className="map-title">OPPONENT'S MAP</h1>
            <div className="opponent-board-container">
              {_opponentBoard}
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default App;
