import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './dashboard.css'; // Use the same CSS file for consistent styling
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '', // This is for new password, not fetched from API
    twoFactorAuth: false,
    emailNotifications: false,
    pushNotifications: false,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/settings', {
          headers: {
            'x-auth-token': token,
          },
        });

        // Debugging: Log the response
        // console.log('Fetched user settings:', res.data);

        setUser((prevUser) => ({
          ...prevUser,
          username: res.data.username,
          email: res.data.email,
          twoFactorAuth: res.data.twoFactorAuth,
          emailNotifications: res.data.emailNotifications,
          pushNotifications: res.data.pushNotifications,
        }));

        setLoading(false);
      } catch (err) {
        console.error('Error fetching settings:', err);
        toast.error('Failed to load settings.');
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle input changes
  const handleChange = (field, value) => {
    setUser({
      ...user,
      [field]: value,
    });
  };

  // Handle save button click
  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/settings', user, {
        headers: {
          'x-auth-token': token,
        },
      });
      toast.success('Settings updated successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/settings/delete-account', {}, {
          headers: {
            'x-auth-token': token,
          },
        });
        toast.success('Account deleted successfully.');
        localStorage.removeItem('token');
        navigate('/login');
      } catch (err) {
        console.error('Error deleting account:', err);
        toast.error('Failed to delete account.');
      } finally {
        setLoading(false);
      }
    }
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
        <div className="mycustfooter">
          <p>Developed by Syed Sohaib</p>
          <p><i className="fas fa-envelope"></i> <a href="mailto:amaans113@gmail.com">amaans113@gmail.com</a></p>
          <p><i className="fas fa-globe"></i> <a href="https://sohaibsportfolio.netlify.app" target="_blank" rel="noopener noreferrer">sohaibsportfolio.netlify.app</a></p>
          <p><i className="fab fa-github"></i> <a href="https://github.com/Sohaib1113" target="_blank" rel="noopener noreferrer">github.com/Sohaib1113</a></p>
        </div>
      </div>

      <main className="main-content position-relative border-radius-lg">
        <div className="navbar">
          <button className="logout-btn" onClick={() => navigate('/login')}>Logout</button>
        </div>

        <div className="universal-card">
          <h2>Settings</h2>

          {loading ? (
            <p>Loading settings...</p>
          ) : (
            <>
              <div className="settings-section">
                <h3>Account Settings</h3>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={user.username} // Display the current username
                    onChange={(e) => handleChange('username', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={user.email} // Display the current email
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password" // Do not display current password for security reasons
                    onChange={(e) => handleChange('password', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Two-Factor Authentication (2FA)</label>
                  <input
                    type="checkbox"
                    checked={user.twoFactorAuth} // Display the current 2FA status
                    onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                  />
                </div>
              </div>

              <div className="settings-section">
                <h3>Notification Settings</h3>
                <div className="form-group">
                  <label>Email Notifications</label>
                  <input
                    type="checkbox"
                    checked={user.emailNotifications} // Display the current email notifications status
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  />
                </div>
                <div className="form-group">
                  <label>Push Notifications</label>
                  <input
                    type="checkbox"
                    checked={user.pushNotifications} // Display the current push notifications status
                    onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                  />
                </div>
              </div>

              <div className="settings-section">
                <h3>Security Settings</h3>
                <div className="form-group">
                  <label>Delete Account</label>
                  <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
                </div>
              </div>

              <button className="save-btn" onClick={handleSave}>Save</button>
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

export default Settings;
