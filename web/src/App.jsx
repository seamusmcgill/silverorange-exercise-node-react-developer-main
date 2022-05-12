import { useEffect, useState, React } from 'react';
import axios from 'axios';
import './App.css';

export function App() {
  const [state, setState] = useState({
    repos: [],
    languages: [],
    language: '',
  });
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
  // Convert repos into JSX tables
  const reposRows = repos.map((repo) => (
    <tr key={repo.id}>
      <td>{repo.name}</td>
      <td>{repo.description}</td>
      <td>{repo.language}</td>
      <td>{repo.forks}</td>
    </tr>
  ));
  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Repository Name</th>
            <th>Description</th>
            <th>Language</th>
            <th># of Forks</th>
          </tr>
        </thead>
        <tbody>{reposRows}</tbody>
      </table>
    </div>
  );
}
