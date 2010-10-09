var assert = require('assert');
var dmap = require('dmap');
var sys = require('sys');
var fs = require('fs');

[{
  item: ['mspi', 0],
  length: 9,
  bytes: [109,115,112,105,0,0,0,1,0]
}, {
  item: ['mcty', 1],
  length: 10,
  bytes: [109, 99, 116, 121,0,0,0,2,0,1]
}, {
  item: ['mstt',200],
  length: 12,
  bytes: [109,115,116,116,0,0,0,4,0,0,0,200]
}, {
  item: ['mper',1],
  length: 16,
  bytes: [109,112,101,114,0,0,0,8,0,0,0,0,0,0,0,1]
}, {
  item: ['minm', 'ABC'],
  length: 11,
  bytes: [109, 105, 110, 109, 0, 0, 0, 3, 65, 66, 67]
}, {
  item: ['mpro', {major: 2, minor: 5}],
  length: 12,
  bytes: [109,112,114,111,0,0,0,4,0,2,0,5]
}].forEach(function(fix) {
  assert.equal(fix.length, dmap.encodedLength(fix.item), 'encodedLength: ' + fix.item);
  assert.deepEqual(fix.bytes, dmap.encode(fix.item), 'encode: ' + fix.item);
  assert.deepEqual(fix.item, dmap.decode(fix.bytes), 'decode: ' + fix.item);
});

var fixture_root = './test/fixtures/';
var dmap_root = fixture_root + 'dmap/';
var json_root = fixture_root + 'json/';
fs.readdirSync(dmap_root).forEach(function(file) {
  var dmap_fix = fs.readFileSync(dmap_root + file);
  var json_fix = JSON.parse(fs.readFileSync(json_root + file));

  var encoded = dmap.encode(json_fix);

  assert.ok(compare(dmap_fix, dmap.encode(json_fix)), 'enocde - ' + file);
  assert.deepEqual(json_fix, dmap.decode(dmap_fix), 'deocde - ' + file);

  var buffer = [];
  dmap.encode(json_fix, buffer);
  assert.ok(compare(dmap_fix, buffer), 'encode to buffer - ' + file);
});

function compare(a, b) {
  if (a == undefined || b == undefined) {
    return false;
  }

  if (a.length != b.length) {
    return false; 
  }

  for(var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) {
      return false;
    }
  }

  return true;
}


/*
var now_fixture = 'Sun, 29 Aug 2010 20:20:53 GMT';
var now = new Date(now_fixture);
var now_bytes = [76, 122, 193, 37];
assert.deepEqual(now_bytes, dmap.pack_date(now), 'pack_date');
assert.deepEqual(now_bytes, dmap.pack_date(now_fixture), 'pack_date');
assert.equal(now.getTime(), dmap.unpack_date(now_bytes, 0).getTime(), 'unpack_date');
*/
