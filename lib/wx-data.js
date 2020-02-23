function helloThere() {
  console.log("General Kenobi! You're a bold one.");
}
function dummyDataSync() {
  return { title: "I'm Dummy Data" };
}
async function dummyData() {
  return { title: "I'm Async Dummy Data" };
}

module.exports = {
  helloThere,
  dummyDataSync,
  dummyData
}
