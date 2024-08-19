import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const AddSnippetToCollection = ({ collectionId }) => {
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippetId, setSelectedSnippetId] = useState('');

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const res = await axios.get('/api/snippets');
        setSnippets(res.data);
      } catch (err) {
        console.error('Failed to load snippets', err);
      }
    };

    fetchSnippets();
  }, []);

  const handleAddSnippet = async () => {
    try {
      await axios.post(`/api/collections/${collectionId}/snippets`, { snippetId: selectedSnippetId });
      alert('Snippet added to collection successfully!');
    } catch (err) {
      console.error('Failed to add snippet to collection', err);
    }
  };

  return (
    <div>
      <select value={selectedSnippetId} onChange={(e) => setSelectedSnippetId(e.target.value)}>
        <option value="" disabled>Select a Snippet</option>
        {snippets.map((snippet) => (
          <option key={snippet.id} value={snippet.id}>{snippet.title}</option>
        ))}
      </select>
      <button onClick={handleAddSnippet}>Add to Collection</button>
    </div>
  );
};

export default AddSnippetToCollection;
