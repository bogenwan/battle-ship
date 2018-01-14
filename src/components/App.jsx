import React, { Component } from 'react';
import '../styles/App.css';
import Box from './Box.jsx';

let boardMatrix = [1, 2, 3, 4, 5, 6];

class App extends Component {
  constructor (props) {
    super (props);

    this.getIndex = this.getIndex.bind(this);
  };

  getIndex (e) {
    console.log('this is index', e);
  };

  render() {
    return (
      <div className="App">
        {boardMatrix.map((rowBox, index1) => {
          return boardMatrix.map((colBox, index2) => {
          return <Box key={index2} i={JSON.stringify([index1, index2])}  getIndex={this.getIndex} onClick={() => this.getIndex()} />
          })
        })}
      </div>
    );
  }
}

export default App;
