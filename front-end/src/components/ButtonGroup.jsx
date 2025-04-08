import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { fetchOrSaveFountainData } from '../services/api';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:1407/api'; // Adjust if needed

export function ButtonGroup({ fountainId }) {
    const [RGBStatus, setRGBStatus] = useState(false);
    const [pumpStatus, setPumpStatus] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            if (!fountainId) {
                console.error('❌ No fountainId provided to ButtonGroup!');
                return;
            }

            try {
                const data = await fetchOrSaveFountainData();
                console.log('🟢 API Response:', data);

                const fountain = data.find(item => 
                    item.fountainId?.trim().toLowerCase() === fountainId.trim().toLowerCase()
                );

                if (fountain) {
                    console.log('✅ Found Fountain:', fountain);
                    setRGBStatus(fountain.RGBStatus);
                    setPumpStatus(fountain.pumpStatus);
                } else {
                    console.error(`❌ No matching fountain found for ID: ${fountainId}`);
                    console.log('Available Fountain IDs:', data.map(f => f.fountainId));
                }
            } catch (error) {
                console.error('❌ Error fetching status:', error);
            }
        };

        fetchStatus();
    }, [fountainId]);

    // ✅ Function to update status in backend
    const toggleStatus = async (statusType, currentValue, setState, fountainId) => {
        if (!fountainId) {
            console.error('❌ fountainId is missing! Cannot update status.');
            return;
        }
    
        const newValue = !currentValue;
        
        let requestBody = {};
    
        if (statusType === 'RGBStatus') {
            requestBody = { RGBStatus: newValue };
        } else if (statusType === 'pumpStatus') {
            requestBody = { pumpStatus: newValue };
        } else {
            console.error(`❌ Invalid status type: ${statusType}`);
            return;
        }
    
        try {
            const response = await axios.put(
                `${API_BASE_URL}/data/${fountainId}`, 
                requestBody, 
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            if (response.status === 200) {
                console.log(`✅ ${statusType} updated successfully:`, response.data);
                setState(newValue);
            } else {
                console.error(`❌ Failed to update ${statusType}:`, response);
            }
        } catch (error) {
            console.error(`❌ Error updating ${statusType}:`, error.response?.data || error.message);
        }
    };
    

    return (
        <div className="ButtonGroup">
            <Button 
                value={RGBStatus ? 'On' : 'Off'} 
                id="RGB_ON_OFF" 
                name={`RGB: ${RGBStatus ? 'On' : 'Off'}`} 
                color={RGBStatus ? 'green' : 'red'}
                onClick={() => toggleStatus('RGBStatus', RGBStatus, setRGBStatus,fountainId)}
            />
            <Button 
                value={pumpStatus ? 'On' : 'Off'} 
                id="PUMP_ON_OFF" 
                name={`PUMP: ${pumpStatus ? 'On' : 'Off'}`}
                color={pumpStatus ? 'green' : 'red'} 
                onClick={() => toggleStatus('pumpStatus', pumpStatus, setPumpStatus,fountainId)}
            />
        </div>
    );
}
