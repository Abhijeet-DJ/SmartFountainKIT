import { useState, useEffect } from "react";
import { SmallWidgets } from "./smallWidgets";
import { ColorPalette } from "./ColorPalette";
import { fetchOrSaveFountainData } from "../services/api";

export function RGBGroup({ setRgb, fountainId }) {
    const [rgb, localSetRgb] = useState({ r: 0, g: 0, b: 0 });

    console.log('Fountain Id', fountainId);

    // ✅ Fetch RGB data on component mount
    useEffect(() => {
        const loadRgbData = async () => {
            try {
                const data = await fetchOrSaveFountainData({ fountainId });
                console.log("Fetched Data For RGB (Raw API Response):", data?.data?.RGB);
        
                if (data?.data?.RGB) {
                    const rgbData = {
                        r: data.data.RGB.R ?? 0,
                        g: data.data.RGB.G ?? 0,
                        b: data.data.RGB.B ?? 0
                    };
        
                    localSetRgb(rgbData);
                    setRgb(rgbData);
                } else {
                    console.warn("No RGB data found in response.");
                }
            } catch (error) {
                console.error("Error fetching RGB data:", error);
            }
        };
        

        loadRgbData();
    }, [fountainId]);  // ✅ Removed `setRgb` from dependency array (it's a stable reference)

    const handleColorChange = (event) => {
        const color = event.target.value;
        const r = parseInt(color.substring(1, 3), 16);
        const g = parseInt(color.substring(3, 5), 16);
        const b = parseInt(color.substring(5, 7), 16);

        const newRgb = { r, g, b };

        localSetRgb(newRgb);
        setRgb(newRgb);
        console.log("Updated RGB:", newRgb);
    };

    return (
        <div className="RGBGroup">
            <SmallWidgets name="RGB Value" id="RGBValue">
                <hr style={{ width: "47%" }} />
                <p>R: {rgb.r}</p>
                <p>G: {rgb.g}</p>
                <p>B: {rgb.b}</p>
                <SmallWidgets id="ColorPalate">
                    <ColorPalette 
                        color={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} 
                        onChange={handleColorChange} 
                    />
                </SmallWidgets>
            </SmallWidgets>
        </div>
    );
}
