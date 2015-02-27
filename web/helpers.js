var request = require('http-request');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');

exports.urlize = function(url){
  url = url.toLowerCase();
  if(url.substring(0,8) === 'https://') url = url.substring(8);
  if(url.substring(0,7) === 'http://') url = url.substring(7);
  if(url.substring(0,4) === 'www.') url = url.substring(4);
  if(url.substring(url.length-4).indexOf('.') === -1) url = url + ".com";
  return url;
};

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites/'),
  'list' : path.join(__dirname, '../archives/sites.txt'),
  'index' : path.join(__dirname, '../web/public/index.html'),
  'loading' : path.join(__dirname, '../web/public/loading.html'),
};

exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, 'utf8', function(error, data){
    var list = data.split('\n');
    return callback(list);
  });
};

exports.isUrlInList = function(target, callback){
  exports.readListOfUrls(function(list){
    callback(_.contains(list, target));
  });
};

exports.addUrlToList = function(url){
  if (typeof url === 'string') url = url.toLowerCase();
  exports.isUrlInList(url, function(flag){
    if(!flag && url !== undefined){
      console.log("Added " + url + " to queue");
      fs.appendFile(exports.paths.list, url + '\n');
    }
  });
};

exports.isURLArchived = function(target, callback){
  fs.exists(exports.paths.archivedSites + target, function(exists){
    return callback(exists);
  });
};

exports.downloadUrls = function(){
  exports.readListOfUrls(function(list){
    _.each(list, function(site){
      exports.isURLArchived(site, function(result){
        if(!result){
          request.get(site, function(err, res){
            if (res){
              fs.writeFile(exports.paths.archivedSites + site, res.buffer.toString());
            }
          });
        }
      });
    });
  });
};