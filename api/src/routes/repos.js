import { Router } from 'express';
import * as fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

export const repos = Router();

// Function to append valid repos to reposArray
const checkIfValidRepo = (repository, reposArray) => {
  if (repository.fork === false) {
    reposArray.push(repository);
  }
};

repos.get('/', async (_, res) => {
  // Read from repos.json file
  fs.readFile(path.resolve('data/repos.json')).then((data) => {
    // Initialize array of repos to be returned
    const reposArray = [];
    // Append repos that match the fork condition into the array of repos
    data.forEach((repository) => {
      checkIfValidRepo(repository, reposArray);
    });
    axios
      // Fetch repos data from GitHub API
      .get('https://api.github.com/users/silverorange/repos')
      .then((response) => {
        const githubRepos = response.data;
        // Append repos that match the fork condition into the array of repos
        githubRepos.forEach((repository) => {
          checkIfValidRepo(repository, reposArray);
        });
        // Set response header content-type to application/json
        res.header({
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json',
        });
        res.status(200);
        // Return the array of valid repos
        res.json(reposArray);
      });
  });
});
