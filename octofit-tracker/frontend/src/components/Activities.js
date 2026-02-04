import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Construct the API URL using environment variable for Codespaces
  const API_URL = process.env.REACT_APP_CODESPACE_NAME 
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  useEffect(() => {
    console.log('Activities Component: Fetching from API endpoint:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        console.log('Activities Component: Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities Component: Raw fetched data:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results ? data.results : (Array.isArray(data) ? data : []);
        console.log('Activities Component: Processed activities data:', activitiesData);
        
        setActivities(activitiesData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Activities Component: Error fetching activities:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger"><strong>Error:</strong> {error}</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-success text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">🏃 Activities</h2>
          <button className="btn btn-light btn-sm">+ Log Activity</button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Activity Type</th>
                <th>Duration (min)</th>
                <th>Distance (km)</th>
                <th>Calories</th>
                <th>Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <tr key={activity.id}>
                    <td><strong>{activity.user_username}</strong></td>
                    <td>
                      <span className="badge bg-primary">{activity.activity_type}</span>
                    </td>
                    <td>{activity.duration}</td>
                    <td>{activity.distance}</td>
                    <td>{activity.calories_burned}</td>
                    <td>
                      {activity.date ? 
                        new Date(activity.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) 
                        : 'N/A'
                      }
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-1">View</button>
                      <button className="btn btn-sm btn-outline-danger">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">No activities found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Activities;
