var Box = require('../lib/'),
    test = require('prova'),
    async = require('async');

var fs = require('fs'),
    request = require('superagent');


var box = new Box({
  access_token: process.env.token
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
    box.folders.info('2095638196',function(err, res){
      res.item_collection.entries.forEach(function(o){
        box.files.info(o.id, 'extension,name', function(err, res2){
          if(res2.extension === 'txt'){
            box.files.download(res2.id, function(err, res3){
              var file = fs.createWriteStream('./out/'+res2.name);
              var req = request.get(res3);
              req.pipe(file);

            })
          }
        })
      })
      assert.notOk(err);
      assert.ok(res);
      assert.end();
    });
  });

});
