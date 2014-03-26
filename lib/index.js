var VERSION = '0.0.1',
    request = require('superagent'),
    fs = require('fs'),
    path = require('path');

function merge(defaults, options) {
	defaults = defaults || {};
	if (options && typeof options === 'object') {
		var keys = Object.keys(options);
		for (var i = 0, len = keys.length; i < len; i++) {
			var k = keys[i];
			if (options[k] !== undefined) defaults[k] = options[k];
		}
	}
	return defaults;
}


function Box(options){
  var defaults = {
    base_url: 'https://api.box.com/2.0',
    upload_url: 'https://upload.box.com/api/2.0',
    access_token: null,
    refresh_token: null
  };

  this.options = merge(defaults, options);

  if(!this.options.access_token || !this.options.refresh_token){
    throw new Error('You need to provide an access and refresh token');
  }else{
    this.options.auth = 'Bearer '+ access_token;
  }

  this.folders = new Folders(this.options);
  this.files = new Files(this.options);

}

Box.VERSION = VERSION;
module.exports = Box;

// Files Resource
function Files(options){
  this.options = options;
  this.resource = 'files';
}

// Uploads a file to a given folder
Files.prototype.upload = function(filename, folder, callback){
  request
    .post(this.options.upload_url+'/'+this.resource+'/content')
    .set('Authorization', this.options.auth)
    .field('parent_id', folder)
    .attach('filename', filename)
    .end(function(res){
      if(res.error)
        return callback('Error: '+res.error.message);

      callback(null, res.body);
    });
};

// Creates metadata for a given file
Files.prototype.createMetadata = function(file, metadata, callback){
  request
    .post(this.options.base_url+'/'+this.resource+'/'+file+'/metadata/properties')
    .set('Authorization', this.options.auth)
    .send(metadata)
    .end(function(res){
      if(res.error)
        return callback('Error: '+res.error.message);

      callback(null, res.body);
    });
};

// Folders Resource
function Folders(options){
  this.options = options;
  this.resource = 'folders';
}

// Retrieves info and lists contents of the root folder
Folders.prototype.root = function(callback){
  request
    .get(this.options.base_url+'/'+this.resource+'/0')
    .set('Authorization', this.options.auth)
    .end(function(res){
      if(res.error)
        return callback('Error: '+res.error.message);

      callback(null, res.body);
    });
};

// Retrieves info and lists contents of the given folder
Folders.prototype.info = function(folder, callback){
  request
    .get(this.options.base_url+'/'+this.resource+'/'+folder)
    .set('Authorization', this.options.auth)
    .end(function(res){
      if(res.error)
        return callback('Error: '+res.error.message);

      callback(null, res.body);
    });
};
