var assert = require('assert');
var binary = require('binary');
var sys = require('sys');

assert.equal(0, binary.packByte(0), 'pack_byte: 0');
assert.equal(255, binary.packByte(255), 'pack_byte: 255');

assert.equal(0, binary.unpackByte([0]), 'unpack_byte: 0');
assert.equal(255, binary.unpackByte([255]), 'unpack_byte: 255');

assert.deepEqual([0, 0], binary.packShort(0), 'pack_short: 0');
assert.deepEqual([0, 255], binary.packShort(255), 'pack_short: 255');
assert.deepEqual([1, 1], binary.packShort(257), 'pack_short: 256');

assert.equal(0, binary.unpackShort([0,0]), 'unpack_short: 0');
assert.equal(255, binary.unpackShort([0,255]), 'unpack_short: 255');
assert.equal(257, binary.unpackShort([1,1]), 'unpack_short: 257');

assert.deepEqual([0, 0, 0, 0], binary.packInt(0), 'pack_int: 0');
assert.deepEqual([0, 0, 0, 255], binary.packInt(255), 'pack_int: 255');
assert.deepEqual([109,115,112,105], binary.packInt('mspi'), 'pack_int: mspi');
assert.deepEqual([0, 0, 1, 1], binary.packInt(257), 'pack_int: 256');

assert.equal(0, binary.unpackInt([0,0,0,0]), 'unpack_int: 0');
assert.equal(1, binary.unpackInt([0,0,0,1]), 'unpack_int: 1');
assert.equal(257, binary.unpackInt([0,0,1,1]), 'unpack_int: 257');

assert.deepEqual([ 0, 0, 0, 0, 0, 0, 0, 1 ], binary.packLong(1), 'pack_long: 1');

assert.equal(1, binary.unpackLong([0,0,0,0,0,0,0,1]), 'unpack_long: 1');

assert.deepEqual([65, 66, 67], binary.packString('ABC'), 'pack_string: abc');;
assert.deepEqual([0xC2, 0xA2], binary.packString('\u00A2'), 'pack_string: U+00A2');;
assert.deepEqual([0xE2, 0x82, 0xAC], binary.packString('\u20AC'), 'pack_string: U+20AC');;

assert.deepEqual('ABC', binary.unpackString([65, 66, 67], 0, 3), 'unpack_string: abc');
assert.deepEqual('\u00a2', binary.unpackString([0xC2, 0xA2], 0, 2), 'unpack_string: \U+00A2');
assert.deepEqual('\u20AC', binary.unpackString([0xE2,0x82,0xAC], 0, 3), 'unpack_string: \U+20AC');
assert.deepEqual('\uFEFFCamino Del Sol', binary.unpackString([0xff, 0xfe, 0x43, 00, 0x61, 00, 0x6d, 00, 0x69, 00, 0x6e, 00, 0x6f, 00, 0x20, 00, 0x44, 00, 0x65, 00, 0x6c, 00, 0x20, 00, 0x53, 00, 0x6f, 00, 0x6c, 00], 0, 30, binary.characterEncoding.utf16));

var now_fixture = 'Sun, 29 Aug 2010 20:20:53 GMT';
var now = new Date(now_fixture);
var now_bytes = [76, 122, 193, 37];
assert.deepEqual(now_bytes, binary.packDate(now), 'pack_date');
assert.deepEqual(now_bytes, binary.packDate(now_fixture), 'pack_date');
assert.equal(now.getTime(), binary.unpackDate(now_bytes, 0).getTime(), 'unpack_date');
