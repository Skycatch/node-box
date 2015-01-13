var Box = require('../lib/'),
    test = require('prova'),
    path = require('path'),
    async = require('async');

var fs = require('fs'),
    request = require('superagent');


var box = new Box({
  access_token: null
});

box.files.info('23806771379', function (err, res) {
  box.files.createSharedLink(res.id, function (err, res){
    console.log(err, res);
  });
});

// box.folders.items('2804097017', 1000, 0,'https://app.box.com/s/1lsz05uylsb8cg12ilkh', null, function (err, res) {
//   if (err) {
//     console.log(err);
//   }

//   var files = res.entries || [];

//   var outputDir = './testData/';

//   async.eachLimit(files, 4, function(file, cb) {

//     console.log('downloading: ' + file.name);

//     // get file url for download
//     box.files.download(file.id, 'https://app.box.com/s/1lsz05uylsb8cg12ilkh', function(err, res) {
//       if (err) {
//         cb(err);
//       }

//       // make request to download file to system
//       var req = request(res),
//           filePath = path.join(outputDir, file.name);
      
//       req.pipe(fs.createWriteStream(filePath));
//       req.on('err', function(err){
//         cb(err);
//       });
//       req.on('end', function(){
        
//           cb(null);
//       });
//     });

//   }, function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(files.length + ' file(s) downloaded');
//     }
//   });
// });

// test('Module', function(assert){
//   assert.ok(box.options);
//   assert.ok(box.options.access_token);
//   assert.ok(box.files);
//   assert.ok(box.folders);
//   assert.end();
// });

// test('Resource: Folders', function(t){

//   t.test('Method: root',function(assert){
//     box.folders.info('2095638196',function(err, res){
//       res.item_collection.entries.forEach(function(o){
//         box.files.info(o.id, 'extension,name', function(err, res2){
//           if(res2.extension === 'txt'){
//             box.files.download(res2.id, function(err, res3){
//               var file = fs.createWriteStream('./out/'+res2.name);
//               var req = request.get(res3);
//               req.pipe(file);

//             })
//           }
//         })
//       })
//       assert.notOk(err);
//       assert.ok(res);
//       assert.end();
//     });
//   });

// });
