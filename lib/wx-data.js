async function returnDummyData() {
  return { title: "It's async data, Dummy. From the library." };
}

function returnDummyDataSync() {
  return { title: "It's sync data, Dummy. From the library." };
}

module.exports = {
  returnDummyData,
  returnDummyDataSync
}
