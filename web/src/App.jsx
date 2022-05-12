import { useEffect, useState, React } from 'react';
import axios from 'axios';
import './App.css';

export function App() {
  // Creates state object with repos list and selected repo, language list and selected language
  const [state, setState] = useState({
    repos: [],
    repo: '',
    languages: [],
    language: '',
  });

  useEffect(() => {
    // Fetch array of repos from backend API
    axios.get('http://localhost:4000/repos').then((response) => {
      // Sort repos by descending chronological date
      let sortedRepos = response.data.sort(
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
      // Filter repos if a language button is clicked
      if (state.language) {
        sortedRepos = sortedRepos.filter(
          (repo) => repo.language === state.language
        );
      }
      // Set state object to the sorted repo array and language array
      setState((prev) => {
        return { ...prev, repos: sortedRepos, languages: languagesArray };
      });
    });
  }, [state.language]);

  useEffect(() => {
    // Get commit history when repo in state changes
    if (state.repo.name) {
      axios
        .get(
          `https://api.github.com/repos/silverorange/${state.repo.name}/commits`
        )
        .then((response) => {
          const commitsArray = response.data;
          const last_commit_date = commitsArray[0].commit.author.date;
          const last_commit_author = commitsArray[0].commit.author.name;
          // Update repo object in state to include the last commit date and author
          setState((prev) => {
            return {
              ...prev,
              repo: {
                ...prev.repo,
                last_commit_date,
                last_commit_author,
              },
            };
          });
        });
    }
  }, [state.repo]);
  // Convert repos into JSX tables
  const reposRows = state.repos.map((repo) => (
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
      {languageButtons}
      <button
        type="button"
        onClick={() => {
          setState((prev) => {
            return { ...prev, language: '' };
          });
        }}
      >
        {'Clear'}
      </button>
    </div>
  );
}
