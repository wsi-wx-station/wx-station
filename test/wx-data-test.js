const assert = require('assert').strict;

const wx = require('../lib/wx-data');

/* Testing a run-of-the-mill synchronous function */
describe('returnDummyDataSync()', function() {
  it('should return a known object', function () {
    assert.deepStrictEqual(wx.returnDummyDataSync(), { title: "It's sync data, Dummy. From the library." }, 'the object literals should match');
  });
});

/* Testing a fancy-pants async function  */
describe('returnDummyData', function() {
  it('should asynchronously return a known object', function() {
    return wx.returnDummyData()
      .then(function(data) {
        assert.deepStrictEqual(data, { title: "It's async data, Dummy. From the library." }, 'the async object literals should match');
      });
  });
});

/* Testing a live response from the GitHub API */
describe('gitHubData', function() {
  it('should return a known API response object', function() {
    return wx.gitHubData()
      .then(function(data) {
        assert.equal(data.name, "Prof. Karl Stolley", "should be 'Prof. Karl Stolley'");
      });
  });
});
