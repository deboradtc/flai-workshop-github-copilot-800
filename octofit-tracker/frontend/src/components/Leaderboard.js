import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Construct the API URL using environment variable for Codespaces
  const API_URL = process.env.REACT_APP_CODESPACE_NAME 
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  useEffect(() => {
    console.log('Leaderboard Component: Fetching from API endpoint:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        console.log('Leaderboard Component: Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard Component: Raw fetched data:', data);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results ? data.results : (Array.isArray(data) ? data : []);
        console.log('Leaderboard Component: Processed leaderboard data:', leaderboardData);
        
        setLeaderboard(leaderboardData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Leaderboard Component: Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger"><strong>Error:</strong> {error}</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-warning text-dark">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">🏆 Leaderboard</h2>
          <button className="btn btn-dark btn-sm">Refresh</button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th className="text-center">Rank</th>
                <th>Username</th>
                <th>Team</th>
                <th className="text-center">Total Activities</th>
                <th className="text-center">Total Duration (min)</th>
                <th className="text-center">Total Distance (km)</th>
                <th className="text-center">Total Calories</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <tr key={entry.user_id || index} className={index < 3 ? 'table-warning' : ''}>
                    <td className="text-center">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && <span className="badge bg-secondary">{index + 1}</span>}
                    </td>
                    <td><strong>{entry.username}</strong></td>
                    <td>{entry.team_name || 'N/A'}</td>
                    <td className="text-center">
                      <span className="badge bg-primary">{entry.total_activities || 0}</span>
                    </td>
                    <td className="text-center">{entry.total_duration || 0}</td>
                    <td className="text-center">{entry.total_distance || 0}</td>
                    <td className="text-center">
                      <span className="badge bg-danger">{entry.total_calories || 0}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">No leaderboard data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
