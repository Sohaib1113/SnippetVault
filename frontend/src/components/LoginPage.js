import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './LoginPage.css'; // Assuming you save the CSS in a file named LoginPage.css

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Invalid credentials!'); // Display an alert for invalid credentials
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" id="login-btn">Login</button>
        </form>
        <div class="footer">
    <div><h4>Developed By: Sohaib Syed</h4></div>
    <div><a href="https://sohaibsportfolio.netlify.app" class="footer-link"><h4>MyPortfolio</h4></a></div>
</div>
      </div>
      {/* Floating text elements */}
      <div className="float-text html">HTMl</div>
      <div className="float-text css">CSS</div>
      <div className="float-text php">PHP</div>
      <div className="float-text java">Java</div>
      <div className="float-text c">C</div>
      <div className="float-text python">Python</div>
      <div className="float-text ai">AI</div>
      <div className="float-text variables">Variables</div>
      <div className="float-text functions">Functions</div>
      <div className="float-text styles">Styles</div>
     

    </div>
  );
};

export default LoginPage;
