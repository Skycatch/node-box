# Box API Node.JS Client

## Install

    npm install nodejs-box

## Setup

First, you need to go through the [OAuth2](http://developers.box.com/oauth/) process with Box.com, so that you can receive an access token.
I recommend the [box-passport](https://github.com/bluedge/passport-box) module to help with this.

```javascript
var Box = require('nodejs-box');

var box = new Box({
  access_token: 'YOUR_ACCESS_TOKEN_GOES_HERE',
  refreh_token: 'YOUR_REFRESH_TOKEN_GOES_HERE'
});
```

## Example Usage

### Working with files

Once you've creted a `Box` instance (see above section) you can act on file
resources by calling functions on `box.files`.

#### Uploading a file
There are two ways to upload a file:

* If the file has a custom filename

`box.files.upload(filepath, filename, folderId, callback);`

* If the file does not have a custom filename

`box.files.upload(filepath, folderId, callback);`

#### Create and view information about a file
Get information about a file:

`box.files.info(fileId, fields, callback);`

Create metadata for a file:

`box.files.createMetadata(fileId, metadata, callback);`

Get all metadata for a file

`box.files.getAllMetadata(fileId, callback);`

Get specific metadata for a file. The `path` parameter is a combination of the `scope` and `template` attributes on the Box.com api,
so will look like `enterprise/marketingCollateral`. For more detail, see the [Box.com api docs](https://box-content.readme.io/#metadata-object)

`box.files.getMetadata(fileId, path, callback);`

#### Download links
There are two ways to get a download link for a file:

* Retrieve a download link for the given file without a shared item:

`box.files.download(fileId, callback);`

* Retrieve a download link for the given file from a shared item:

`box.files.download(fileId, shareLink, callback);`

#### Creating a shared link
Create a shared link:

`box.files.createSharedLink(file, sharedLinkSettings, callback);`

### UPDATED README COMING SOON
