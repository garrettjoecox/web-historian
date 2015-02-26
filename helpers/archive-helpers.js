var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('http-request');
var qs = require('querystring');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(func){
  var list = fs.readFileSync(exports.paths.list, 'utf8')
  var split = list.split('\n');

  return func(split);
};

exports.isUrlInList = function(target){
  var list = fs.readFileSync(exports.paths.list, 'utf8');
  var split = list.split('\n');
  var flag = false
  _.each(split, function(item){
    if (item.toUpperCase() === target.toUpperCase()) flag = true;
  })
  return flag;
};

exports.addUrlToList = function(site){
  fs.appendFileSync(exports.paths.list, site + '\n');
};

exports.isURLArchived = function(){
};

exports.downloadUrls = function(){
  var list = exports.readListOfUrls(function(item){
    return item;
  });
  _.each(list, function(site){
    if(!fs.existsSync(exports.paths.archivedSites + "/" + site)){
      fs.mkdirSync(exports.paths.archivedSites + "/" + site);
      request.get(site, function(error, res){
        console.log(exports.paths.archivedSites + "/" + site + "/index.html")
        fs.writeFileSync(exports.paths.archivedSites + "/" + site + "/index.html", res.buffer.toString());
      })
    }
  })
};
