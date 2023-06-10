import React, {useState, useEffect} from 'react';
import './App.css';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

function App() {
  const [diceNumbArr, setDiceNumbArr] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [countRoll, setCountRoll] = useState(0);
  const [timer, setTimer] = useState(0);

  const storedBestTime = localStorage.getItem('best_timer');
  const [bestTime, setBestTime] = useState(() => JSON.parse(storedBestTime) || 0);  // using function inside the state to render only once when the page is rendered...

  const storedLeastRolls = localStorage.getItem('least_rolls');
  const [leastRolls, setLeastRolls] = useState(() => JSON.parse(storedLeastRolls) || 0);

  useEffect(() => {
    const allHeld = diceNumbArr.every(die => die.isHeld); // every() array method checks every dice, if every is held the method returns 'true' else 'false'... 
    const firstDiceNum = diceNumbArr[0].value;

    // every() takes a callback fnc. and if the function(condition) is satisfied for every element in the array, it returns 'true' else returns 'false'...
    const allSameValue = diceNumbArr.every(die => die.value === firstDiceNum);

    if (allHeld && allSameValue) {
      setTenzies(true);
      if (timer < bestTime || bestTime <= 0) localStorage.setItem('best_timer', JSON.stringify(timer));
      // set the timer and leastRolls if it is the first time when the bestTime and leastRolls are 0s with "|| besTime <= 0"...
      if (countRoll < leastRolls || leastRolls <= 0) localStorage.setItem('least_rolls', JSON.stringify(countRoll));
    }
  }, [diceNumbArr]);

  useEffect(() => {
    let timeoutID;
    if (!tenzies) {
      timeoutID = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000)
    }
    
    setBestTime(JSON.parse(localStorage.getItem('best_timer')));
    setLeastRolls(JSON.parse(localStorage.getItem('least_rolls')));

    return () => clearInterval(timeoutID);  // preventing the memory leakage...
}, [tenzies]);  // the useEffect will look for the tenzies and whenever the tenzies will change it will re-render the use-Effect which will stop the timer as the tenzies is TRUE clearing the INTERVAL...

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
    setCountRoll(prevCount => prevCount + 1);
    // setHasRoll(true);

    setDiceNumbArr(prevDiceArr => prevDiceArr.map(dice => {
      return dice.isHeld ? 
      dice : 
      generateDie()
    }));
  }
  function newGame() {
    setDiceNumbArr(allNewDice());
    setTenzies(false);
    setCountRoll(0);
    setTimer(0);
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

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const bestMinutes = Math.floor(bestTime / 60);
  const bestSeconds = bestTime % 60;

  return (
    <main className='main'>
      <div className='scores'>
        <p>Best time: 
          <span> 
            {(bestMinutes < 10) ? 
            `0${bestMinutes}`: 
            bestMinutes}
          </span>:
          <span>
            {(bestSeconds < 10) ?
           `0${bestSeconds}`:
            bestSeconds}s
          </span>
        </p>
        <p>Least rolls: <span>{leastRolls}</span></p>
      </div>
      <div className='timer'>
        <span>{(minutes < 10) ? `0${minutes}`: minutes}</span>
         : 
        <span>{(seconds < 10) ? `0${seconds}` : seconds}</span>
      </div>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='dice-container'>
          {diceElements}
      </div>
      <button className='roll-btn' onClick={tenzies ? newGame : rollDice}>{tenzies ? 'New Game' : 'Roll'}</button>
      <p className='rolls'>Rolls: {countRoll}</p>
    </main>
  );
}

export default App;

/* initial state of bestTimer and leastRolls are not set to 0...*/