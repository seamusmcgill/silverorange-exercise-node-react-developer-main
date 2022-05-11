import React from 'react';
import logo from './logo.svg';

import './App.css';

export function App() {
  useEffect(() => {
    // Fetch array of repos from backend API
    axios.get('http://localhost:4000/repos').then((response) => {
      // Sort repos by descending chronological date
      const sortedRepos = response.data.sort(
        (repoA, repoB) =>
          new Date(repoB.created_at) - new Date(repoA.created_at)
      );
      // Set repos state object to the sorted array
      setRepos(sortedRepos);
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
