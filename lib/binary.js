// Copyright 2010 Matthew Wood
//
// Licensed under the Apache License, Version 2.0

var sys = require('sys');

var packVersion = exports.packVersion = function (version, buffer, index) {
  index = index || 0;

  packShort(version.major, buffer, index);
  packShort(version.minor, buffer, index + 2);

  return buffer;
};

var packDate = exports.packDate = function (n, buffer, index) {
  var date;

  if (typeof n == 'string') {
    date = new Date(n);
  } else {
    date = n;
  }

  return pack(Math.floor(date.getTime() / 1000), 4, buffer, index);
};

var packLong = exports.packLong = function (n, buffer, index) {
  return pack(n, 8, buffer, index);
};

exports.packInt = function (n, buffer, index) {
  return pack(n, 4, buffer, index);
};

var packShort = exports.packShort = function (n, buffer, index) {
  return pack(n, 2, buffer, index);
};

exports.packByte = function (n, buffer, index) {
  return pack(n, 1, buffer, index);
};

var packString = exports.packString = function (string, buffer, index) {
  buffer = buffer || [];
  index = index || 0;
  string = string || '';

  for(var i = 0; i < string.length; i++) {
    buffer[index + i] = string.charCodeAt(i);
  }

  return buffer;
};

var unpackVersion = exports.unpackVersion = function (buffer, index) {
  index = index || 0;

  return {major: unpackShort(buffer, index),
    minor: unpackShort(buffer, index + 2)
  };
};

var unpackDate = exports.unpackDate = function(buffer, index) {
  var millis = unpack(buffer, index, 4) * 1000;

  return new Date(millis);
};

var unpackLong = exports.unpackLong = function (buffer, index) {
  return unpack(buffer, index, 8);
};

var unpackInt = exports.unpackInt = function (buffer, index) {
  return unpack(buffer, index, 4);
};

var unpackShort = exports.unpackShort = function (buffer, index) {
  return unpack(buffer, index, 2);
};

var unpackByte = exports.unpackByte = function (buffer, index) {
  return unpack(buffer, index, 1);
};

var unpackString = exports.unpackString = function (buffer, index, length) {
  var chars = [];
  for(var i = 0; i < length; i++) {
    chars.push(String.fromCharCode(buffer[index + i]));
  }

  return chars.join('');
};

function unpack(buffer, index, length) {
  index = index || 0;
  length = length || 0;

  var n = 0;
  var m = 1;
  for(var i = length - 1; i > -1; i--) {
    n += buffer[index + i] * m;
    m *= 256;
  }

  return n;
}

function pack(n, size, buffer, index) {
  buffer = buffer || [];
  index = index || 0;

  if (typeof n == 'string') {
    return packString(n.slice(0, size), buffer, index);
  }

  var m = 1;
  for (var i = 1; i <= size; i++) {
    buffer[index + size - i] = ( Math.floor(n / m) & 0xFF);

    m *= 256;
  }

  return buffer;
}
