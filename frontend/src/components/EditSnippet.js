import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import './dashboard.css'; // Assuming this contains your original styles

const EditSnippet = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSnippet = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`/api/snippets/${id}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        setTitle(res.data.title);
        setDescription(res.data.description);
        setCode(res.data.code);
        setTags(res.data.tags);
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      }
    };

    fetchSnippet();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/snippets/${id}`, { title, description, code, tags }, {
        headers: {
          'x-auth-token': token,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
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
            <h2>Edit Snippet</h2>
            <form className="create-snippet-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
              <textarea 
                placeholder="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
              <textarea 
                placeholder="Code" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="Tags (comma separated)" 
                value={tags} 
                onChange={(e) => setTags(e.target.value)} 
              />
              <button type="submit">Update Snippet</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditSnippet;
