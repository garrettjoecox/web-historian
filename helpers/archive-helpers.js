var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('http-request');

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, 'utf8', function(error, data){
    var list = data.split('\n');
    list.pop();
    return callback(list);
  })
};

exports.isUrlInList = function(target, callback){
  exports.readListOfUrls(function(list){
    callback(_.contains(list, target));
  });
};

exports.addUrlToList = function(url){
  exports.isUrlInList(url, function(flag){
    if(!flag){
      fs.appendFile(exports.paths.list, url + '\n')
    }
  })
};

exports.isURLArchived = function(){
};

exports.downloadUrls = function(){
  exports.readListOfUrls(function(list){
    _.each(list, function(site){
      fs.exists(exports.paths.archivedSites + '/' + site, function(exists){
        if(!exists){
          request.get(site, function(err, res){
            fs.writeFile(exports.paths.archivedSites + '/' + site, res.buffer.toString());
          })
        }
      })
    })
  })
};
