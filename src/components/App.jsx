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
      cruiser: new Ship(3),
      dystroyer: new Ship(4),
      fleet: 0,
      position: '',
      addShip: false,
      whatTypeOfShip: ''
    };

    this.getIndex = this.getIndex.bind(this);
    this.setShipPosition = this.setShipPosition.bind(this);
  };

  getIndex (e) {
    console.log('this is index', e);
  };

  setShipPosition (position, shipType) {
    this.setState({
      position: position,
      addShip: true,
      whatTypeOfShip: shipType
    });
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
                  i={JSON.stringify([index1, index2])}
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
            <input type="button" ref="vertical" value="Vertical" onClick={() => this.setShipPosition('vertical', 'cruiser')} />
            <input type="button" ref="Horizontal" value="Horizontal" />
          </div>
          <div>
            <h3>Dystroyer</h3>
            <input type="button" ref="vertical" value="Vertical" />
            <input type="button" ref="Horizontal" value="Horizontal" />
          </div>
        </div>
      </div>
    );
  };
};

export default App;
