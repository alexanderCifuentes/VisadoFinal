class Playlist {
    constructor(name, id){
      this.id = id;
      this.name = name;
      this.tracks = [];
    }
  
    //agrega un track a su lista de tracks
    addTrack(track){
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
    
    //retorna un booleano que indica si la lista de tracks contiene un track
    hasTrack(aTrack){
      return  this.tracks.includes(aTrack);
    }
  
    //retorna la duracion total de la playlist
    duration(){
      return this.tracks.map((track) => track.duration).reduce((a,b) => a+b,0);  
    }
  
  }
  
  module.exports = Playlist;