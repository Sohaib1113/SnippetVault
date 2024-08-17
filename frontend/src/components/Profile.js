import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './dashboard.css';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('/api/profile', {
          headers: {
            'x-auth-token': token,
          },
        });
        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile. Please try again later.');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/profile', { username, email, password }, {
        headers: {
          'x-auth-token': token,
        },
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again later.');
    }
  };

  return (
    <div className="g-sidenav-show bg-gray-100">
      <div className="sidebar">
        <div className="brand">SnippetVault Dashboard</div>
        <ul className="menu">
          <li><a href="/dashboard"><i className="ni ni-tv-2"></i> Dashboard</a></li>
          <li><a href="/create-snippet"><i className="ni ni-fat-add"></i> Create Snippet</a></li>
          <li><a href="/settings"><i className="ni ni-settings"></i> Settings</a></li>
          <li><a href="/profile"><i className="ni ni-single-02"></i> Profile</a></li>
        </ul>
      </div>
      <main className="main-content position-relative border-radius-lg">
        <div className="navbar">
          <input type="text" className="search-bar" placeholder="Search..." />
          <button className="logout-btn" onClick={() => navigate('/login')}>Logout</button>
        </div>
        <div className="container-fluid py-4">
          <div className="universal-card">
            <h2>User Profile</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <input 
                type="password" 
                placeholder="New Password (leave blank to keep current)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Confirm New Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
              <button type="submit">Update Profile</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
