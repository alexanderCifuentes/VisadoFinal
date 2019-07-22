const ErrorName = require('./nameExists');
const rp = require('request-promise');


class Artista{
    constructor(unName, unCountry, id){
      this.id = id;
      this.name = unName;
      this.albums =[];
      this.country = unCountry;
      this.consultaSpotify = false;
      this.token = 'BQB42vo2crU6Vr5UyLMCAH1b-6PQPPrm84g8cuenZZF4mUgMvqWTMYG0XANYrZfShTEHXYIVTugeV3IKB1Ilbi_xkDjJ3TLKX5fIGZR0R2MoMqy6O_2bUD8h-n3TQhBxeHKuyg09xVlMIyB6pYAuvCuZEzAY8DKh255x-q95OMRFkdkF2meI';  
    }
  
    
    //Actualiza los datos del artista
    update(name, country){
      this.name = name || this.name;
      this.country = country || this.country;
    }
  
    //---------------------Artista albunes-----------------------------------------------------------
  
    //Agrega un album a la lista de albunes y le setea el autor del album
    addAlbum(album){
      this.checkNameAlbum(album.name);
      this.albums.push(album); 
      
    }
  
    //Elimina el album correspondiente al ID de su lista de albunes
    removeAlbum(id){ 
      const index = this.albums.findIndex((album) => album.id === id);
      if(index > -1){
        this.albums.splice(index, 1);
      }
    }
  
    //retorna el album correspondiente al Id, podria retornar undefined
    getAlbumById(id){
      return this.albums.find((album) => album.id === id);
    }
  
    //retorna un booleano que indica si contiene el album correspondiente al Id
    containAlbumId(id){
      const album = this.getAlbumById(id);
      return album !== undefined;
    }
  
    //retorna el album que contiene el track correspondiente al Id, Podria retornar undefined
    albumWithTrackId(id){
      return this.albums.find((alb) => alb.containTrack(id));
    }
    
    //---------------------------------- Artista Track ----------------------------------------------------
    //retorna un booleano que indica si alguno de sus albunes contiene el track correspondiente al Id
    containTrackId(id){
      const album = this.albumWithTrackId(id); 
      return album !== undefined;
    }
  
    //Retorna el track correspondiente al ID
    getTrackId(trackId){
      return this.albumWithTrackId(trackId).getTrackById(trackId);
    }
  
    //retorna los tracks que tienen cada uno de sus albunes
    getTracks(){  
     return this.albums.map((a) => a.tracks).reduce((a,b) => a.concat(b),[]);  
    }
  
    // retorna: los tracks que contenga alguno de los generos pasados como parametro 
    getTracksMatchingGenres(genres) {
      return this.getTracks().filter((track) => track.containSomeGenres(genres));
    }
  
    //Controla que no haya un album con igual nombre en el artista
    checkNameAlbum(str){
      const name = this.albums.find((album)=> album.name.toLowerCase() === str.toLowerCase());
      if(name !== undefined){
        throw new ErrorName();
      }
    }
  
    //Elimina el track correspondiente al Id
    removeTrackId(id){
      this.albumWithTrackId(id).removeTrackId(id);
    }
//------------------------------------------------ VISADO2 ------------------------------------------------------
    //Agrega los albunes provenientes de spotify
    addAlbumsOfSpotify(){
      if(!this.consultaSpotify){
        const options = {
          url: 'https://api.spotify.com/v1/search',
          qs: { q : this.name,
            type: 'artist'},
          headers: { Authorization: 'Bearer ' + this.token },
          json: true,
        };
    
        rp.get(options)
          .then((response) => this.queryAlbumsForId(response.artists.items[0].id,artist))
          .catch((error) => {throw (error);}); 
      
          //this.consultaSpotify = true;
      }    
    }


    queryAlbumsForId(id){
      const options = {  
        url: 'https://api.spotify.com/v1/artists/'+id+'/albums?',
        qs: { type: 'album'},
        headers: { Authorization: 'Bearer ' + this.token },
        json: true,
      };
      rp.get(options).then((response) => {this.addAlbumsConsultaSpotify(response.items);
        console.log(response.items);
        console.log(this.albums);
      })
      .catch((error) => {throw (error);}); 
    }

    //Agrega los albunes 
    addAlbumsConsultaSpotify(lista){
      lista.forEach((element) => this.albums.push(this.newAlbum(element))); 
    }
    
    //Genera un nuevo album con la data de la consulta
    newAlbum(ele){
      const album = new Album(ele.name, parseInt(ele.release_date), parseInt(ele.id));
      return album;
    }




  
  }
  
  module.exports = Artista;


  /*queryAlbumsArtist(artist){
    
    const options = {
      url: 'https://api.spotify.com/v1/search',
      qs: { q : artist.name,
        type: 'artist'},
      headers: { Authorization: 'Bearer ' + this.token },
      json: true,
    };

    rp.get(options)
      .then((response) => this.queryAlbumsForId(response.artists.items[0].id,artist))
      .catch((error) => {throw (error);}); 
      
  }
                
  queryAlbumsForId(id, artist){
    const options = {  
      url: 'https://api.spotify.com/v1/artists/'+id+'/albums?',
      qs: { type: 'album'},
      headers: { Authorization: 'Bearer ' + this.token },
      json: true,
    };
    rp.get(options).then((response) => {artist.addAlbumsConsultaSpotify(response.items);
      console.log(artist);
      console.log(artist.albums);
    })
    .catch((error) => {throw (error);}); 
}
}*/