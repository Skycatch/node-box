var Box = require('../lib/'),
    test = require('prova'),
    path = require('path'),
    async = require('async');

var fs = require('fs'),
    request = require('superagent');


var box = new Box({
  access_token: 'null'
});
