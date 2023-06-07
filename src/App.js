import React from 'react';
import './App.css';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';


function App() {
  const [diceNumbArr, setDiceNumbArr] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);

  // function checkIfAllSame() {
  //   const firstDiceNum = diceNumbArr[0].value;
  //   for (let i = 0; i < diceNumbArr.length; i++) {
  //     if (!diceNumbArr[i].isHeld) return false;
  //     if (firstDiceNum !== diceNumbArr[i].value) return false;
  //   }
  //   return true;
  // }

  React.useEffect(() => {
    const allHeld = diceNumbArr.every(die => die.isHeld); // every() array method checks every dice, if every is held the method returns 'true' else 'false'... 
    const firstDiceNum = diceNumbArr[0].value;

    // every() takes a callback fnc. and if the function(condition) is satisfied for every element in the array, it returns 'true' else returns 'false'...
    const allSameValue = diceNumbArr.every(die => die.value === firstDiceNum);

    if (allHeld && allSameValue) {
      setTenzies(true);
      console.log("You won!");
    }
  }, [diceNumbArr]);

  // helper function to generate New Die object...
  function generateDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6), 
      isHeld: false
    }
  }
  function allNewDice() {
    const randomDice = [];
    for (let i = 0; i < 10; i++) {
      randomDice.push(generateDie());
    }
    return randomDice;
  }

  function rollDice() {
    setDiceNumbArr(prevDiceArr => prevDiceArr.map(dice => {
      return dice.isHeld ? 
      dice : 
      generateDie()
    }));
  }

  function newGame() {
    setDiceNumbArr(allNewDice());
    setTenzies(false);
  }

  function holdDice(id) {
    setDiceNumbArr(prevDiceArr => {
      return prevDiceArr.map(dice => 
        dice.id === id ? 
        {...dice, isHeld: !dice.isHeld} : dice
      );
    })
  }

  const diceElements = diceNumbArr.map(die => <Die 
    key={die.id}
    value={die.value} 
    isHeld={die.isHeld}
    holdDice={() => holdDice(die.id)}
    />);

  return (
    <main className='main'>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='dice-container'>
          {diceElements}
      </div>
      <button className='roll-btn' onClick={tenzies ? newGame : rollDice}>{tenzies ? 'New Game' : 'Roll'}</button>
    </main>
  );
}

export default App;