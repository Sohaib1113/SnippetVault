import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const SnippetVersionHistory = ({ snippetId }) => {
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await axios.get(`/api/snippets/${snippetId}/versions`);
        setVersions(res.data);
      } catch (err) {
        setError('Failed to load versions');
        console.error('Failed to load versions', err);
      }
    };

    fetchVersions();
  }, [snippetId]);

  return (
    <div className="version-history">
      <h4>Version History</h4>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {versions.map((version, index) => (
          <li key={version.versionId}>
            <a href={`/snippets/${snippetId}/version/${version.versionId}`}>
              Version {index + 1}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SnippetVersionHistory;
