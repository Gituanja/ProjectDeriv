// File: src/api.js
import axios from 'axios';

export const fetchMarketData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/market-data');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching market data');
  }
};
