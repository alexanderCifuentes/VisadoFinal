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
  rp(opt).then(console.log('ok'))
         .catch((error) => console.log(error));
}

}

module.exports = ObserverNotify;