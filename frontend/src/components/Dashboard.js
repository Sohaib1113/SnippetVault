import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './dashboard.css'; // Assuming this contains your original styles

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
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/snippets/${id}`, {
          headers: {
            'x-auth-token': token,
          },
        });
  
        // After deletion, update the state to remove the deleted snippet
        setSnippets(snippets.filter(snippet => snippet.id !== id));
      } catch (err) {
        console.error('Failed to delete snippet:', err);
      }
    }
  };
  
  const handleEdit = (id) => {
    if (window.confirm("Are you sure you want to edit this snippet?")) {
      navigate(`/edit-snippet/${id}`);
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
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <div className="container-fluid py-4">
          <div className="universal-card">
            <h2>Dashboard</h2>
            <div className="snippets-container">
              {snippets.length > 0 ? (
                snippets.map((snippet) => (
                  <div key={snippet.id} className="snippet-card">
                    <h3>{snippet.title}</h3>
                    <p>{snippet.description}</p>
                    <code>{snippet.code}</code>
                    <div className="snippet-tags">
                      {snippet.tags && snippet.tags.split(',').map((tag, index) => (
                        <span key={index} className="tag">{tag.trim()}</span>
                      ))}
                    </div>
                    <div className="snippet-actions">
  <button className="edit-btn" onClick={() => handleEdit(snippet.id)}>Edit</button>
  <button className="delete-btn" onClick={() => handleDelete(snippet.id)}>Delete</button>
</div>


                  </div>
                ))
              ) : (
                <p>No snippets available. <a href="/create-snippet">Create one now!</a></p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
