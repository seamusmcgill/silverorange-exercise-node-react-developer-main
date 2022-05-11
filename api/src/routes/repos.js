const reposArray = [];

// Function to append valid repos to reposArray
const checkIfValidRepo = (repository) => {
  if (!repository.fork) {
    reposArray.push(repository);
  }
};

  // Read from repos.json file
  fs.readFile(path.resolve('data/repos.json')).then((data) => {
    // Append repos that match the fork condition into the array of repos
    data.forEach((repository) => {
      checkIfValidRepo(repository);
    });
  });

  // Fetch repos data from GitHub API
  axios
    .get('https://api.github.com/users/silverorange/repos')
    .then((response) => {
      const githubRepos = response.data;
      // Append repos that match the fork condition into the array of repos
      githubRepos.forEach((repository) => {
        checkIfValidRepo(repository);
      });
    });
