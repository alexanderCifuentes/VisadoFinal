const rp = require('request-promise');

class Track{
  constructor(name,duracion,genres, id){
    this.id =id;
    this.name = name;
    this.duration = duracion;
    this.genres = genres;
    this.lyric = null;
  }

  //retorna un booleano indicando si contiene alguno de los generos pasados como parametro
  containSomeGenres(arrayGeneros){
    const genTrack = this.genres.map((gen) => gen.toLowerCase());  
    return arrayGeneros.map((ele) => ele.toLowerCase()).some((genre) => genTrack.includes(genre));
  }


  //---------------------------------- VISADO2 -------------------------------------

  getLyrics(){
    
    //if(!this.lyric){
      const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
      const options = {
        uri: BASE_URL + '/track.search',//'/matcher.track.get',
        qs: {
          apikey: '3890c790db91d08cff064fbebf1defc5',
          q_track_artist : this.name,},
          json: true,
        };
        rp.get(options).then((response) =>{const header = response.message.header;
          const body = response.message.body;
          const id =body.track_list[0].track.track_id;
          if (header.status_code !== 200){
          console.log('status code != 200');}
          this.getLiricsForId(id);
        })
        .catch((error) => {
          console.log('No se encontro el track en musixmatch', error);});
    }
    
    getLiricsForId(id){
      const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
      const options = {
        uri: BASE_URL + '/track.lyrics.get',
        qs: {
          apikey: '3890c790db91d08cff064fbebf1defc5',
          track_id : id}, 
        json: true 
      };
      rp.get(options).then( (response) => {const header = response.message.header;
        const body = response.message.body;
        
        if (header.status_code !== 200){console.log('El track no contiene lyrics');}
        else{
          this.lyric = body.lyrics.lyrics_body;
          console.log(this.lyric);
        }
      })
      .catch((error) => {console.log(error);});
    }


}

module.exports = Track;