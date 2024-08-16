import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import CreateSnippet from './components/CreateSnippet';
import EditSnippet from './components/EditSnippet';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
