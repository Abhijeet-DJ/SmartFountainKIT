import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const initialData = [
    { day: "Mon", temperature: 22, turbidity: 5 },
    { day: "Tue", temperature: 24, turbidity: 8 },
    { day: "Wed", temperature: 27, turbidity: 12 },
    { day: "Thu", temperature: 29, turbidity: 15 },
    { day: "Fri", temperature: 26, turbidity: 10 },
    { day: "Sat", temperature: 30, turbidity: 18 },
    { day: "Sun", temperature: 32, turbidity: 20 }
];

export function GraphComponent() {
    const [zoom, setZoom] = useState({ start: 0, end: initialData.length });

    const handleScroll = (event) => {
        event.preventDefault();
        const step = 1; // Zoom sensitivity
        let newStart = zoom.start;
        let newEnd = zoom.end;

        if (event.deltaY > 0) {
            // Zoom in
            if (newEnd - newStart > 3) {
                newStart = Math.min(newStart + step, initialData.length - 3);
                newEnd = Math.max(newEnd - step, newStart + 3);
            }
        } else {
            // Zoom out
            newStart = Math.max(newStart - step, 0);
            newEnd = Math.min(newEnd + step, initialData.length);
        }

        setZoom({ start: newStart, end: newEnd });
    };

    return (
        <div id="ElemGraph" onWheel={handleScroll}>
            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={initialData.slice(zoom.start, zoom.end)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis
                        yAxisId="left"
                        label={{
                            value: "Temperature (°C)",
                            angle: -90,
                            position: "insideLeft",
                            dy: 75,
                            fill: "#FF5733"
                        }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                            value: "Turbidity (NTU)",
                            angle: 90,
                            position: "insideRight",
                            dy: 70,
                            fill: "#3498DB"
                        }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none", color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                    />
                    <Area yAxisId="left" type="monotone" dataKey="temperature" stroke="#FF5733" fill="rgba(255, 87, 51, 0.5)" />
                    <Area yAxisId="right" type="monotone" dataKey="turbidity" stroke="#3498DB" fill="rgba(52, 152, 219, 0.5)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}