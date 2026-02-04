import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', team_id: '' });
  const [saveError, setSaveError] = useState(null);

  // Construct the API URL using environment variable for Codespaces
  const API_URL = process.env.REACT_APP_CODESPACE_NAME 
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';
  
  const TEAMS_API_URL = process.env.REACT_APP_CODESPACE_NAME 
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    console.log('Users Component: Fetching from API endpoint:', API_URL);
    
    // Fetch users
    fetch(API_URL)
      .then(response => {
        console.log('Users Component: Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users Component: Raw fetched data:', data);
        
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results ? data.results : (Array.isArray(data) ? data : []);
        console.log('Users Component: Processed users data:', usersData);
        
        setUsers(usersData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Users Component: Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      });
    
    // Fetch teams for the dropdown
    fetch(TEAMS_API_URL)
      .then(response => response.json())
      .then(data => {
        const teamsData = data.results ? data.results : (Array.isArray(data) ? data : []);
        setTeams(teamsData);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
      });
  }, [API_URL, TEAMS_API_URL]);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      team_id: user.team_id || ''
    });
    setSaveError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        team_id: formData.team_id || null
      };

      const response = await fetch(`${API_URL}${editingUser.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
      );

      // Close the modal
      setEditingUser(null);
      setFormData({ name: '', email: '', team_id: '' });
      setSaveError(null);
      
      // Close the Bootstrap modal
      const modalElement = document.getElementById('editUserModal');
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setSaveError(error.message);
    }
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', team_id: '' });
    setSaveError(null);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger"><strong>Error:</strong> {error}</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">👥 Users</h2>
          <button className="btn btn-light btn-sm">+ Add User</button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Team</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      {user.team_name ? (
                        <span className="badge bg-info">{user.team_name}</span>
                      ) : (
                        <span className="badge bg-secondary">No Team</span>
                      )}
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-1">View</button>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#editUserModal"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      <div className="modal fade" id="editUserModal" tabIndex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editUserModalLabel">Edit User Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              {saveError && (
                <div className="alert alert-danger" role="alert">
                  {saveError}
                </div>
              )}
              <form>
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userEmail" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="userEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userTeam" className="form-label">Team</label>
                  <select
                    className="form-select"
                    id="userTeam"
                    name="team_id"
                    value={formData.team_id}
                    onChange={handleInputChange}
                  >
                    <option value="">No Team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSaveUser}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
