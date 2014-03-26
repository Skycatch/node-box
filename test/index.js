var Box = require('../lib/');

var box = new Box();

box.files.upload('img/cat.jpg','1776997242', function(err, res){
  if(err){
    console.log(err);
  }else{
    var file_id = res.entries[0].id;

    var metadata = {
      'breed' : 'burmese',
      'country' : 'Burma',
      'origin': 'natural',
      'coat': 'short',
      'pattern': 'solid'
    };

    box.files.createMetadata(file_id, metadata, function(err, res){
      if(err)
        console.log(err);
      else
        console.log(res);
    });
  }

});
