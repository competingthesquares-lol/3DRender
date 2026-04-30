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
        const Points = [
            {x: 0.5, y: 0.5, z: 0.5},
            {x: -0.5, y: 0.5, z: 0.5},
            {x: -0.5, y: -0.5, z: 0.5},
            {x: 0.5, y: -0.5, z: 0.5},

            {x: 0.5, y: 0.5, z: -0.5},
            {x: -0.5, y: 0.5, z: -0.5},
            {x: -0.5, y: -0.5, z: -0.5},
            {x: 0.5, y: -0.5, z: -0.5}
        ];
        const Lines = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7]
        ];
        const Polygon = [
            {p: [0, 1, 2, 3], color: "#FFCD00"},
            {p: [7, 6, 5, 4], color: "#FFFFFF"},
            {p: [1, 0, 4, 5], color: "#078446"},
            {p: [2, 1, 5, 6], color: "#800020"},
            {p: [3, 2, 6, 7], color: "#1E44D9"},
            {p: [0, 3, 7, 4], color: "#FFA500"}
        ];
        const screen = (p) => {
            return {x: (p.x+1) / 2 * canvas.width, y: (1-(p.y+1) / 2) * canvas.height};
        };
        const point = ({x, y}) => {
            ctx.fillStyle = "#50FF50";
            ctx.fillRect(x-10, y-10, 20, 20);
        };
        const drawLine = (p1, p2, color) => {
            ctx.lineWidth = 3;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        };
        const clear = () => {
            ctx.fillStyle = "#101010";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        const project = ({x, y, z}) => {
            return {x: x/z, y: y/z};
        };
        const translate_z = ({x, y, z}, dz) => {
            return {x, y, z: z+dz};
        };
        const rotate_xz = ({x, y, z}, angle) => {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return {
                x: x*c - z*s,
                y,
                z: x*s + z*c
            };
        };
        const rotate_xy = ({x, y, z}, angle) => {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return {
                x: y*s + x*c,
                y: y*c - x*s,
                z
            };
        };

        const rotate_yz = ({x, y, z}, angle) => {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return {
                x,
                y: z*s + y*c,
                z: z*c - y*s
            };
        };
        const FPS = 60;
        const dz = 2.0;
        let angle = 0;
        let varHue = 0;
        let color = 0;

        const render = () => {
            //const dt = 1/FPS;
            //angle += Math.PI * dt;
            angle += 0.05;
            varHue = (varHue + 1) % 360;
            clear();
            const transformedPoints = Points.map(pRaw => {
                const rotated = rotate_xy(rotate_xz(rotate_yz(pRaw, angle), 0.5 * angle), 0.5 * angle);
                const translated = translate_z(rotated, dz);
                const projected = project(translated);
                return screen(projected);
            });
            /**
            ctx.strokeStyle = `hsl(${varHue}, 100%, 50%)`;
            Lines.forEach(indices => {
                ctx.beginPath();
                indices.forEach((pIdx, i) => {
                    const p = transformedPoints[pIdx];
                    if (i===0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                if (indices.length > 2) ctx.closePath();
                ctx.stroke();
            });
            **/
            Polygon.forEach(poly => {
                const p = poly.p.map(idx => transformedPoints[idx]);
                ctx.beginPath();
                ctx.moveTo(p[0].x, p[0].y);
                for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
                ctx.closePath();
                const isVisible = (p[1].x - p[0].x) * (p[2].y - p[1].y) - (p[2].x - p[1].x) * (p[1].y - p[0].y) >= 0;
                if (isVisible) {
                    ctx.fillStyle = poly.color;
                    ctx.fill();
                    ctx.stroke();
                }
            });
            animationFrameId = requestAnimationFrame(render); 
        };
        render();
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    return <canvas ref = {canvasRef} width={1024} height = {768} />;
}

function App() {
    const [count, setCount] = useState(0);
    useEffect(() => {
      fetch('/api/message')
        .then(res => res.json())
        .then(data => console.log(data.message));
    }, []);
    return (
        <>
            <h1> Canvas + React </h1>
            <input type = "text" name = "component" placeholder = "component..."/>
            <CanvasAnimation/>
        </>
    );
}

export default App;
