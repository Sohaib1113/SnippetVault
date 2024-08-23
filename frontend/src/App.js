import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import CreateSnippet from './components/CreateSnippet';
import EditSnippet from './components/EditSnippet';
import Profile from './components/Profile';
import CollectionList from './components/CollectionList';
import CollectionDetail from './components/CollectionDetail'; // Ensure this import path is correct
import Settings from './components/Settings';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-snippet" element={<CreateSnippet />} />
          <Route path="/edit-snippet/:id" element={<EditSnippet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/collections" element={<CollectionList />} />
          <Route path="/collections/:collectionId" element={<CollectionDetail />} />
          <Route path="/settings" element={<Settings />} /> {/* Add this line */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
