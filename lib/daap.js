// Copyright 2010 Matthew Wood
//
// Licensed under the Apache License, Version 2.0

var http = require('http');
var sys = require('sys');
var fs = require('fs');
var dmap = require('dmap');
var url = require('url');
var Buffer = require('buffer').Buffer;
var Router = require('router').Router;
var mdns;
try {
  mdns = require('mdns');
} catch (e) {
  sys.log('[startup] mdns not loaded: ' + e);
}
var Song = require('song').Song;

function DaapServer(options) {
  options = options || {};

  var name = options.name || 'daap.js';
  this.state = {
    sessions: 0,
    revision: 1,
    name: name,
    databases: [
      {
        name: name,
        songs: [],
        playlists: [{
          name: name,
          songs: []
        }],
      }
    ]
  };

  var target = this;
  if (options.songs) {
    var i = 0;
    options.songs.forEach(function(song) {
      target.state.databases[0].songs.push(song);
      target.state.databases[0].playlists[0].songs.push(i++);
    });
  }

  this.advertise = (options.advertise == true);

  this._http = http.createServer(function (req, res) {
      DaapServer.router().exec(req, res, target);
  });
}

exports.createServer = function(options) {
  return new DaapServer(options);
};

DaapServer.prototype.listen = function(port) {
  port = port || 3689;

  this._http.listen(port);

  if (mdns && this.advertise) {
    sys.log('[mdns] advertising _daap._tcp on port ' + port);
    var mdnsAdvert = mdns.createAdvertisement('daap', port, 'tcp', 0, 0, this.state.name).start();
  }
}

DaapServer.router = function() {
  return DaapServer.prototype._router;
};

DaapServer.prototype._router = new Router();
DaapServer.prototype._router.add_route('/server-info', function(context) {
  reply(context.response, 
    ["msrv",[
      ["mstt", 200],
      ["mpro", {"major":2,"minor":0}],
      ["apro", {"major":3,"minor":0}],
      ["minm", this.state.name],
      ["msau", 0],
      ["mstm", 1800],
      ["msex", 0],
      ["msix", 0],
      ["msbr", 0],
      ["msqy", 0],
      ["msup", 0],
      ["msdc", this.state.databases.lengs]
    ]]
  );
});

DaapServer.prototype._router.add_route("/content-codes", function(context) {
  reply(context.response, ['mccr', dmap.contentCodes.getAllTags().map(function(tag) {
    var defn = dmap.contentCodes.definition(tag);

    return ['mdcl', [
      ['mcna', defn.name],
      ['mcnm', tag],
      ['mcty', defn.type]
    ]]
  })]);
});

DaapServer.prototype._router.add_route("/login", function(context) {
  reply(context.response, 
    ["mlog",[
      ["mstt", 200],
      ["mlid", this.state.sessions++]
    ]]
  );
});

DaapServer.prototype._router.add_route("/update", function(context) {
  if(context.params['delta']) {
// iTunes expects library updates to be streamed in response
// close this connection and playbakc seems to stop
    context.response.connection.setTimeout(0);
  } else {
    reply(context.response, 
      ["mupd",[
        ["mstt", 200],
        ["musr", this.state.revision]
      ]]
    );
  }
});

DaapServer.prototype._router.add_route('/databases', function(context) {
  var i = 0;
  reply(context.response, 
    ["avdb", [
      ["mstt", 200],
      ["muty", 0],
      ["mtco", this.state.databases.length],
      ["mrco", this.state.databases.length],
      ["mlcl", this.state.databases.map(function(db) {
        var urlkey = indexToUrlkey(i++);
        return ["mlit", [
                 ["miid", urlkey],
                 ["mper", urlkey],
                 ["minm", db.name],
                 ["mimc", db.songs.length],
                 ["mctc", db.playlists.length]
        ]];
      })]
    ]]
  );
});

DaapServer.prototype._router.add_route('/databases/:dbid/items', function(context) {
  var meta = context.params['meta'].split(',');

  var songs = this.state.databases[urlkeyToIndex(context.params['dbid'])].songs;

  var i = 0;
  reply(context.response,
    ["adbs",[
      ["mstt", 200],
      ["muty", 0],
      ["mtco", songs.length],
      ["mrco", songs.length],
      ["mlcl", songs.map(function(song) {
        var urlkey = indexToUrlkey(i++);
        return ["mlit", [
          ['mikd', 2],
          ['miid', urlkey],
          ['mper', urlkey],
          ['asdk', 0],
          ['asul', ''],
          ['asal', song.album],
          ['asar', song.artist],
          ['ascm', ''],
          ['asda', song.dateAdded],
          ['asdm', song.dateModified],
          ['asdc', 1],
          ['asdn', 1],
          ['asgn', ''],
          ['asfm', 'mp3'],
          ['asdt', 'mp3 audio file'],
          ['minm', song.name],
          ['assz', song.size],
          ['asst', 0],
          ['assp', 0],
          ['astm', song.time],
          ['astc', 1],
          ['astn', 1],
          ['asyr', 1900 + song.dateAdded.getYear()]
        ].filter(function(item) {
          return (meta.indexOf(dmap.contentCodes.definition(dmap.tag(item)).name) > -1);
        })];
      })]
    ]]
  );
},{
  pattern:{
    dbid: '(\\d+)'
  },
  type:{
    dbid: Number
  }
});

