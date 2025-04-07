import React from "react";

export function TempGauge({ value }) {
    const maxValue = 60; // Max temperature (adjustable)
    const radius = 92.5; // Radius of the gauge
    const strokeWidth = 15; // Thickness of the arc
    const circumference = 2 * Math.PI * radius; // Full circle length
    const arcSpan = 0.7 * circumference; // 70% of the full circle
    const dashOffset = arcSpan - (value / maxValue) * arcSpan; // Calculate offset

    return (
        <div className="WaterTempGaugeBox" style={{ position: "relative", width: "100px", height: "100px" }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="100 100 200 200"
                style={{
                    transform: "rotate(-90deg)", // Rotate to start from the left
                    overflow: "visible",
                }}
            >
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%" gradientTransform="rotate(90, .5, .5)">
                        <stop offset="0" stopColor="rgba(0, 255, 187, 0)" />
                        <stop offset="100%" stopColor="#05CD99" />
                    </linearGradient>
                </defs>

                {/* Background Circle (Transparent) */}
                <circle cx="200" cy="200" r={radius} stroke="transparent" strokeWidth={strokeWidth} fill="none" />

                {/* Foreground Arc (Dynamic) */}
                <circle
                    cx="200"
                    cy="200"
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeDasharray={arcSpan}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    stroke="url(#tempGradient)"
                    style={{
                        transition: "stroke-dashoffset 400ms ease-in-out",
                    }}
                />
            </svg>

            {/* Temperature Value Display */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#05CD99",
                }}
            >
                {value}°C
            </div>
        </div>
    );
}
