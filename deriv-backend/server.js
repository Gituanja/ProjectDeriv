const express = require('express');  // Import Express
const axios = require('axios');      // Import Axios for API calls
const cors = require('cors');        // Import CORS to handle cross-origin requests

const app = express();  // Create an Express app instance
app.use(cors());        // Enable CORS for all requests
app.use(express.json()); // Middleware to parse JSON request bodies

// Define the route to fetch market data
app.get('/api/market-data/:market', async (req, res) => {
    const token = "YOUR_DERIV_API_TOKEN";  // Replace this with your Deriv API token
    const { market } = req.params;  // Extract market parameter from URL

    if (!market) {
        return res.status(400).json({ error: 'Market is required' });  // Error if market is missing
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.deriv.com/binary/v3',
            data: {
                ticks: market  // Pass the market parameter to the API
            },
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.data || response.data.error) {
            return res.status(500).json({ error: 'Failed to fetch data from Deriv API' });  // Error if API response fails
        }

        res.json(response.data);  // Send the API response back to the client
    } catch (error) {
        console.error('Error fetching market data:', error.message);
        res.status(500).json({ error: 'Error fetching data from Deriv API' });
    }
});

// Add this at the end of your routes to handle the default route
app.get('/', (req, res) => {
    res.send('Backend is running.');
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


app.post('/api/place-trade', async (req, res) => {
    const token = "hCJbKrOAgKMp3Jp";  // Replace with your actual token
    const { market, contractType, stake, duration } = req.body;

    if (!market || !contractType || !stake || !duration) {
        return res.status(400).json({ error: 'Missing trade parameters.' });
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.deriv.com/binary/v3',
            data: {
                proposal: 1,
                symbol: market,
                contract_type: contractType,
                amount: stake,
                duration: duration,
                basis: 'payout',
                currency: 'USD',
            },
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.data.error) {
            throw new Error(response.data.error.message);
        }

        res.json(response.data);
    } catch (error) {
        console.error('Error placing trade:', error.message);
        res.status(500).json({ error: 'Error placing trade' });
    }
});
app.get('/api/active-trades', async (req, res) => {
    const token = "YOUR_DERIV_API_TOKEN";  // Replace with your actual token

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.deriv.com/binary/v3',
            data: {
                portfolio: 1  // This API call fetches the user's active trades
            },
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.data.error) {
            throw new Error(response.data.error.message);
        }

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching active trades:', error.message);
        res.status(500).json({ error: 'Error fetching active trades' });
    }
});
