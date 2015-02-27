var fs = require('fs');
module.exports = function () {
  if (!fs.existsSync("./archives")) {
    fs.mkdirSync("./archives");
  }
  if (!fs.existsSync("./archives/sites.txt")) {
    var file = fs.openSync("./archives/sites.txt", "w");
    fs.closeSync(file);
  }
  if (!fs.existsSync("./archives/sites")) {
    fs.mkdirSync("./archives/sites");
  }
};
