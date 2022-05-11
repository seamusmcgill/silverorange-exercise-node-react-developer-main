import { Router } from 'express';
import * as fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

export const repos = Router();

// Initialize array of repos to be returned
const reposArray = [];

// Function to append valid repos to reposArray
const checkIfValidRepo = (repository) => {
  if (repository.fork === false) {
    reposArray.push(repository);
  }
};

repos.get('/', async (_, res) => {
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
  // Set response header content-type to application/json
  res.header({
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  });

  res.status(200);

  // Return the array of valid repos
  res.json(reposArray);
});
