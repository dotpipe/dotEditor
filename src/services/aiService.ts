import axios from 'axios';

const AI_SERVICE_URL = 'https://api.example.com/ai'; // Replace with actual AI service URL

export const fetchSuggestions = async (input) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/suggestions`, { input });
        return response.data;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        throw error;
    }
};

export const fetchAutoComplete = async (input) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/autocomplete`, { input });
        return response.data;
    } catch (error) {
        console.error('Error fetching autocomplete:', error);
        throw error;
    }
};