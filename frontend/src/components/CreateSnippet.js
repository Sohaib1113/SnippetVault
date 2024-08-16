import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './dashboard.css'; // Import the same CSS file used in your Dashboard

const CreateSnippet = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const formErrors = {};
    if (!title) formErrors.title = "Title is required.";
    if (!code) formErrors.code = "Code is required.";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/snippets', { title, description, code, tags }, {
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
            <h2>Create New Snippet</h2>
            <form className="create-snippet-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
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
              {errors.code && <p className="form-error">{errors.code}</p>}
              <input 
                type="text" 
                placeholder="Tags (comma separated)" 
                value={tags} 
                onChange={(e) => setTags(e.target.value)} 
              />
              <button type="submit">Create Snippet</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateSnippet;
