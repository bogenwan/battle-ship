import React, { Component } from 'react';
import '../styles/App.css';
import OpponentBox from './OpponentBox.jsx';
import PlayerBox from './PlayerBox.jsx';
import { Ship } from '../boardUtils/shipFactory.js';
import _ from 'lodash';
import io from 'socket.io-client';
let socket = io('/');

// matrix size
let boardMatrix = [1, 2, 3, 4, 5, 6];

class App extends Component {
  constructor (props) {
    super (props);

    this.state = {
      cruiser: new Ship(3, 'cruiser'),
      cruiserCount: 3,
      cruiserId:0,
      destroyer: new Ship(4, 'destroyer'),
      destroyerCount: 2,
      destroyerId:0,
      collide: false,
      playerShipStorage: {},
      fleet: 0,
      direction: '',
      addShip: false,
      whatTypeOfShip: '',
      playerShipsTracker: [],
      playerShipsCoordinates: [],
      enemyShipsCoordinates: [],
      playerHitAndMissStorage: {},
      enemyHitAndMissStorage: {},
      initSetUp: true,
      player: '',
      attackStatus: '',
      restartGame: false
    };

    this.fireShots = this.fireShots.bind(this);
    this.setShipPosition = this.setShipDirection.bind(this);
    this.addShipToMap = this.addShipToMap.bind(this);
    this.fireShots = this.fireShots.bind(this);
    this.gotHit = this.gotHit.bind(this);
    this.renderHitEnemyBoard = this.renderHitEnemyBoard.bind(this);
    this.renderMissEnemyBoard = this.renderMissEnemyBoard.bind(this);
    this.initialSetSup = this.initialSetSup.bind(this);
    this.restartGame = this.restartGame.bind(this);
  };

  componentDidMount () {
    socket.on('fire', fireData => {
      this.gotHit(fireData.coordinates)
    });
    socket.on('youWin', msg => {
      window.alert(msg.enemyWinMsg)
      this.renderHitEnemyBoard(msg.coordinates);
      this.setState({
        restartGame: true
      });
    });
    socket.on('landedHit', msg => {
      window.alert(msg.enemyHitMsg);
      this.renderHitEnemyBoard(msg.coordinates);
    });
    socket.on('noHit', msg => {
      window.alert(msg.enemyMissMsg);
      this.renderMissEnemyBoard(msg.coordinates);
    });
    this.initialSetSup();
  };

  // check if this initial set up for players
  initialSetSup () {
    if (this.state.initSetUp) {
      window.alert('Welcome to BATTLE SHIP Commander! Please select your ship from cruiser or destroyer and place them on to YOUR MAP.');
      this.setState({
        initSetUp: false
      })
    } else {
      return null;
    }
  };

  restartGame () {
    document.location.reload(false);
  };

  shipIntersectCheck (shipsCoord, currCoord) {
    return shipsCoord.some(eachCoord => JSON.stringify(eachCoord) === JSON.stringify(currCoord));
  };

