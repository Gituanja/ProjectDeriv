import axios from 'axios';

export default async function handler(req, res) {
  const token = process.env.DERIV_API_TOKEN;  // Use environment variable
  const { market } = req.query;  // Access query parameter

  if (!market) {
    return res.status(400).json({ error: 'Market is required' });
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
      return res.status(500).json({ error: 'Failed to fetch data from Deriv API' });
    }

    res.status(200).json(response.data);  // Return the data
  } catch (error) {
    console.error('Error fetching market data:', error.message);
    res.status(500).json({ error: 'Error fetching market data' });
  }
}
