// Copyright 2010 Matthew Wood
//
// Licensed under the Apache License, Version 2.0

var type = exports.type = {
  byte: 1,
  short: 3,
  int: 5,
  long: 7,
  string: 9,
  date: 10,
  version: 11,
  list: 12
};

exports.getAllTags = function() {
  return Object.keys(contentCodes);
};

exports.definition = function (tag) {
  var defn = contentCodes[tag];

  if (defn) {
    return defn;
  }

  throw new TypeError("Attempt to lookup unknown tag '" + tag + "'");
}

var contentCodes = [];
contentCodes['mper'] = {type: type.long, name: 'dmap.persistentid'};
contentCodes['arsv'] = {type: type.list, name: 'daap.resolve'};
contentCodes['arif'] = {type: type.list, name: 'daap.resolveinfo'};
contentCodes['mcon'] = {type: type.list, name: 'dmap.container'};
contentCodes['mbcl'] = {type: type.list, name: 'dmap.bag'};
contentCodes['mcnm'] = {type: type.int, name: 'dmap.contentcodesnumber'};
contentCodes['mudl'] = {type: type.list, name: 'dmap.deletedidlisting'};
contentCodes['asda'] = {type: type.date, name: 'daap.songdateadded'};
contentCodes['msur'] = {type: type.int, name: 'dmap.serverrevision'};
contentCodes['asyr'] = {type: type.short, name: 'daap.songyear'};
contentCodes['mlid'] = {type: type.int, name: 'dmap.sessionid'};
contentCodes['msex'] = {type: type.byte, name: 'dmap.supportsextensions'};
contentCodes['assr'] = {type: type.int, name: 'daap.songsamplerate'};
contentCodes['asdb'] = {type: type.byte, name: 'daap.songdisabled'};
contentCodes['mlit'] = {type: type.list, name: 'dmap.listingitem'};
contentCodes['asco'] = {type: type.byte, name: 'daap.songcompilation'};
contentCodes['asdm'] = {type: type.date, name: 'daap.songdatemodified'};
contentCodes['aeNV'] = {type: type.int, name: 'com.apple.itunes.norm-volume'};
contentCodes['mccr'] = {type: type.list, name: 'dmap.contentcodesresponse'};
contentCodes['msts'] = {type: type.string, name: 'dmap.statusstring'};
contentCodes['ascp'] = {type: type.string, name: 'daap.songcomposer'};
contentCodes['aseq'] = {type: type.string, name: 'daap.songeqpreset'};
contentCodes['mstt'] = {type: type.int, name: 'dmap.status'};
contentCodes['msal'] = {type: type.byte, name: 'dmap.supportsuatologout'};
contentCodes['muty'] = {type: type.byte, name: 'dmap.updatetype'};
contentCodes['asfm'] = {type: type.string, name: 'daap.songformat'};
contentCodes['abgn'] = {type: type.list, name: 'daap.browsegenrelisting'};
contentCodes['mupd'] = {type: type.list, name: 'dmap.updateresponse'};
contentCodes['musr'] = {type: type.int, name: 'dmap.serverrevision'};
contentCodes['asal'] = {type: type.string, name: 'daap.songalbum'};
contentCodes['abro'] = {type: type.list, name: 'daap.databasebrowse'};
contentCodes['miid'] = {type: type.int, name: 'dmap.itemid'};
contentCodes['ascm'] = {type: type.string, name: 'daap.songcomment'};
contentCodes['mspi'] = {type: type.byte, name: 'dmap.supportspersistentids'};
contentCodes['assz'] = {type: type.int, name: 'daap.songsize'};
contentCodes['astm'] = {type: type.int, name: 'daap.songtime'};
contentCodes['asdn'] = {type: type.short, name: 'daap.songdiscnumber'};
contentCodes['assp'] = {type: type.int, name: 'daap.songstoptime'};
contentCodes['astn'] = {type: type.short, name: 'daap.songtracknumber'};
contentCodes['aeSP'] = {type: type.byte, name: 'com.apple.itunes.smart-playlist'};
contentCodes['asgn'] = {type: type.string, name: 'daap.songgenre'};
contentCodes['mpco'] = {type: type.int, name: 'dmap.parentcontainerid'};
contentCodes['msrs'] = {type: type.byte, name: 'dmap.supportsresolve'};
contentCodes['avdb'] = {type: type.list, name: 'daap.serverdatabases'};
contentCodes['msrv'] = {type: type.list, name: 'dmap.serverinforesponse'};
contentCodes['mslr'] = {type: type.byte, name: 'dmap.loginrequired'};
contentCodes['msup'] = {type: type.byte, name: 'dmap.supportsupdate'};
contentCodes['mimc'] = {type: type.int, name: 'dmap.itemcount'};
contentCodes['mcna'] = {type: type.string, name: 'dmap.contentcodesname'};
contentCodes['apro'] = {type: type.version, name: 'daap.protocolversion'};
contentCodes['abar'] = {type: type.list, name: 'daap.browseartistlisting'};
contentCodes['mdcl'] = {type: type.list, name: 'dmap.dictionary'};
contentCodes['adbs'] = {type: type.list, name: 'daap.databasesongs'};
contentCodes['aply'] = {type: type.list, name: 'daap.databaseplaylists'};
contentCodes['msau'] = {type: type.byte, name: 'dmap.authenticationmethod'};
contentCodes['mstm'] = {type: type.int, name: 'dmap.timeoutinterval'};
contentCodes['asbt'] = {type: type.short, name: 'daap.songsbeatsperminute'};
contentCodes['asrv'] = {type: type.byte, name: 'daap.songrelativevolume'};
contentCodes['mcti'] = {type: type.int, name: 'dmap.containeritemid'};
contentCodes['asdk'] = {type: type.byte, name: 'daap.songdatakind'};
contentCodes['mlog'] = {type: type.list, name: 'dmap.loginresponse'};
contentCodes['asbr'] = {type: type.short, name: 'daap.songbitrate'};
contentCodes['msix'] = {type: type.byte, name: 'dmap.supportsindex'};
contentCodes['mcty'] = {type: type.short, name: 'dmap.contentcodestype'};
contentCodes['abal'] = {type: type.list, name: 'daap.browsealbumlistung'};
contentCodes['msqy'] = {type: type.byte, name: 'dmap.supportsquery'};
contentCodes['mikd'] = {type: type.byte, name: 'dmap.itemkind'};
contentCodes['astc'] = {type: type.short, name: 'daap.songtrackcount'};
contentCodes['minm'] = {type: type.string, name: 'dmap.itemname'};
contentCodes['mctc'] = {type: type.int, name: 'dmap.containercount'};
contentCodes['mrco'] = {type: type.int, name: 'dmap.returnedcount'};
contentCodes['mtco'] = {type: type.int, name: 'dmap.specifiedtotalcount'};
contentCodes['abpl'] = {type: type.byte, name: 'daap.baseplaylist'};
contentCodes['asst'] = {type: type.int, name: 'daap.songstarttime'};
contentCodes['asur'] = {type: type.byte, name: 'daap.songuserrating'};
contentCodes['abcp'] = {type: type.list, name: 'daap.browsecomposerlisting'};
contentCodes['asdt'] = {type: type.string, name: 'daap.songdescription'};
contentCodes['apso'] = {type: type.list, name: 'daap.playlistsongs'};
contentCodes['mpro'] = {type: type.version, name: 'dmap.protocolversion'};
contentCodes['mlcl'] = {type: type.list, name: 'dmap.listing'};
contentCodes['msbr'] = {type: type.byte, name: 'dmap.supportsbrowse'};
contentCodes['asdc'] = {type: type.short, name: 'daap.songdisccount'};
contentCodes['asar'] = {type: type.string, name: 'daap.songartist'};
contentCodes['msdc'] = {type: type.int, name: 'dmap.databasescount'};
contentCodes['asul'] = {type: type.string, name: 'daap.songdataurl'};
contentCodes['asda'] = {type: type.date, name: 'daap.songdataurl'};
