import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';  // Import the updated CSS for HomePage

const HomePage = () => {
  useEffect(() => {
    const snippets = [
      "console.log('Hello, World!');",
      "function greet() { return 'Hello!'; }",
      "const x = 10;",
      "if (x > 5) { console.log(x); }",
      "let y = x * 2;",
      "fetch('/api/data').then(res => res.json());",
      "<div class='container'></div>",
      "const [state, setState] = useState();",
      "document.getElementById('app');",
      "class MyClass extends React.Component {}",
      "try { /* code */ } catch (e) { /* handle error */ }"
    ];

    function createSnippet() {
      const snippetElement = document.createElement('div');
      const snippetText = snippets[Math.floor(Math.random() * snippets.length)];
      snippetElement.className = 'snippet';
      snippetElement.innerText = snippetText;
      snippetElement.style.left = Math.random() * 100 + '%';
      snippetElement.style.animationDuration = (15 + Math.random() * 15) + 's';
      snippetElement.style.fontSize = (12 + Math.random() * 8) + 'px';
      document.getElementById('floating-snippets').appendChild(snippetElement);

      // Remove the snippet when the animation is done
      snippetElement.addEventListener('animationend', function () {
        snippetElement.remove();
      });
    }

    // Create multiple snippets at intervals
    const intervalId = setInterval(createSnippet, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="homepage-container">
      <div id="floating-snippets" className="floating-snippets"></div>
      <h1 className="homepage-title">Welcome to SnippetVault</h1>
      <div className="homepage-links">
        <Link className="homepage-link" to="/login">Login</Link> | <Link className="homepage-link" to="/register">Register</Link>
      </div>
    </div>
  );
};

export default HomePage;
