import React from 'react';

const SnippetSearchAndFilter = ({ searchQuery, setSearchQuery, selectedTag, handleTagClick, setSelectedTag }) => {
  return (
    <div className="search-filter-container">
      <input 
        type="text" 
        placeholder="Search snippets..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
      />
      <div className="filter-tags">
        <button onClick={() => setSelectedTag('all')} className={selectedTag === 'all' ? 'selected' : ''}>
          All
        </button>
        {/* Add more tag buttons as needed */}
      </div>
    </div>
  );
};

export default SnippetSearchAndFilter;
