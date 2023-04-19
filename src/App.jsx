import { useState, useEffect } from "react";
import "./App.css";
import Dice from "./Dice";
import { nanoid } from "nanoid";
import confetti from "canvas-confetti";

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  const handleConfetti = () => {
    tenzies && confetti();
  };

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setCount((old) => old + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      if (localStorage.getItem("tenzie-score") < count) {
        localStorage.setItem("tenzie-score", count);
      }
      setCount(0);
      handleConfetti();
      setTenzies(false);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Dice
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <div className="App">
      <div className="high-score">
        <div>Best Score {localStorage.getItem("tenzie-score") || 0}</div>
        <div>
          Current Score <span>{count}</span>
        </div>
      </div>
      <div className="container">
        <h1>Tenzies</h1>
        <p className="tenzies-text">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dice-container">{diceElements}</div>
        <button className="btn" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </div>
    </div>
  );
}

export default App;
