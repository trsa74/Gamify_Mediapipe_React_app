import logo from './logo.svg';
// import {pscore} from './todo.js';
import './App.css';
import React from 'react';




function App() {
  
  const helloStyle = {color: "red"}
  const[score, setScore] = React.useState(0);
  const[message, setMessage] = React.useState("Keep Playing Games to earn Reward");
  
  React.useEffect(() => {
    setScore(JSON.parse(window.localStorage.getItem('count')));
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem('count', score);
  }, [score]);

  function gameOver(){
    setScore(score+5);
    // pscore = score;
  }
  function giftCard(){
    if(score>=50){
      setMessage("Here is your coupon code");
    }else{
      setMessage("Sorry, play more games");
    }
  }
  return (
    <>
      <h1> hello</h1>
      <p style = {helloStyle}> {score}</p>
      <p> {message} </p>
      <button onClick = {gameOver} > Add Points</button>
      <button onClick = {giftCard}> Generate</button >
      
    </>
  );
}

export default App;
