import React, { Component } from 'react';
import '../styles/App.css';
import OpponentBox from './OpponentBox.jsx';
import PlayerBox from './PlayerBox.jsx';
import { Ship } from '../boardUtils/shipFactory.js';

let boardMatrix = [1, 2, 3, 4, 5, 6];

class App extends Component {
  constructor (props) {
    super (props);

    this.state = {
      cruiser: new Ship(3, 'cruiser'),
      cruiserCount: 1,
      destroyer: new Ship(4, 'destroyer'),
      destroyerCount: 1,
      fleet: 0,
      direction: '',
      addShip: false,
      whatTypeOfShip: '',
      playerShipsCoordinates: [],
      enemyShipsCoordinates: [],
      myTurn: false
    };

    this.getIndex = this.getIndex.bind(this);
    this.setShipPosition = this.setShipDirection.bind(this);
    this.addShipToMap = this.addShipToMap.bind(this);
  };

  getIndex (e) {
    console.log('this is index', e);
  };

  setShipDirection (direction, shipType) {
    this.setState({
      direction: direction,
      addShip: true,
      whatTypeOfShip: shipType
    });
  };

  addShipToMap (coordinates) {
    let typeOfShip = this.state.whatTypeOfShip;
    console.log(coordinates)
    if ((this.state.direction === 'vertical' && coordinates[0] + this.state[`${typeOfShip}`].size - 1 > boardMatrix.length - 1) || (this.state.direction === 'horizontal' && coordinates[1] + this.state[`${typeOfShip}`].size - 1 > boardMatrix.length - 1)) {
      window.alert('Ship placement is out of board size, Please select another box!');
    }
    let copiedShip = Object.assign({}, this.state[typeOfShip]);
    let copyPlayerShipsCoordinates = [];
    if (this.state[`${typeOfShip}Count`] > 0) {
      for (let i = 0; i < copiedShip.size; i++) {
        if (this.state.direction === 'vertical') {
          console.log('in vertical ADD')
          copiedShip.position.push([coordinates[0] + i, coordinates[1]]);
          copyPlayerShipsCoordinates.push([coordinates[0] + i, coordinates[1]]);
        } else if (this.state.direction === 'horizontal') {
          console.log('in horizontal ADD')
          copiedShip.position.push([coordinates[0], coordinates[1] + i]);
          copyPlayerShipsCoordinates.push([coordinates[0], coordinates[1] + i]);
        }
      }
      if (typeOfShip === 'cruiser') {
        this.setState({
          cruiserCount: this.state.cruiserCount - 1,
          fleet: this.state.fleet + 1,
          cruiser: copiedShip,
          addShip: false,
          playerShipsCoordinates: [...this.state.playerShipsCoordinates, ...copyPlayerShipsCoordinates]
        });
      } else if (typeOfShip === 'destroyer') {
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

  render () {
    console.log(this.state)
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
                  i={JSON.stringify([index1, index2])}
                  getIndex={this.getIndex}
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
                  i={[index1, index2]}
                  addShipToMap={this.addShipToMap}
                  getIndex={this.getIndex}
                  />
                )
              )
            }
          </div>
        </div>
        <div className="ship-select-container">
          <div>
            <h3>Cruiser</h3>
            <input type="button" ref="vertical" value="vertical" onClick={() => this.setShipDirection('vertical', 'cruiser')} />
            <input type="button" ref="horizontal" value="horizontal" onClick={() => this.setShipDirection('horizontal', 'cruiser')} />
          </div>
          <div>
            <h3>Destroyer</h3>
            <input type="button" ref="vertical" value="vertical" onClick={() => this.setShipDirection('vertical', 'destroyer')} />
            <input type="button" ref="horizontal" value="horizontal" onClick={() => this.setShipDirection('horizontal', 'destroyer')} />
          </div>
        </div>
      </div>
    );
  };
};

export default App;
