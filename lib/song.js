// Copyright 2010 Matthew Wood
//
// Licensed under the Apache License, Version 2.0

var sys = require('sys');
var ID3v2 = require('id3v2').ID3v2;require('id3v2frames');
var StringUtils = require('stringutils');
var binary = require('binary');
var fs = require('fs');
var binary = require('binary');

var Song = exports.Song = function(options) {
  options = options || {};

  if (!options.file) {
    throw "Song constructor needs a file";
  }

  var song = this;

  var tags = {};

  var fd = fs.openSync(options.file, 'r');
  var reader = new BinaryFile(fd);

  if (binary.unpackString(reader.getBytesAt(0, 3), 0, 3) == "ID3") {
    sys.log("[id3v2] scanning tags...");
    tags = ID3v2.readTagsFromData(reader);
  }

  fs.stat(options.file, function(err, stats) {
    if (err) {
      throw "Failed to stat " + song.file;
    }
    
    song.size = stats.size;
  });

  this.file = options.file;

  this.artist = options.artist || tags.artist || options.file;
  this.name = options.name || tags.title || options.file;
  this.album = options.album || tags.album || options.file;

  var now = new Date();
  this.dateAdded = now;
  this.dateModified = now;

  this.time = options.time || 0;
};

exports.getAllFromDirectory = function(dir) {
  return [];
};

function BinaryFile(fd) {
  this.fd = fd;
}

BinaryFile.prototype.getStringAt = function(offset, length) {
  return binary.unpackString(this.getBytesAt(offset, length), 0, length);
}

BinaryFile.prototype.getLongAt = function(offset) {
  return binary.unpackInt(this.getBytesAt(offset, 4));
}

BinaryFile.prototype.getByteAt = function(offset) {
  return binary.unpackByte(this.getBytesAt(offset, 1));
}

BinaryFile.prototype.isBitSetAt = function(offset, bit) {
  var mask = 1 << bit;
  return this.getByteAt(offset) & mask == mask;
}

BinaryFile.prototype.getBytesAt = function(offset, length) {
  var buffer = new Buffer(length);
  var lastRead = fs.readSync(this.fd, buffer, 0, length, offset);
  return buffer;
}

BinaryFile.prototype.getStringWithCharsetAt = function(offset, length, charset) {
  var bytes = this.getBytesAt(offset, length);
  var string;

  switch( charset.toLowerCase() ) {
    case 'utf-16':
    case 'utf-16le':
    case 'utf-16be':
      string = StringUtils.readUTF16String(bytes, charset);
      if (string.charCodeAt(0) == 0xFEFF || string.charCodeAt(9) == 0xFFFE) {
        string = string.slice(1);
      }
      break;
    case 'utf-8':
      string = StringUtils.readUTF8String(bytes);
      break;
    default:
      string = StringUtils.readNullTerminatedString(bytes);
      break;
    }

  return string;
}

