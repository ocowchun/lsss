#!/usr/bin/env node

/**
 * Module dependencies.
 */


var program = require('commander');
var fs = require('fs');
var _ = require('lodash');
var moment = require('moment');
var bytes = require('bytes');
var colors = require('colors');
var userid = require('userid');

program
  .version('0.0.1')

function procressFile(fileName, file) {
  var fileSize = file['size'];
  var str = [];
  var userName = userid.username(file.uid);
  var groupName = userid.groupname(file.gid);
  var status = {
    isFile: true
  };

  str.push(userName);
  str.push(groupName);
  str.push(bytes(fileSize));
  str.push(fileName);
  str.push(file.mtime.getTime());


  if (!file.isFile()) {
    status.isFile = false;
  }
  return {
    data: str,
    status: status
  };
}

function getSpace(num) {
  var str = "";
  for (var i = 0, max = num; i < max; i++) {
    str += " ";
  }
  return str;
}

function addSpace(str, num) {
  return str + getSpace(num - str.length);
}

function renderTime(milliseconds) {
  var time = moment(milliseconds);
  return time.format('YYYY/MM/DD HH:mm:ss(ZZ)');
}

function renderFile(data, maxStrs) {
  var strs = [];
  strs.push(addSpace(data.data[0], maxStrs[0]));
  strs.push(addSpace(data.data[1], maxStrs[1]));
  strs.push(addSpace(data.data[2], maxStrs[2]).blue);
  if (data.status.isFile) {
    strs.push(addSpace(data.data[3], maxStrs[3]));
  } else {
    strs.push(addSpace(data.data[3], maxStrs[3]).cyan);
  }
  strs.push(renderTime(data.data[4]));

  console.log(strs.join(' '));
}
// http://code-maven.com/system-information-about-a-file-or-directory-in-nodejs


function showFile() {
  var dirPath = process.cwd();
  fs.readdir(dirPath, function(err, files) {
    var fileDatas = _.map(files, function(path) {
      var data = [path, fs.statSync(dirPath + '/' + path)];
      return procressFile.apply(this, data);
    });

    var maxStrs = _.reduce(fileDatas, function(memo, file) {
      return _.map(_.zip(memo, file.data), function(elem) {
        return _.max([elem[0], elem[1].length]);
      });
    }, [0, 0, 0, 0]);
    _.each(fileDatas, function(data) {
      renderFile(data, maxStrs);
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