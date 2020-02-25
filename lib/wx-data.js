async function returnDummyData() {
  return { title: "It's async data, Dummy. From the library." };
}

function returnDummyDataSync() {
  return { title: "It's sync data, Dummy. From the library." };
}

function returnGitHubData() {
  const url = 'https://api.github.com/users/profstolley';
  const hlib = url.startsWith('https') ? require('https') : require('http');
  hlib.get(url, options, response)
}
module.exports = {
  returnDummyData,
  returnDummyDataSync
}
