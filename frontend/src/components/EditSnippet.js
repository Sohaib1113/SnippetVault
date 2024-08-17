import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import './dashboard.css'; // Assuming this contains your original styles
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

const EditSnippet = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSnippet = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
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
        toast.error('Failed to load snippet data.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [id, navigate]);

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
      await axios.put(`/api/snippets/${id}`, { title, description, code, tags }, {
        headers: {
          'x-auth-token': token,
        },
      });
      toast.success('Snippet updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update snippet.');
    }
  };

  const handleShare = async () => {
    const email = prompt("Enter the email to share with (optional):");
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/snippets/${id}/share`, { email }, {
        headers: {
          'x-auth-token': token,
        },
      });
      const shareableLink = res.data.shareableLink;
      navigator.clipboard.writeText(shareableLink);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to generate shareable link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="g-sidenav-show bg-gray-100">
      <ToastContainer />
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
            {loading && <div className="loading-spinner"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>}
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
              <button type="submit">Update Snippet</button>
            </form>
            <button onClick={handleShare}>Share Snippet</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditSnippet;
