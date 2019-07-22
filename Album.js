const errorName = require('./nameExists');
class Album {
  
    constructor(name, year, id){
      this.id = id;
      this.name = name;
      this.year = year;
      this.tracks = [];  
    }
  

    //agrega un track a su lista de tracks
    addTrack(track){
      this.checkTrackName(track.name);
      this.tracks.push(track);  
    }
    
    //Elimina el track correspondiente al ID de su lista de tracks
    removeTrackId(id){
      const index = this.tracks.findIndex((track) => track.id === id);
      if(index > -1){
        this.tracks.splice(index, 1);
      }
    }
  
    //retorna todos sus tracks
    getTracks(){
      return this.tracks;
    }
  
    //retorna el track correspondiente al Id, podria retornar un undefined
    getTrackById(id){
      return this.tracks.find((track) => track.id === id);
    }
    
    //retorna un booleano que indica si contiene el track correspondiente al Id
    containTrack(id){
      const track = this.getTrackById(id);
      return track !== undefined;
    }
  
  
    //Controla que el album no tenga un track con igual nombre
    checkTrackName(str){
      const tracksName = this.tracks.map((track) => track.name.toLowerCase()).reduce((a,b)=> a.concat(b),[]);  
      if(tracksName.includes(str.toLowerCase())){
        throw new errorName();
      }
    }
  
  
    //------------------------------------------ VISADO2 ------------------------------------------------------
    update(name, year){
      this.name = name || this.name;
      this.year = year || this.year;
    }
    
  }
  
  module.exports = Album;