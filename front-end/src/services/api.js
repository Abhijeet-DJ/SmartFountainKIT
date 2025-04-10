// services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://kitfountain.ionode.cloud/api/'; // Adjust URL if needed

// ✅ Fetch Fountain Data by Query or Save Data if Query Exists
export const fetchOrSaveFountainData = async (queryParams = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data`, { params: queryParams });
        return response.data;
    } catch (error) {
        console.error('Error fetching/saving fountain data:', error);
        throw error;
    }
};
