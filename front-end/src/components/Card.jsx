// components/Card.jsx
import React, { useState, useEffect } from 'react';
import { FountainImg } from './imageFountain';
import { PHGroup } from './PHGroup';
import { RGBGroup } from './RGBGroup';
import { WaterTemp } from './WaterTempGroup';
import { ButtonGroup } from './ButtonGroup';
import { GraphComponent } from './GraphComp';

export function Card({ id }) {
    const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
    const [fountainData, setFountainData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingRgb, setPendingRgb] = useState({ r: 0, g: 0, b: 0 });

    // ✅ Function to fetch data from DB
    const loadData = async () => {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();

            const selectedFountain = data.find(item => item.fountainId === id);
            if (selectedFountain) {
                setFountainData(selectedFountain);
                setRgb(selectedFountain.RGB || { r: 0, g: 0, b: 0 });
                setPendingRgb(selectedFountain.RGB || { r: 0, g: 0, b: 0 }); 
                console.log('Fetched data:', selectedFountain);
            } else {
                setError('No data available for this fountain.');
            }
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            console.log('Data loaded');
            setLoading(false);
        }
    };

    // ✅ Fetch data on mount
    useEffect(() => {
        loadData();
    }, [id]);

    const updateRGB = (newRgb) => {
        setPendingRgb(newRgb); // Buffer the data before final submission
        console.log('🟡 Pending RGB data:', newRgb);
    };

    const handleUpdateClick = async () => {
        try {
            console.log('✅ Sending RGB data:', JSON.stringify({ RGB: pendingRgb }));
    
            const response = await fetch(`/api/data/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ RGB: pendingRgb })
            });
    
            const result = await response.json();
            console.log('✅ Response from server:', result);
    
            if (!response.ok) throw new Error(result.message || 'Failed to update RGB values');
    
            // ✅ Update state immediately to reflect change
            setRgb(pendingRgb); 
            
            console.log('✅ RGB Updated Successfully');
    
            // ✅ Refresh the page after successful update
            setTimeout(() => {
                window.location.reload();
            }, 100); // Delay to ensure UI updates before reload
        } catch (error) {
            console.error('❌ Error updating RGB data:', error.message);
        }
    };
    
    

    useEffect(() => {
        console.log('FountainData updated:', fountainData);
    }, [fountainData]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="Card">
            <FountainImg rgb={fountainData?.RGB ?? { r: 0, g: 0, b: 0 }} />
            <PHGroup TDS={fountainData?.TDS ?? 0} PH={fountainData?.PH ?? 0} Turbidity={fountainData?.Turbidity ?? 0} />
            <WaterTemp temp={fountainData?.waterTemperature ?? 0} level={fountainData?.waterLevel ?? 0} />
            <RGBGroup setRgb={updateRGB} fountainId={id} />
           
            <GraphComponent weeklyData={fountainData.weeklyData} />
            <ButtonGroup fountainId={fountainData.fountainId} />
            <button id={id+"UpdateRGB"}
                onClick={handleUpdateClick} 
                style={{ marginTop: '1em', padding: '0.5em 1.5em', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', }}
                //  position : 'relative' , left : '33%' , top : '-5%'
            >
                Update RGB
            </button>
        </div>
    );
}
