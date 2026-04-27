import React, { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import './App.css';

function CanvasAnimation () {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        const Point = [
            {x: 0.25, y: 0.25, z: 0.25},
            {x: -0.25, y: 0.25, z: 0.25},
            {x: -0.25, y: -0.25, z: 0.25},
            {x: 0.25, y: -0.25, z: 0.25},

            {x: 0.25, y: 0.25, z: -0.25},
            {x: -0.25, y: 0.25, z: -0.25},
            {x: -0.25, y: -0.25, z: -0.25},
            {x: 0.25, y: -0.25, z: -0.25}
        ];
        const Line = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7]
        ];
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'blue';
        };
        render();
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    return <canvas ref = {canvasRef} width={1024} height = {768} />;
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1> Canvas + React </h1>
      <CanvasAnimation/>
    </>
  );
};

export default App;
