# Box API Node.JS Client

## Install

    npm install nodejs-box

## Setup

```javascript
var Box = require('nodejs-box');

var box = new Box();
```

## Folders

### box.folders.info(folder_id, callback)

Returns info given a folder ID

### box.folders.root(callback)

Returns info for the root folder (ID '0')

### box.folders.create(folder_name, parent_folder_id, callback)

Creates a new folder, given a name and the ID of the parent folder

### box.folders.delete(folder_id, recursive*, callback)

Deletes a folder, given a folder ID.
Optionally takes a second argument, 'recursive', that holds a boolean value, which,
if true, will delete the folder even if it is not empty.

## Files

### box.files.upload(path, folder_id)

Uploads a file given a path and a folder ID

### box.files.createMetadata(metadata, file_id)

Create metadata for a given file (ID)

Note: Your app/account has to be authorized for the Metadata API beta to use this.

## Test

Run `export access_token='YOUR_TOKEN_GOES_HERE' && npm test`
