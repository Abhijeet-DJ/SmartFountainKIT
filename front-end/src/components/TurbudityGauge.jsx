import React from "react";
import { SmallWidgets } from "./smallWidgets"; // Ensure correct import

export const TurbidityGauge = ({ value }) => {
    const maxValue = 500; // Maximum turbidity
    const radius = 80; // Arc radius
    const strokeWidth = 10; // Arc thickness
    const centerX = 120; // Center X
    const centerY = 140; // Center Y
    const totalArcSpan = 252; // 70% of 360° 
    const startAngle = -216; // Rotated 90° clockwise
    const endAngle = startAngle + totalArcSpan; // Ending angle

    // Map value to an angle within the 70% arc range
    const angle = startAngle + (value / maxValue) * totalArcSpan;

    // Convert polar coordinates to cartesian (for SVG positioning)
    const polarToCartesian = (cx, cy, r, angleDeg) => {
        const angleRad = (Math.PI / 180) * angleDeg;
        return {
            x: cx + r * Math.cos(angleRad),
            y: cy + r * Math.sin(angleRad),
        };
    };

    // Define the full 70% arc path
    const fullArcStart = polarToCartesian(centerX, centerY, radius, startAngle);
    const fullArcEnd = polarToCartesian(centerX, centerY, radius, endAngle);
    const fullArcPath = `
        M ${fullArcStart.x} ${fullArcStart.y}
        A ${radius} ${radius} 0 1 1 ${fullArcEnd.x} ${fullArcEnd.y}
    `;

    // Define the dynamic arc path based on value
    const arcEnd = polarToCartesian(centerX, centerY, radius, angle);
    const largeArcFlag = (angle - startAngle) >= 180 ? 1 : 0;
    const arcPath = `
        M ${fullArcStart.x} ${fullArcStart.y}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${arcEnd.x} ${arcEnd.y}
    `;

    return (
        <div id={"TurbudityGauge"} style={{ position: "relative", width: "220px", height: "240px", display: "flex", justifyContent: "center" }}>
            {/* SVG Gauge */}
            <svg width="200" height="200" viewBox="0 0 240 180" id={"TurbGaugeSvg"}>
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="turbidityGradient" x1="0%" y1="0%" x2="0%" y2="100%" gradientTransform="rotate(90, .5, .5)">
                        <stop offset="0" stopColor="rgba(117, 81, 255, 0)" />  {/* Transparent */}
                        <stop offset="100%" stopColor="#582CFF" />  {/* Deep purple */}
                    </linearGradient>
                </defs>

                {/* Background Arc (Full 70% Circle) */}
                <path
                    d={fullArcPath}
                    fill="none"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Dynamic Gradient Arc */}
                <path
                    d={arcPath}
                    fill="none"
                    stroke="url(#turbidityGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Turbidity Value */}
                <text x="120" y="160" fontSize="18" fontWeight="bold" textAnchor="middle" fill="black">
                    {value} NTU
                </text>
            </svg>

            {/* Wider SmallWidgets Positioned Below the Arc */}
            <div style={{
                position: "absolute",
                bottom: "8px", // Adjusted for spacing
                left: "50%",
                width: "220px", // Make it wider than the SVG
                transform: "translateX(-50%)",
                textAlign: "center",
            }}>
                <SmallWidgets name="Turbidity" id="Turbidity" value={value} />
            </div>
        </div>
    );
};
