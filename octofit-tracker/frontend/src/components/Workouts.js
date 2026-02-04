import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Construct the API URL using environment variable for Codespaces
  const API_URL = process.env.REACT_APP_CODESPACE_NAME 
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    console.log('Workouts Component: Fetching from API endpoint:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        console.log('Workouts Component: Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts Component: Raw fetched data:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results ? data.results : (Array.isArray(data) ? data : []);
        console.log('Workouts Component: Processed workouts data:', workoutsData);
        
        setWorkouts(workoutsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Workouts Component: Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger"><strong>Error:</strong> {error}</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-danger text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">💪 Workout Suggestions</h2>
          <button className="btn btn-light btn-sm">Get New Suggestions</button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Workout Name</th>
                <th>Description</th>
                <th>Category</th>
                <th className="text-center">Difficulty</th>
                <th>Suggested Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts.length > 0 ? (
                workouts.map((workout) => (
                  <tr key={workout.id}>
                    <td><strong>{workout.user_username}</strong></td>
                    <td>{workout.name}</td>
                    <td>{workout.description}</td>
                    <td>
                      <span className="badge bg-secondary">{workout.category}</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${
                        workout.difficulty_level === 'Beginner' ? 'bg-success' :
                        workout.difficulty_level === 'Intermediate' ? 'bg-warning text-dark' :
                        'bg-danger'
                      }`}>
                        {workout.difficulty_level}
                      </span>
                    </td>
                    <td>{new Date(workout.suggested_date).toLocaleDateString()}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-success me-1">Start</button>
                      <button className="btn btn-sm btn-outline-secondary">Details</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">No workouts found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Workouts;
