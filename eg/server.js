var daap = require('daap');
var Song = require('song').Song;

daap.createServer({
  advertise:true,
  songs: [new Song({name: 'Camino Del Sol',
          album: 'Jerez Funny Songs',
          artist: 'Spanish Lady',
          file: 'cancion.mp3'
        })]
}).listen(36850);
