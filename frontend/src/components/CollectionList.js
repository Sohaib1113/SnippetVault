import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import './dashboard.css'; // Assuming this CSS file contains the styling for your dashboard

const CollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get('/api/collections');
        setCollections(res.data);
      } catch (err) {
        setError('Failed to load collections');
        console.error('Failed to load collections', err);
      }
    };

    fetchCollections();
  }, []);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/collections', newCollection);
      setCollections([...collections, res.data]);
      setNewCollection({ name: '', description: '' });
    } catch (err) {
      setError('Failed to create collection');
      console.error('Failed to create collection', err);
    }
  };

  return (
    <div className="g-sidenav-show bg-gray-100">
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
          />
          <button className="logout-btn">Logout</button>
        </div>

        <div className="universal-card">
          <h4>Your Collections</h4>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleCreateCollection} className="collection-form">
            <input 
              type="text" 
              placeholder="Collection Name" 
              value={newCollection.name} 
              onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })} 
              required 
            />
            <input 
              type="text" 
              placeholder="Description" 
              value={newCollection.description} 
              onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })} 
            />
            <button type="submit">Create Collection</button>
          </form>
          <ul>
            {collections.map((collection) => (
              <li key={collection.collectionId}>
                <a href={`/collections/${collection.collectionId}`}>{collection.name}</a>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Footer */}
        <footer className="animated-footer">
          <p>&copy; {new Date().getFullYear()} All rights reserved by Syed Sohaib</p>
        </footer>
      </main>
    </div>
  );
};

export default CollectionList;
