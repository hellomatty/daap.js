// Copyright 2010 Matthew Wood
//
// Licensed under the Apache License, Version 2.0

var sys = require('sys');
var fs = require('fs');

var Song = exports.Song = function(options) {
  options = options || {};

  if (!options.file) {
    throw "Song constructor needs a file";
  } else {
    this.file = options.file;

    var song = this;
    fs.stat(this.file, function(err, stats) {
      if (err) {
        throw "Failed to stat " + song.file;
      } else {
        song.size = stats.size;
      }
    });
  }

  this.artist = options.artist || options.file;
  this.name = options.name || options.file;
  this.album = options.album || options.file;

  var now = new Date();
  this.dateAdded = now;
  this.dateModified = now;

  this.time = options.time || 0;
};

exports.getAllFromDirectory = function(dir) {
  return [];
};