  // check if coordinate exist in enemy ship list
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
    // check if ship placement is with-in the board
    if ((this.state.direction === 'vertical' && coordinates[0] + this.state[`${typeOfShip}`].size - 1 > boardMatrix.length - 1) || (this.state.direction === 'horizontal' && coordinates[1] + this.state[`${typeOfShip}`].size - 1 > boardMatrix.length - 1)) {
      window.alert('Commander, ship placement is out of board size, Please select another box!');
      return;
    }
    // create new ship instance and store in to storage to keep track of each ship
    let copiedShip
    if (`${typeOfShip}` === 'cruiser') {
      copiedShip = new Ship(3, 'cruiser');
    } else if (`${typeOfShip}` === 'destroyer') {
      copiedShip = new Ship(4, 'destroyer');
    }
    let copyPlayerShipStorage = Object.assign({}, this.state.playerShipStorage);
    // keeps track of all ships on map
    let copyPlayerShipsTracker = [];
    let copyPlayerShipsCoordinates = [];
    let collide = false;
    // check there is still allowable amount to place ships
    if (this.state[`${typeOfShip}Count`] > 0) {
        if (this.state.direction === 'vertical') {
          for (let i = 0; i < copiedShip.size; i++) {
            // make sure ship placement don't overlap
            if (this.shipIntersectCheck(this.state.playerShipsCoordinates, [coordinates[0] + i, coordinates[1]])) {
              window.alert('Commander, we can\'t have ship placement overlap another ship, please select another box!');
              collide = true;
              break;
            }
          }
          // add ship if don't overlap
          if (!collide) {
            for (let j = 0; j < copiedShip.size; j++) {
              copiedShip.position.push([coordinates[0] + j, coordinates[1]]);
              copyPlayerShipsCoordinates.push([coordinates[0] + j, coordinates[1]]);
              copyPlayerShipsTracker.push([coordinates[0] + j, coordinates[1]]);
            }
            copyPlayerShipStorage[`${typeOfShip}`+this.state[`${typeOfShip}`+'Id']] = copiedShip.position;
            this.setState({
              playerShipStorage: copyPlayerShipStorage,
            });
          }
          // if placement is horizontal
        } else if (this.state.direction === 'horizontal') {
          for (let i = 0; i < copiedShip.size; i++) {
            if (this.shipIntersectCheck(this.state.playerShipsCoordinates, [coordinates[0], coordinates[1] + i])) {
              window.alert('Commander, we can\'t have ship placement overlap another ship, please select another box!');
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
            copyPlayerShipStorage[`${typeOfShip}`+this.state[`${typeOfShip}`+'Id']] = copiedShip.position;
            this.setState({
              playerShipStorage: copyPlayerShipStorage
            });
          }
        }
        // if ship alrady existed in list, the just add on to it
      if (typeOfShip === 'cruiser' && copiedShip.position.length !== 0) {
        this.setState({
          cruiserCount: this.state.cruiserCount - 1,
          fleet: this.state.fleet + 1,
          cruiserId: this.state.cruiserId + 1,
          addShip: false,
          playerShipsCoordinates: [...this.state.playerShipsCoordinates, ...copyPlayerShipsCoordinates],
          playerShipsTracker: [...this.state.playerShipsTracker, ...copyPlayerShipsTracker]
        });
        // if destroyer we it to list
      } else if (typeOfShip === 'destroyer' && copiedShip.position.length !== 0) {
        this.setState({
          destroyerCount: this.state.destroyerCount - 1,
          fleet: this.state.fleet + 1,
          destroyerId: this.state.destroyerId + 1,
          addShip: false,
          playerShipsCoordinates: [...this.state.playerShipsCoordinates, ...copyPlayerShipsCoordinates],
          playerShipsTracker: [...this.state.playerShipsTracker, ...copyPlayerShipsTracker]
        });
      }
      // check if player alrady added the max amount of ships in play
    } else if (this.state.cruiserCount === 0 && this.state.destroyerCount === 0) {
      window.alert('Commander, you have placed all available ships in play, now flip a coin and decide which player fires first, GOOD LUCK!');
    } else {
      // if the amount of a specific ship used is maxed let user know to pick other type of ship
      window.alert(`Commander, you have place the max amount of ${typeOfShip}, please choose another ship!`);
    }
  };

  findIndexInShipList (list, coord) {
    return _.findIndex(list, (item) => JSON.stringify(item) === JSON.stringify(coord));
  };

  fireShots (coordinates) {
    if (this.state.enemyHitAndMissStorage[JSON.stringify(coordinates)]) {
      window.alert('Commander you have already fire shot at this coordinates, please pick another coordinates!');
    } else {
      let fireData = {
        coordinates,
      };
      socket.emit('fire', fireData);
    }
  };

