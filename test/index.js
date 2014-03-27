var Box = require('../lib/'),
    test = require('prova');

var box = new Box({
  access_token: process.env.access_token
});


test('Module', function(assert){
  assert.ok(box.options);
  assert.ok(box.options.access_token);
  assert.ok(box.files);
  assert.ok(box.folders);
  assert.end();
});

test('Resource: Folders', function(t){

  t.test('Method: root',function(assert){
    box.folders.root(function(err, res){
      assert.notOk(err);
      assert.ok(res);
      assert.end();
    });
  });

  var testFolderID = null,
      testFolderName = 'Test Folder';

  t.test('Method: create', function(assert){
    box.folders.create(testFolderName, '0', function(err, res){
      assert.notOk(err);
      assert.ok(res);

      testFolderID = res.id;

      assert.end();
    });
  });

  t.test('Method: info', function(assert){
    box.folders.info(testFolderID, function(err, res){

      assert.notOk(err);
      assert.ok(res);

      assert.equal(res.id, testFolderID);
      assert.equal(res.name, testFolderName);

      assert.end();
    });
  });

  t.test('Method: delete', function(assert){
    box.folders.delete(testFolderID, function(err, res){
      assert.notOk(err);
      assert.ok(res);

      assert.deepEqual(res, {});

      assert.end();
    });
  });


});

test('Resource: Files', function(t){
  function before(callback){
    box.folders.create('Test Folder 2', '0', function(err, res){
      if(err) return callback(err);

      callback(null, res.id);
    });
  }

  function after(id, callback){
    box.folders.delete(id, function(err, res){
      if(err) return callback(err);

      callback(null, res);
    });
  }

  before(function(err, folderID){
    t.notOk(err);

    t.test('Method: upload', function(assert){
      box.files.upload('./test/img/cat.jpg', folderID, function(err, res){
        assert.notOk(err);
        assert.ok(res);
        assert.end();
      });
    });

    after(folderID, function(err, res){
      t.notOk(err);
      t.ok(res);

      t.deepEqual(res, {});


      t.end();
    });
  });
});
