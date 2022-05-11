const reposArray = [];

// Function to append valid repos to reposArray
const checkIfValidRepo = (repository) => {
  if (!repository.fork) {
    reposArray.push(repository);
  }
};
