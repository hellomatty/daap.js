var daap = require('daap');
var Song = require('song').Song;

daap.createServer({
  advertise:true,
  songs: [new Song({
          file: 'cancion.mp3'
        })]
}).listen(36850);