DaapServer.prototype._router.add_route('/databases/:dbid/containers', function(context) {
  var playlists = this.state.databases[urlkeyToIndex(context.params['dbid'])].playlists;
 
  var i = 0; 
  reply(context.response, 
    ["aply", [
      ["mstt",200],
      ["muty",0],
      ["mtco", playlists.length],
      ["mrco", playlists.length],
      ["mlcl", playlists.map(function(playlist) {
          var urlkey = indexToUrlkey(i++);
          return ['mlit', [
            ["miid", urlkey],
            ["mper", urlkey],
            ["minm", playlist.name],
            ["mimc", playlist.songs.length]
        ]];
      })]
    ]]
  );
}, {
  pattern: {
    dbid: '(\\d+)'
  },
  type: {
    dbid: Number
  }
});

DaapServer.prototype._router.add_route('/databases/:dbid/containers/:playlistid/items', function(context) {
  var songs = this.state.databases[urlkeyToIndex(context.params['dbid'])].playlists[urlkeyToIndex(context.params['playlistid'])].songs;

  reply(context.response, 
    ["apso",[
      ["mstt",200],
      ["muty",0],
      ["mtco",songs.length],
      ["mrco",songs.length],
      ["mlcl", songs.map(function(id) {
        return ["mlit", [
          ["mikd", 2],
          ["miid", indexToUrlkey(id)],
        ]];
      })]
    ]]
  );
}, {
  pattern: {
    dbid: '(\\d+)',
    playlistid: '(\\d+)'
  },
  type: {
    dbid: Number,
    playlistid: Number
  }
});

DaapServer.prototype._router.add_route('/databases/:dbid/items/:songid', function(context) {
  var song = this.state.databases[urlkeyToIndex(context.params['dbid'])].songs[urlkeyToIndex(context.params['songid'])];

  context.response.connection.setTimeout(0);

  var streamHeaders = {
      'Content-Type': 'audio/mp3',
      'Accept-Range': 'bytes',
      'Connection': 'Close'
  };

  var status, label, offset;
  var end  = song.size - 1;
  if (context.request.headers.range) {
    status = 206;
    label = 'Partial Content';

    var range = context.request.headers.range.split('=');
    offset = Number(range[1].split('-')[0]);

    streamHeaders['Content-Range'] = 'bytes ' + offset + '-' + end + '/' + song.size;
  } else {
    status = 200;
    label = 'OK';

    offset = 0;
  }

  streamHeaders['Content-Length'] = song.size - offset;
  context.response.writeHead(status, label, headers(streamHeaders));

  sys.log('[streaming] ' + song.file + ' from byte ' + offset);
  var reader = fs.createReadStream(song.file, {
    start: offset,
    end: end,
    bufferSize: 512}
  );

  sys.pump(reader, context.response);
}, {pattern: {
  dbid: '(\\d+)',
  songid: '(\\d+).mp3'
}, type: {
  dbid: Number,
  songid: Number
}});

function reply(response, item) {
  var label;
  var buffer;

  if (item.constructor == Buffer) {
    label = '<binary>';
    buffer = item;
  } else {
    label = dmap.tag(item);
    buffer = new Buffer(dmap.encodedLength(item));
    dmap.encode(item, buffer);
  }

  response.writeHead(200, headers({
    'Content-Length': buffer.length
  }));

  response.end(buffer);

  sys.log('[reply] ' + label + ' ' + buffer.length + ' bytes');
}

function headers(extra) {
  var headers = {
    'Date': 'Sat, 18 Sep 2010 13:03:17 GMT',
    'Content-Type': 'application/x-dmap-tagged',
    'DAAP-Server': 'daap.js/0.0'
  };

  for(var key in extra) {
    headers[key] = extra[key];
  }

  return headers;
}

function indexToUrlkey(i) {
  return i + 1;
}

function urlkeyToIndex(k) {
  return k - 1;
}
