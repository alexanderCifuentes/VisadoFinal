const rp = require('request-promise');

class ObserverNotify{


notifyApi(id, artistName, albumName){
  const opt = {
    method: 'POST',
    uri: 'http://localhost:7000/api/notify',
    body: {
      artistId: id,
      artistName : artistName,
      albumName : albumName
    },
  json: true };
  rp(opt).then(console.log('Se envian los email'))
         .catch((error) => console.log('No se pudo enviar notificacion'));
}

}

module.exports = ObserverNotify;