import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './dashboard.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faEdit, faTrash, faShareAlt, faCodeBranch } from '@fortawesome/free-solid-svg-icons';

import SnippetVersionHistory from './SnippetVersionHistory'; // New Component
import SnippetCommenting from './SnippetCommenting'; // New Component
import SnippetCollection from './SnippetCollection'; // New Component
import SnippetSearchAndFilter from './SnippetSearchAndFilter'; // New Component

const Dashboard = () => {
  const [snippets, setSnippets] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('created'); 
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
            if (!toast.isActive('snippets-loaded')) {
              toast.success('Snippets loaded successfully!', { toastId: 'snippets-loaded' });
            }
          }, 3000);
        } catch (err) {
          console.error(err);
          setError('Failed to load snippets. Please try again later.');
          setLoading(false);
          if (!toast.isActive('snippets-error')) {
            toast.error('Failed to load snippets. Please try again later.', { toastId: 'snippets-error' });
          }
        }
      }
    };
  
    fetchData();
  }, [navigate]);
    
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info('Logged out successfully!');
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
          toast.success('Snippet deleted successfully!');
        }, 3000); 
      } catch (err) {
        setError('Failed to delete the snippet. Please try again.');
        setLoading(false);
        toast.error('Failed to delete the snippet. Please try again.');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleShare = async (id) => {
    setLoading(true); 
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/snippets/${id}/share`, {}, {
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

  const handleFork = async (id) => {
    setLoading(true); 
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/snippets/${id}/fork`, {}, {
        headers: {
          'x-auth-token': token,
        },
      });
      setSnippets([...snippets, res.data]); 
      toast.success('Snippet forked successfully!');
    } catch (err) {
      toast.error('Failed to fork the snippet.');
    } finally {
      setLoading(false); 
    }
  };

  const createdSnippets = snippets.filter(snippet => !snippet.title.startsWith('Forked:'));
  const forkedSnippets = snippets.filter(snippet => snippet.title.startsWith('Forked:'));

  const indexOfLastSnippet = currentPage * snippetsPerPage;
  const indexOfFirstSnippet = indexOfLastSnippet - snippetsPerPage;
  const currentSnippets = (activeTab === 'created' ? createdSnippets : forkedSnippets).slice(indexOfFirstSnippet, indexOfLastSnippet);
  const totalPages = Math.ceil((activeTab === 'created' ? createdSnippets : forkedSnippets).length / snippetsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="g-sidenav-show bg-gray-100">
      <ToastContainer />
      <div className="sidebar">
        <div className="brand">SnippetVault Dashboard</div>
        <ul className="menu">
          <li><a href="/dashboard"><i className="ni ni-tv-2"></i> Dashboard</a></li>
          <li><a href="/create-snippet"><i className="ni ni-fat-add"></i> Create Snippet</a></li>
          <li><a href="/collections"><i className="ni ni-bullet-list-67"></i> Collections</a></li>
          <li><a href="/settings"><i className="ni ni-settings"></i> Settings</a></li>
          <li><a href="/profile"><i className="ni ni-single-02"></i> Profile</a></li>
        </ul>
        <div className='mycustfooter'>
          <p>Developed by Syed Sohaib</p>
          <p><i className="fas fa-envelope"></i> <a href="mailto:amaans113@gmail.com">amaans113@gmail.com</a></p>
          <p><i className="fas fa-globe"></i> <a href="https://sohaibsportfolio.netlify.app" target="_blank" rel="noopener noreferrer">sohaibsportfolio.netlify.app</a></p>
          <p><i className="fab fa-github"></i> <a href="https://github.com/Sohaib1113" target="_blank" rel="noopener noreferrer">github.com/Sohaib1113</a></p>
        </div>
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

        <SnippetSearchAndFilter 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          selectedTag={selectedTag}
          handleTagClick={handleTagClick}
          setSelectedTag={setSelectedTag}
        />

        <div className="universal-card">
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'created' ? 'active' : ''}`} 
              onClick={() => setActiveTab('created')}
            >
              Created Snippets
            </button>
            <button 
              className={`tab-button ${activeTab === 'forked' ? 'active' : ''}`} 
              onClick={() => setActiveTab('forked')}
            >
              Forked Snippets
            </button>
          </div>

          {loading && (
            <div className="loading-spinner">
              <FontAwesomeIcon icon={faSpinner} spin /> Loading...
            </div>
          )}
          {error && <div className="error-message">{error}</div>}

          <div className="snippets-grid">
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
                      onClick={() => navigate(`/edit-snippet/${snippet.id}`)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDelete(snippet.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                    <button 
                      className="share-btn" 
                      onClick={() => handleShare(snippet.id)}
                    >
                      <FontAwesomeIcon icon={faShareAlt} /> Share
                    </button>
                    <button 
                      className="fork-btn" 
                      onClick={() => handleFork(snippet.id)}
                    >
                      <FontAwesomeIcon icon={faCodeBranch} /> Fork
                    </button>
                  </div>

                  <SnippetVersionHistory snippetId={snippet.id} />
                  <SnippetCommenting snippetId={snippet.id} />
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
        {/* Footer */}
        <footer className="animated-footer">
          <p>&copy; {new Date().getFullYear()} All rights reserved by Syed Sohaib</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
