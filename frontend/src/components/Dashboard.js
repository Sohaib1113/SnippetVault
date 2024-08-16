import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './dashboard.css';
// Assuming this contains your original styles

const Dashboard = () => {
  const [snippets, setSnippets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      } else {
        try {
          const res = await axios.get('/api/snippets', {
            headers: {
              'x-auth-token': token,
            },
          });
          setSnippets(res.data);
        } catch (err) {
          console.error(err);
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="g-sidenav-show bg-gray-100">
      <div className="sidebar">
        <div className="brand">SnippetVault Dashboard</div>
        <ul className="menu">
          <li><a href="/dashboard"><i className="ni ni-tv-2"></i> Dashboard</a></li>
          <li><a href="/settings"><i className="ni ni-settings"></i> Settings</a></li>
          <li><a href="/profile"><i className="ni ni-single-02"></i> Profile</a></li>
        </ul>
      </div>
      <main className="main-content position-relative border-radius-lg">
        <div className="navbar">
          <input type="text" className="search-bar" placeholder="Search..." />
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <div className="container-fluid py-4">
          <h2>Dashboard</h2>
          <div className="snippets-container">
            {snippets.length > 0 ? (
              snippets.map((snippet) => (
                <div key={snippet.id} className="snippet-card">
                  <h3>{snippet.title}</h3>
                  <p>{snippet.description}</p>
                  <code>{snippet.code}</code>
                </div>
              ))
            ) : (
              <p>No snippets available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
  };

export default Dashboard;
