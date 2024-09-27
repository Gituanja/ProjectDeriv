import axios from 'axios';

export default async function handler(req, res) {
  const token = process.env.DERIV_API_TOKEN;  // Use environment variable
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

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error placing trade:', error.message);
    res.status(500).json({ error: 'Error placing trade' });
  }
}
