import React, { Component } from 'react';
import '../styles/App.css';
import OpponentBox from './OpponentBox.jsx';
import PlayerBox from './PlayerBox.jsx';

let boardMatrix = [1, 2, 3, 4, 5, 6];

class App extends Component {
  constructor (props) {
    super (props);

    this.getIndex = this.getIndex.bind(this);
  };

  getIndex (e) {
    console.log('this is index', e);
  };

  render () {
    return (
      <div className="App">
        <h1>BATTLE SHIP</h1>
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
    );
  };
};

export default App;
