import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import './dashboard.css'; 
import './collectionDetail.css';  // New CSS file for specific styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSnippetToCollection from './AddSnippetToCollection';

const CollectionDetail = () => {
  const { collectionId } = useParams(); 
  const [collection, setCollection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await axios.get(`/api/collections/${collectionId}`);
        setCollection(res.data);
      } catch (err) {
        setError('Failed to load collection');
        toast.error('Failed to load collection');
        console.error('Failed to load collection', err);
      }
    };

    fetchCollection();
  }, [collectionId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info('Logged out successfully!');
    window.location.href = '/login';
  };

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
            disabled
          />
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <div className="universal-card collection-detail-card">
          {error && <p className="error-message">{error}</p>}
          {collection && (
            <>
              <h4 className="collection-title">{collection.name}</h4>
              <p className="collection-description">{collection.description}</p>

              <div className="add-snippet-container">
                <h5>Add Snippet to Collection</h5>
                <AddSnippetToCollection collectionId={collectionId} />
              </div>

              <div className="snippet-list">
                <h5>Snippets in this Collection</h5>
                <ul>
                  {collection.Snippets.map((snippet) => (
                    <li key={snippet.id}>
                      <a href={`/snippets/${snippet.id}`} className="snippet-link">{snippet.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <footer className="animated-footer">
          <p>&copy; {new Date().getFullYear()} All rights reserved by Syed Sohaib</p>
        </footer>
      </main>
    </div>
  );
};

export default CollectionDetail;
