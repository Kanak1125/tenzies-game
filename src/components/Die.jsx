import React from 'react'
import './die.css';
import Cell from './Cell';

const Die = ({id, value, isHeld, holdDice}) => {
  const styles = {
    backgroundColor: isHeld ? "#59E391" : "white"
  }

  let cellElements = [];
  for (let i = 0; i < 9; i++) {
    cellElements.push(<Cell key={i}/>);
  }

  console.log(cellElements);
  return (
    <div className={`die-face die-${value}`} style={styles} onClick={holdDice}>
      {cellElements}
    </div>
  )
}

export default Die