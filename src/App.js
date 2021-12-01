
import "./App.css";
import React, { Fragment, useState, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import {Hands} from '@mediapipe/hands'
import * as handss from '@mediapipe/hands'
import * as cam from '@mediapipe/camera_utils'
import Webcam from "react-webcam";
import { useRef } from "react";
import img1 from './images/hands_instruction.png';


const unityContext = new UnityContext({
  productName: "React Unity WebGL game",
  companyName: "OENA Storms",
  loaderUrl: "/MyntraGame3/Build/MyntraGame3.loader.js",
  dataUrl: "/MyntraGame3/Build/MyntraGame3.data",
  frameworkUrl: "/MyntraGame3/Build/MyntraGame3.framework.js",
  codeUrl: "/MyntraGame3/Build/MyntraGame3.wasm",
  //streamingAssetsUrl: "Build/streamingassets",

  webglContextAttributes: {
    preserveDrawingBuffer: true,
  },
});

function App() {
  ///////////
  const webcamref = useRef(null)
  const canvasref = useRef(null)

  function onResults(results){
    
    
    //console.log(results.multiHandLandmarks)

    canvasref.current.width = webcamref.current.video.videoWidth
    canvasref.current.height = webcamref.current.video.videoHeight

    const canvasElement = canvasref.current;
    const canvasCtx = canvasElement.getContext("2d")
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        window.drawConnectors(canvasCtx, landmarks, handss.HAND_CONNECTIONS,
                      {color: '#00FF00', lineWidth: 5});
        window.drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
        

        //console.log(landmarks[8].y, landmarks[6].y)
        
        
        //var spaceEvnt = new KeyboardEvent('keypress', {'keyCode': 32, 'which': 32});
        
        
        //move left 
        if(landmarks[8].y < landmarks[7].y && landmarks[12].y > landmarks[11].y){
          console.log("move left")
          var leftEvnt = new KeyboardEvent('keydown', {'keyCode': 37, 'which': 37});
          window.dispatchEvent(leftEvnt);

          var uleftEvnt = new KeyboardEvent('keyup', {'keyCode': 37, 'which': 37});
          window.dispatchEvent(uleftEvnt);
        }
        //move right 
        else if(landmarks[8].y < landmarks[7].y && landmarks[12].y < landmarks[11].y){
          console.log("move right")
          var rightEvnt = new KeyboardEvent('keydown', {'keyCode': 39, 'which': 39});
          window.dispatchEvent(rightEvnt);
          
          var urightEvnt = new KeyboardEvent('keyup', {'keyCode': 39, 'which': 39});
          window.dispatchEvent(urightEvnt);
        }
        //jump
        else if(landmarks[4].x < landmarks[3].x){
          console.log("jump")
          var jumpEvnt = new KeyboardEvent('keydown', {'keyCode': 38, 'which': 38});
          window.dispatchEvent(jumpEvnt);

          var ujumpEvnt = new KeyboardEvent('keyup', {'keyCode': 38, 'which': 38});
          window.dispatchEvent(ujumpEvnt);
        }

      }
    }
    canvasCtx.restore();
  
  }

  useEffect(() => {
      const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    })

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
      selfieMode: true
    })

    hands.onResults(onResults);

    const camera = new cam.Camera(webcamref.current.video, {
      onFrame: async () => {
        await hands.send({image: webcamref.current.video});
      },
      width: 250,
      height: 300
    });
    camera.start();

  })
  /////////////

  const[GainedScore, setGainedScore] = useState(0);
  const[message, setMessage] = useState("Keep Playing Games to earn Reward");

  useEffect(() => {
    setGainedScore(JSON.parse(window.localStorage.getItem('count')));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('count', GainedScore);
  }, [GainedScore]);

  function giftCard(){
    if(GainedScore >= 10 && GainedScore < 15){
      setMessage("Here's your BRONZE coupon code: OENA_Storms_110");
    } else if(GainedScore >= 15 && GainedScore < 20){
      setMessage("Here's your SILVER coupon code: OENA_Storms_111");
    } else if(GainedScore >= 20 && GainedScore < 25){
      setMessage("Here's your GOLD coupon code: OENA_Storms_112");
    }else if(GainedScore >= 25){
      setMessage("Here's your PLATINUM coupon code: OENA_Storms_113");
    } else{
      setMessage("Sorry, you do not have enough points");
    }
  }

  function defaultReward(){
    setMessage("Keep Playing Games to earn Reward");
  }

  function resetPoints(){
    setGainedScore(GainedScore * 0);
  }

  ////////////////
  

  ////////////////

  const [isUnityMounted, setIsUnityMounted] = useState(true);
  const [progression, setProgression] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [has_returned_score, sethasReturnScore] = useState("0");

  useEffect(function () {
    unityContext.on("ReturnScore", handleScoreCount);
    return function () {
      unityContext.removeAllEventListeners();
    };
  }, []);

  useEffect(function () {
    unityContext.on("canvas", function (canvas) {
      //canvas.width = 100;
      //canvas.height = 50;
    });
  }, []);

  useEffect(() => {
    unityContext.on("progress", handleOnUnityProgress);
    unityContext.on("loaded", handleOnUnityLoaded);
    unityContext.on("canvas", handleOnUnityCanvas);
    //unityContext.on("score", handleOnUnityScores);
    
    return function () {
      unityContext.removeAllEventListeners();
    };
  }, []);



  function handleScoreCount(score) {
    sethasReturnScore(score);
  }

  function handleOnUnityCanvas(canvas) {
    canvas.setAttribute("role", "unity-canvas");
  }

  function handleOnUnityProgress(progression) {
    setProgression(progression);
  }

  function handleOnUnityLoaded() {
    setIsLoaded(true);
  }

  function handleOnClickUnMountUnity() {
    if (isLoaded === true) {
      setIsLoaded(false);
      setGainedScore(GainedScore + parseInt(has_returned_score,10));
    }
    setIsUnityMounted(isUnityMounted === false);
    // className="wrapper"
    
  }

  return (
    

    <Fragment>

      <div
      style={{
        position: 'absolute',
        marginRight: 'auto',
        marginLeft: 'auto',
        left: 0,
        right: 1700,
        textAlign: 'center',
        zIndex: 9,
        
      }}>
        <img src={img1} height={400} width={300} alt=""/>
      </div>
      

      <div className="App">
        <Webcam 
        hidden
        ref={webcamref}
        style={{
          position: 'absolute',
          marginRight: 'auto',
          marginLeft: 'auto',
          left: 1100,
          right: 0,
          textAlign: 'center',
          zIndex: 9,
          width: 250,
          height: 300
        }}/>

        <canvas 
        ref={canvasref}
        style={{
          position: 'absolute',
          marginRight: 'auto',
          marginLeft: 'auto',
          left: 1100,
          right: 0,
          textAlign: 'center',
          zIndex: 9,
          width: 250,
          height: 300
        }}></canvas>

      </div>

      <div className="wrapper">
        {/* Introduction text */}
        <h1>Shreyas</h1>
        {/* The Unity container */}
        <button onClick={() => {handleOnClickUnMountUnity(); defaultReward();}}>(Un)mount Unity</button>
        <button  onClick = {giftCard} > Generate</button >
        <button  onClick = {() => {resetPoints(); defaultReward();}}> Reset Points</button >
        {/* <button onClick={handleOnClickFullscreen}>Fullscreen</button> */}
        

        <p > Total Gained Points: <b>{GainedScore} </b> </p>
        <p > <b> {message} </b> </p>
        


        {isUnityMounted === true && (
          <Fragment>
            <div className="unity-container">
              {/* The loading screen will be displayed here. */}
              {isLoaded === false && (
                <div className="loading-overlay">
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: progression * 100 + "%" }}
                    />
                  </div>
                  
                </div>
              )}
              {/* The Unity app will be rendered here. */}
              <p>Loading {progression * 100} percent...</p>
               {/* {isGameOver === true && <p>{`Game Over! ${score} points`}</p>} */}
                 
                
              <Unity className="unity-canvas" 
              unityContext={unityContext}
              matchWebGLToCanvasSize={false}
              style={{ width: "600px", height: "338.03px"}} />
            </div>
            {/* Displaying some output values */}
            <p style={{fontSize:20}}>
              Points: <b>{has_returned_score}</b>
            </p>
          </Fragment>
        )}
        
      </div>
    </Fragment>
  );
}

export default App;
