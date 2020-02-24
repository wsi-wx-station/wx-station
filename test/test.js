const assert = require('assert');
const wx = require('../lib/wx-data');

describe('wx-data library', function() {
  
  describe("dummyDataSync()", function() {
    it("should return a simple, known object", function() {
      assert.deepStrictEqual(wx.dummyDataSync(), { title: "I'm Dummy Data" });
    });
  });

  describe("dummyData()", function() {
    it("should asynchronously return a simple, known object", function() {
      return wx.dummyData()
        .then(function(data) {
          assert.deepStrictEqual(data, { title: "I'm Async Dummy Data" }, "value should be known");
        });
    });
  });

  describe("gitHubData()", function() {
    it("should asynchronously return data from GitHub", function() {
      return wx.gitHubData()
        .then(function(data) {
          assert.equal(data.name, "Prof. Karl Stolley", 'name should be "Prof. Karl Stolley"');
        });
    });
  });

});
