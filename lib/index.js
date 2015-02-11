var VERSION = '0.0.1',
    fs = require('fs'),
    request = require('superagent'),
    path = require('path');

function merge (defaults, options) {
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


function Box (options) {
  var defaults = {
    base_url: 'https://api.box.com/2.0',
    upload_url: 'https://upload.box.com/api/2.0',
    access_token: null,
    refresh_token: null
  };

  this.options = merge(defaults, options);

  if (!this.options.access_token) {
    throw new Error('You need to provide an access token');
  } else {
    this.options.auth = 'Bearer '+ this.options.access_token;
  }

  this.folders = new Folders(this.options);
  this.files = new Files(this.options);
  this.sharedItems = new SharedItems(this.options);
  this.events = new Events(this.options);
}

Box.prototype.updateAccessToken = function (accessToken) {
  this.options.access_token = accessToken;
  this.options.auth = 'Bearer '+ this.options.access_token;
};

Box.VERSION = VERSION;
module.exports = Box;

// Files Resource
function Files (options) {
  this.options = options;
  this.resource = 'files';
}

// Utility method used to overload a method based on the number of arguments it has
// http://ejohn.org/blog/javascript-method-overloading/
function addMethod (object, name, fn) {
  var old = object[ name ];
  object[ name ] = function(){
    if ( fn.length == arguments.length ) {
      return fn.apply( this, arguments );
    } else if ( typeof old == 'function' ) {
      return old.apply( this, arguments );
    }
  };
}

// Uploads a file to a given folder... no custom filename
addMethod(Files.prototype, 'upload', function (filepath, folder, callback) {
  request
    .post(this.options.upload_url+'/'+this.resource+'/content')
    .set('Authorization', this.options.auth)
    .field('parent_id', folder)
    .attach('filename', filepath)
    .end(function (res) {
      if (res.error) {
        return callback('Error: '+res.error.message);
      }

      callback(null, res.body);
    });
});

// Uploads a file to a given folder a with custom filename
addMethod(Files.prototype, 'upload', function (filepath, filename, folder, callback) {
  request
    .post(this.options.upload_url+'/'+this.resource+'/content')
    .set('Authorization', this.options.auth)
    .field('attributes', JSON.stringify({
      parent: {
        id: folder
      },
      name: filename
    }))
    .attach('file', filepath)
    .end(function (res) {
      if (res.error) {
        return callback('Error: ' + res.error.message);
      }

      callback(null, res.body);
    });
});

// Retrieves a download link for the given file
addMethod(Files.prototype, 'download', function (file, callback) {
  request
    .get(this.options.base_url+'/'+this.resource+ '/' +file+ '/content')
    .set('Authorization', this.options.auth)
    .redirects(0)
    .end(function (res) {
      if (res.error) {
        return callback('Error: '+res.error.message);
      }

      callback(null, res.headers.location);
    });
});

// Retrieves a download link for the given file from a shared item
addMethod(Files.prototype, 'download', function (file, shareLink, callback) {
  var req = request.get(this.options.base_url+'/'+this.resource+ '/' +file+ '/content');

  req.set('Authorization', this.options.auth);
  req.set('BoxApi', 'shared_link='+shareLink);
  req.redirects(0);
  req.end(function (res) {
    if (res.error) {
      return callback('Error: '+res.error.message);
    }

    callback(null, res.headers.location);
  });
});

Files.prototype.info = function (file, fields, callback) {
  if (typeof fields === 'function') {
    callback = fields;
    fields = null;
  }
  var uri = this.options.base_url+'/'+this.resource+'/'+file;

  if (fields) {
    uri += '?fields=' + fields;
  }

  request
    .get(uri)
    .set('Authorization', this.options.auth)
    .end(function (res) {
      if (res.error) {
        return callback('Error: '+res.error.message);
      }

      callback(null, res.body);
    });
};

// Creates metadata for a given file
Files.prototype.createMetadata = function (file, metadata, callback) {
  request
    .post(this.options.base_url+'/'+this.resource+'/'+file+'/metadata/properties')
    .set('Authorization', this.options.auth)
    .send(metadata)
    .end(function (res) {
      if(res.error)
        return callback('Error: '+res.error.message);

      callback(null, res.body);
    });
};

Files.prototype.createSharedLink = function(file, sharedLinkSettings, callback) {
  if (typeof sharedLinkSettings === 'function') {
    callback = sharedLinkSettings;
    sharedLinkSettings = {"shared_link": {}};
  }

  request
    .put(this.options.base_url+'/'+this.resource+'/'+file)
    .set('Authorization', this.options.auth)
    .send(sharedLinkSettings)
    .end(function (res) {
      if (res.error) {
        return callback('Error: '+res.error.message);
      }

      callback(null, res.body);
    });
};

// Folders Resource
function Folders (options) {
  this.options = options;
  this.resource = 'folders';
}

// Retrieves info and lists contents of the root folder
Folders.prototype.root = function (callback) {
  request
    .get(this.options.base_url+'/'+this.resource+'/0')
    .set('Authorization', this.options.auth)
    .end(function (res) {
      if (res.error) {
        return callback('Error: '+res.error.message);
      }

      callback(null, res.body);
    });
};

// Retrieves info and lists contents of the given folder
Folders.prototype.info = function (folder, callback) {
  request
    .get(this.options.base_url+'/'+this.resource+'/'+folder)
    .set('Authorization', this.options.auth)
    .end(function (res) {
      if (res.error) {
        return callback('Error: '+res.error.message);
      }

      callback(null, res.body);
    });
};

addMethod(Folders.prototype, 'items', function (folder, limit, offset, fields, callback) {
  if (typeof fields === 'function') {
    callback = fields;
    fields = null;
  }
  var uri = this.options.base_url+'/'+this.resource+'/'+folder+'/items';

  if (fields) { 
    uri += '?fields=' + fields +'&offset=' + offset + '&limit='+ limit;
  } else {
    uri += '?offset=' + offset + '&limit='+ limit;
  }

  var req = request.get(uri);
  req.set('Authorization', this.options.auth);
  req.end(function (res) {
    if (res.error) {
      return callback('Error: ' + res.error.message);
    }

    callback(null, res.body);
  });
});

// Get items in shared folder
addMethod(Folders.prototype, 'items', function (folder, limit, offset, shareLink, fields, callback) {
  if (typeof fields === 'function') {
    callback = fields;
    fields = null;
  }
  var uri = this.options.base_url+'/'+this.resource+'/'+folder+'/items';

  if (fields) { 
    uri += '?fields=' + fields +'&offset=' + offset + '&limit='+ limit;
  } else {
    uri += '?offset=' + offset + '&limit='+ limit;
  }

  var req = request.get(uri);
  req.set('Authorization', this.options.auth);
  req.set('BoxApi', 'shared_link='+shareLink);
  req.end(function (res) {
    if (res.error) {
      return callback('Error: '+res.error.message);
    }

    callback(null, res.body);
  });
});

// Creates a new folder given the parent
Folders.prototype.create = function (name, parent, callback) {
  request
    .post(this.options.base_url+'/'+this.resource)
    .set('Authorization', this.options.auth)
    .send({
      name: name,
      parent : { id: parent }
    })
    .end(function (res) {
      if (res.error) {
        return callback('Error: '+res.error.message);
      }

      callback(null, res.body);
    });
};

// Deletes a folder. Recursive arguement must be included in order to delete folders that have items inside of them
Folders.prototype.delete = function (folder, recursive, callback) {
  if (typeof recursive === 'function') {
    callback = recursive;
    recursive = false;
  }

  var url = this.options.base_url+'/'+this.resource+'/'+folder+'?recursive='+recursive;

  request
    .del(url)
    .set('Authorization', this.options.auth)
    .end(function (res) {
      if (res.error) {
        return callback('Error: '+res.error.message);
      }

      callback(null, res.body);
    });
};

// Shared Items Resource
function SharedItems (options) {
  this.options = options;
  this.resource = 'shared_items';
}

SharedItems.prototype.info = function (shareLink, callback) {
  request
    .get(this.options.base_url+'/'+this.resource)
    .set('Authorization', this.options.auth)
    .set('BoxApi', 'shared_link='+shareLink)
    .end(function (res) {
      if (res.error) {
        return callback('Error: '+res.error.message);
      }

      callback(null, res.body);
    });
};

// Events Resource
function Events (options) {
  this.options = options;
  this.resource = 'events';
}

Events.prototype.get = function (stream_position, callback) {
  request
  .get(this.options.base_url+'/'+this.resource+'/?stream_position=' + stream_position)
  .set('Authorization', this.options.auth)
  .end(function (res) {
    if (res.error) {
      return callback('Error: '+res.error.message);
    }

    callback(null, res.body);
  });
};

