var VERSION = '0.0.1',
    fs = require('fs'),
    request = require('superagent'),
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

  if(!this.options.access_token){
    throw new Error('You need to provide an access token');
  }else{
    this.options.auth = 'Bearer '+ this.options.access_token;
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

// Creates a shared link to a file
Files.prototype.createSharedLink = function(file, fields, callback){
  if(typeof fields === 'function'){
    callback = fields;
    fields = null;
  }
  var uri = this.options.base_url+'/'+this.resource+'/'+file;

  if (!fields) {
    fields = { access : 'open' };
  }

  request
    .put(uri)
    .set('Authorization', this.options.auth)
    .send({
      shared_link : fields
    })
    .end(function(res){
      if(res.error)
        return callback('Error: '+res.error.message);

      callback(null, res.body);
    });
}

// Retrieves a download link for the given file
Files.prototype.download = function(file, callback){
  request
    .get(this.options.base_url+'/'+this.resource+ '/' +file+ '/content')
    .set('Authorization', this.options.auth)
    .redirects(0)
    .end(function(res){
      if(res.error)
        return callback('Error: '+res.error.message);

      callback(null, res.headers.location);
    });
};

Files.prototype.info = function(file, fields, callback){
  if(typeof fields === 'function'){
    callback = fields;
    fields = null;
  }
  var uri = this.options.base_url+'/'+this.resource+'/'+file;

  if(fields) uri += '?fields=' + fields;

  request
    .get(uri)
    .set('Authorization', this.options.auth)
    .end(function(res){
      if(res.error)
        return callback('Error: '+res.error.message);

      callback(null, res.body);
    });
}

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

// Creates a new folder given the parent
Folders.prototype.create = function(name, parent, callback){
  request
    .post(this.options.base_url+'/'+this.resource)
    .set('Authorization', this.options.auth)
    .send({
      name: name,
      parent : { id: parent }
    })
    .end(function(res){
      if(res.error)
        return callback('Error: '+res.error.message);

      callback(null, res.body);
    });
};

// Deletes a folder. Recursive arguement must be included in order to delete folders that have items inside of them
Folders.prototype.delete = function(folder, recursive, callback){
  if(typeof recursive === 'function'){
    callback = recursive;
    recursive = false;
  }

  var url = this.options.base_url+'/'+this.resource+'/'+folder+'?recursive='+recursive;

  request
    .del(url)
    .set('Authorization', this.options.auth)
    .end(function(res){
      if(res.error)
        return callback('Error: '+res.error.message);

      callback(null, res.body);
    });
};
