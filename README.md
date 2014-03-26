# Box API Node.JS Client

## Setup

```javascript

var Box = require('node-box');

var box = new Box();

```

## Folders

### box.folders.info(folder_id)

Returns info given a folder ID

### box.folders.root

Returns info for the root folder (ID '0')

## Files

### box.files.upload(path, folder_id)

Uploads a file given a path and a folder ID

### box.files.createMetadata(metadata, file_id)

Create metadata for a given file (ID)
