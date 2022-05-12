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
      // Initialize empty languages array
      const languagesArray = [];
      // Add languages of repos to array
      sortedRepos.forEach((repo) => {
        if (!languagesArray.includes(repo.language)) {
          languagesArray.push(repo.language);
        }
      });
      // Set state object to the sorted repo array and language array
      setState((prev) => {
        return { ...prev, repos: sortedRepos, languages: languagesArray };
      });
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

  const languageButtons = state.languages.map((language) => (
    <button
      type="button"
      key={language}
      onClick={() => {
        setState((prev) => {
          return { ...prev, language };
        });
      }}
    >
      {language}
    </button>
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
