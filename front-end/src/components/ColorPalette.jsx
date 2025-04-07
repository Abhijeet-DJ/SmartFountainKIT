import React, { useRef, useEffect, useState } from "react";

export function ColorPalette({ color, onChange }) {
    const canvasRef = useRef(null);
    const [selectedColor, setSelectedColor] = useState(color);
    const [pointer, setPointer] = useState({ x: 75, y: 75 }); // Centered initially
    const radius = 75; // Wheel radius

    useEffect(() => {
        drawColorWheel();
    }, []);

    const drawColorWheel = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Create color wheel gradient
        for (let angle = 0; angle < 360; angle++) {
            const startAngle = (angle * Math.PI) / 180;
            const endAngle = ((angle + 1) * Math.PI) / 180;
            const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(startAngle) * radius, cy + Math.sin(startAngle) * radius);

            grad.addColorStop(0, `hsl(${angle}, 100%, 50%)`);
            grad.addColorStop(1, `hsl(${angle}, 100%, 50%)`);

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, endAngle, false);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();
        }
    };

    const handlePickColor = (event) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const dx = x - radius;
        const dy = y - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= radius) {
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const pickedColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

            setSelectedColor(pickedColor);
            setPointer({ x, y });
            onChange({ target: { value: rgbToHex(pixel[0], pixel[1], pixel[2]) } });
        }
    };

    const rgbToHex = (r, g, b) => {
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
    };

    return (
        <div id="ColorWheel" style={{ textAlign: "center", padding: "10px", position: "relative" }}>
            {/* Custom Color Wheel with Pointer */}
            <div style={{ position: "relative", display: "inline-block" }}>
                <canvas 
                    ref={canvasRef}
                    width={150}
                    height={150}
                    style={{ cursor: "crosshair", borderRadius: "50%" }}
                    onMouseDown={(e) => handlePickColor(e)}
                    onMouseMove={(e) => e.buttons === 1 && handlePickColor(e)}
                />
                {/* Pointer */}
                <div
                    style={{
                        position: "absolute",
                        width: "12px",
                        height: "12px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        border: "2px solid black",
                        transform: "translate(-50%, -50%)",
                        left: `${pointer.x}px`,
                        top: `${pointer.y}px`,
                        pointerEvents: "none",
                    }}
                />
            </div>
        </div>
    );
}
