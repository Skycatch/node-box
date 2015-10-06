var Box = require('../lib/'),
    nock = require('nock'),
    path = require('path'),
    test = require('prova');

var fs = require('fs'),
    request = require('superagent');


var box = new Box({
  access_token: 'null'
});

test('file.upload without custom filename', function (t) {
  t.plan(1);
  var boxFileId = 'box-file-id',
      uploadFileName = 'a.txt',
      filepath = __dirname + '/' + uploadFileName,
      folderId = '1234';

  nock(box.options.upload_url)
  .post('/files/content', function(body) {
    folderIdParamRegex = 'name="parent_id"' + folderId;
    filenameParamRegex = 'name="filename"; filename="' + uploadFileName + '"';
    return body.match(folderIdParamRegex) && body.match(filenameParamRegex);
  })
  .reply(201, { id: boxFileId });

  box.files.upload(filepath, folderId, function(err, success) {
    if (err) {
        throw err;
    }
    t.equal(success.id, boxFileId);
  });
});
