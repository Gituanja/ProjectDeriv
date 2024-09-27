import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [market, setMarket] = useState('R_100');  // Default market
  const [marketData, setMarketData] = useState(null);
  const [tradeData, setTradeData] = useState({
    contractType: 'CALL',  // Default contract type
    stake: 10,  // Default stake
    duration: 5  // Default duration (in ticks)
  });
  const [tradeResult, setTradeResult] = useState(null);  // Store trade result
  const [activeTrades, setActiveTrades] = useState([]);  // Store active trades
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch active trades on component mount
    fetchActiveTrades();
  }, []);

  const fetchMarketData = (market) => {
    setLoading(true);
    setError(null);
    setMarketData(null);

    axios.get(`http://localhost:5000/api/market-data/${market}`)
      .then(response => {
        if (response.data && response.data.error) {
          throw new Error(response.data.error.message);
        }
        setMarketData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch market data. Please enter a valid market.');
        setLoading(false);
      });
  };

  const fetchActiveTrades = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/active-trades')
      .then(response => {
        setActiveTrades(response.data.active_positions);  // Assuming active trades are returned in this key
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch active trades.');
        setLoading(false);
      });
  };

  const handleTrade = (e) => {
    e.preventDefault();
    setLoading(true);
    setTradeResult(null);  // Reset previous trade result

    axios.post('http://localhost:5000/api/place-trade', {
      market,
      contractType: tradeData.contractType,
      stake: tradeData.stake,
      duration: tradeData.duration
    })
      .then(response => {
        setTradeResult(response.data);  // Store trade result to display summary
        alert('Trade placed successfully: ' + JSON.stringify(response.data));
        setLoading(false);
        fetchActiveTrades();  // Update active trades after placing trade
      })
      .catch(err => {
        setError('Failed to place trade.');
        setLoading(false);
      });
  };

  const handleTradeChange = (e) => {
    setTradeData({
      ...tradeData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (market.trim() === '') {
      setError('Market input cannot be empty.');
      return;
    }
    fetchMarketData(market);
  };

  return (
    <div className="App">
      <h1>Deriv Market Data & Active Trades</h1>

      {/* Form to input market */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          placeholder="Enter market (e.g., R_100, EURUSD)"
        />
        <button type="submit">Fetch Market Data</button>
      </form>

      {/* Display market data */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {marketData ? <pre>{JSON.stringify(marketData, null, 2)}</pre> : null}

      {/* Trade placement form */}
      <h2>Place a Trade</h2>
      <form onSubmit={handleTrade}>
        <label>
          Contract Type:
          <select name="contractType" value={tradeData.contractType} onChange={handleTradeChange}>
            <option value="CALL">CALL</option>
            <option value="PUT">PUT</option>
          </select>
        </label>
        <label>
          Stake:
          <input type="number" name="stake" value={tradeData.stake} onChange={handleTradeChange} />
        </label>
        <label>
          Duration:
          <input type="number" name="duration" value={tradeData.duration} onChange={handleTradeChange} />
        </label>
        <button type="submit">Place Trade</button>
      </form>

      {/* Display trade result */}
      {tradeResult && (
        <div>
          <h3>Trade Summary</h3>
          <p>Contract Type: {tradeResult.contract_type}</p>
          <p>Stake: {tradeResult.stake}</p>
          <p>Duration: {tradeResult.duration}</p>
          <p>Payout: {tradeResult.payout}</p>
        </div>
      )}

      {/* Display active trades */}
      <h2>Active Trades</h2>
      {activeTrades.length === 0 ? (
        <p>No active trades available.</p>
      ) : (
        <ul>
          {activeTrades.map((trade, index) => (
            <li key={index}>
              {trade.contract_type} contract, Payout: {trade.payout}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
