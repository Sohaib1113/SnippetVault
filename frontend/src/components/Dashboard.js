import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './dashboard.css'; // Assuming this contains your original styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [snippets, setSnippets] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const snippetsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
          setTimeout(() => {
            setSnippets(res.data);
            setLoading(false);
          }, 1000); // 3-second delay
        } catch (err) {
          console.error(err);
          setError('Failed to load snippets. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/snippets/${id}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        setTimeout(() => {
          setSnippets(snippets.filter(snippet => snippet.id !== id));
          setLoading(false);
        }, 1000); // 3-second delay
      } catch (err) {
        setError('Failed to delete the snippet. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const indexOfLastSnippet = currentPage * snippetsPerPage;
  const indexOfFirstSnippet = indexOfLastSnippet - snippetsPerPage;
  const filteredSnippets = snippets.filter(snippet => {
    const matchesTag = selectedTag ? snippet.tags.includes(selectedTag) : true;
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery) || 
                          snippet.description.toLowerCase().includes(searchQuery) || 
                          snippet.tags.toLowerCase().includes(searchQuery);
    return matchesTag && matchesSearch;
  });
  const currentSnippets = filteredSnippets.slice(indexOfFirstSnippet, indexOfLastSnippet);
  const totalPages = Math.ceil(filteredSnippets.length / snippetsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search..." 
            value={searchQuery} 
            onChange={handleSearch}
          />
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <div className="container-fluid py-4">
          <div className="universal-card">
            <h2>Dashboard</h2>
            {loading && (
              <div className="loading-spinner">
                <FontAwesomeIcon icon={faSpinner} spin /> Loading...
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            <div className="snippets-container">
              {currentSnippets.length > 0 ? (
                currentSnippets.map((snippet) => (
                  <div key={snippet.id} className="snippet-card">
                    <h3>{snippet.title}</h3>
                    <p>{snippet.description}</p>
                    <code>{snippet.code}</code>
                    <div className="snippet-tags">
                      {snippet.tags && snippet.tags.split(',').map((tag, index) => (
                        <span 
                          key={index} 
                          className={`tag ${selectedTag === tag.trim() ? 'selected' : ''}`} 
                          onClick={() => handleTagClick(tag.trim())}
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="snippet-actions">
                      <button 
                        className="edit-btn" 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to edit this snippet?")) {
                            navigate(`/edit-snippet/${snippet.id}`);
                          }
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(snippet.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                !loading && <p>No snippets available. <a href="/create-snippet">Create one now!</a></p>
              )}
            </div>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button 
                  key={index + 1} 
                  onClick={() => paginate(index + 1)}
                  className={currentPage === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
