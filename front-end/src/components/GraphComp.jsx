import { useState, useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export function GraphComponent({ weeklyData }) {
    // Transform the `weeklyData` map into an array usable by Recharts
    const chartData = useMemo(() => {
        if (!weeklyData) return [];

        // Map through week days in desired order
        const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return daysOrder
            .map(day => {
                const entry = weeklyData[day];
                return entry
                    ? {
                          day,
                          temperature: entry.Temperature,
                          turbidity: entry.Turbidity,
                      }
                    : null;
            })
            .filter(Boolean); // remove any null entries
    }, [weeklyData]);

    const [zoom, setZoom] = useState({ start: 0, end: 7 });

    const handleScroll = (event) => {
        event.preventDefault();
        const step = 1;
        let newStart = zoom.start;
        let newEnd = zoom.end;

        if (event.deltaY > 0) {
            if (newEnd - newStart > 3) {
                newStart = Math.min(newStart + step, chartData.length - 3);
                newEnd = Math.max(newEnd - step, newStart + 3);
            }
        } else {
            newStart = Math.max(newStart - step, 0);
            newEnd = Math.min(newEnd + step, chartData.length);
        }

        setZoom({ start: newStart, end: newEnd });
    };

    return (
        <div id="ElemGraph" onWheel={handleScroll}>
            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData.slice(zoom.start, zoom.end)}>
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
                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#FF5733"
                        fill="rgba(255, 87, 51, 0.5)"
                    />
                    <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="turbidity"
                        stroke="#3498DB"
                        fill="rgba(52, 152, 219, 0.5)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
