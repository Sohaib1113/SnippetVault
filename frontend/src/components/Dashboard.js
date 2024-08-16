import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

const Dashboard = () => {
  const navigate = useNavigate(); // useNavigate instead of useHistory

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // navigate instead of history.push
      } else {
        try {
          const res = await axios.get('/api/snippets', {
            headers: {
              'x-auth-token': token
            }
          });
          console.log(res.data);
        } catch (err) {
          console.error(err);
          navigate('/login'); // navigate instead of history.push
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your SnippetVault Dashboard!</p>
    </div>
  );
};

export default Dashboard;