  // check is player's ship got hit
  gotHit (coordinates) {
    let copyPlayerShipStorage = Object.assign({}, this.state.playerShipStorage);
    let copyPlayerHitAndMissStorage = Object.assign({}, this.state.playerHitAndMissStorage);
    let copyPlayerShipsTracker = [...this.state.playerShipsTracker];
    if (this.containCoordinates(copyPlayerShipsTracker, coordinates)) {
      copyPlayerHitAndMissStorage[JSON.stringify(coordinates)] = 'hit';
      copyPlayerShipsTracker.splice(this.findIndexInShipList(copyPlayerShipsTracker, coordinates), 1);
      // check if it hit one of player ship enough to sink it
      for (let key in copyPlayerShipStorage) {
        if (this.containCoordinates(copyPlayerShipStorage[key], coordinates)) {
          window.alert(`Commander, our ${key} got hit!`);
          copyPlayerShipStorage[key].splice(this.findIndexInShipList(copyPlayerShipStorage[key], coordinates), 1);
          if (copyPlayerShipStorage[key].length === 0) {
            window.alert(`Commander, enemy have sunk our ${[key]}!`);
            delete copyPlayerShipStorage[key];
          }
        }
      }
      this.setState({
        attackStatus: 'GOT HIT!',
        playerHitAndMissStorage: copyPlayerHitAndMissStorage,
        playerShipsTracker: copyPlayerShipsTracker,
        playerShipStorage: copyPlayerShipStorage
      });
      // if ship list have no more ship then player loose the game
      if (copyPlayerShipsTracker.length === 0) {
        window.alert('Commander, all your ships have been sunk by our enemy, WE LOST!');
        let enemyWinMsg = {
          enemyWinMsg: 'Commander, you have sunk all our enemy\'s ships, WE WON!',
          coordinates,
        };
        socket.emit('youWin', enemyWinMsg);
        this.setState({
          restartGame: true
        });
      } else {
        let enemyHitMsg = {
          enemyHitMsg: 'Commander, you landed a hit on enemy\'s ship!',
          coordinates,
        };
        socket.emit('landedHit', enemyHitMsg);
      }
    } else {
      // if player missed and didn't hti opponent
      console.log('enemy miss!');
      copyPlayerHitAndMissStorage[JSON.stringify(coordinates)] = 'miss';
      this.setState({
        attackStatus: 'ENEMY MISS!',
        playerHitAndMissStorage: copyPlayerHitAndMissStorage,
        playerShipsTracker: copyPlayerShipsTracker
      });
      let enemyMissMsg = {
        enemyMissMsg: 'Commander, your shot missed!',
        coordinates,
      };
      socket.emit('noHit', enemyMissMsg);
    }
  };
  // render all the markers for damage on opponent board
  renderHitEnemyBoard (coordinates) {
    let copyEnemyHitAndMissStorage = Object.assign({}, this.state.enemyHitAndMissStorage);
    copyEnemyHitAndMissStorage[JSON.stringify(coordinates)] = 'hit';
    this.setState({
      attackStatus: 'HIT!',
      enemyHitAndMissStorage: copyEnemyHitAndMissStorage
    });
  };
  // render all miss markers for opponent board
  renderMissEnemyBoard (coordinates) {
    let copyEnemyHitAndMissStorage = Object.assign({}, this.state.enemyHitAndMissStorage);
    copyEnemyHitAndMissStorage[JSON.stringify(coordinates)] = 'miss';
    this.setState({
      attackStatus: 'MISS!',
      enemyHitAndMissStorage: copyEnemyHitAndMissStorage
    });
  };

  render () {
    console.log(this.state.playerShipStorage)
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
    const _restartGame = () => {
      this.restartGame();
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
              <input className="input-button" type="button" ref="vertical" value="vertical" onClick={_crusierVertical} />
              <input className="input-button" type="button" ref="horizontal" value="horizontal" onClick={_cruiserHorizontal} />
            </div>
          </div>
          <input className={this.state.restartGame ? "restart-button-show" : "restart-button-hide"} type="button" ref="restartButton" value="restart game" onClick={_restartGame} />
          <div className="ship-select-container-item">
            <h3 className="ship-select-text">Destroyer x {`${this.state.destroyerCount}`}</h3>
            <div className="ship-input-container">
              <input className="input-button" type="button" ref="vertical" value="vertical" onClick={_destroyerVertical} />
              <input className="input-button" type="button" ref="horizontal" value="horizontal" onClick={_destroyerHorizontal} />
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
