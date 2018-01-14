import React, { Component } from 'react';
import '../styles/App.css';

const Box = (props) => {
    return (
      <div className="board-container" onClick={() => {props.getIndex(props.i)}}>
        <div className="box">

        </div>
      </div>
    )

};

export default Box;