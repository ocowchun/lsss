#!/usr/bin/env node

/**
 * Module dependencies.
 */


var program = require('commander');
var fs = require('fs');
var Rx = require('rx');
var bytes = require('bytes');
var colors = require('colors');
var userid = require('userid');

program
  .version('0.0.1')

function renderFile(fileName, file) {
  var fileSize = file['size'];
  var str = [];
  var userName = userid.username(file.uid);
  var groupName = userid.groupname(file.gid);

  str.push(userName);
  str.push(groupName);

  str.push(bytes(fileSize).green)

  // str.push(file['mtime']);

  if (file.isFile()) {
    str.push(fileName)
  } else {
    str.push(fileName.cyan)
  }

  console.log(str.join(' '));
}
// http://code-maven.com/system-information-about-a-file-or-directory-in-nodejs


function showFile() {
  var dirPath = process.cwd();
  fs.readdir(dirPath, function(err, files) {
    Rx.Observable.from(files, function(path) {
      return [path, fs.statSync(dirPath + '/' + path)];
    }).subscribe(
      function(data) {
        renderFile.apply(this, data);
      },
      function(err) {
        console.log('Error: ' + err);
      },
      function() {
      });

  });
}

program
  .command('init')
  .description('initialize da config')
  .action(function() {
    console.log(process.cwd());

  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  showFile();
}
