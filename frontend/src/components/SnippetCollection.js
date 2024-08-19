import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const SnippetCollection = () => {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get('/api/collections');
        setCollections(res.data);
      } catch (err) {
        console.error('Failed to load collections', err);
      }
    };

    fetchCollections();
  }, []);

  const handleCreateCollection = async () => {
    try {
      const res = await axios.post('/api/collections', { name: newCollectionName });
      setCollections([...collections, res.data]);
      setNewCollectionName('');
    } catch (err) {
      console.error('Failed to create collection', err);
    }
  };

  return (
    <div className="collection-section">
      <h4>Collections</h4>
      <ul>
        {collections.map((collection) => (
          <li key={collection.id}>{collection.name}</li>
        ))}
      </ul>
      <input 
        type="text" 
        placeholder="New Collection Name..." 
        value={newCollectionName} 
        onChange={(e) => setNewCollectionName(e.target.value)}
      />
      <button onClick={handleCreateCollection}>Create Collection</button>
    </div>
  );
};

export default SnippetCollection;
