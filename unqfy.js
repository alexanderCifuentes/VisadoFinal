const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const rp = require('request-promise');
const ErrorNameDuplicate = require('./Error/nameExists');
const ErrorArtistExists = require('./Error/ErrorArtistaExists');
const ErrorAlbumExists = require('./Error/ErrorAlbumExists');
const ErrorTrackExists = require('./Error/ErrorTrackExists');
const ErrorPlaylistExists = require('./Error/ErrorPlaylistExists');
const Artista = require('./Unqfy/Artista');
const Album = require('./Unqfy/Album');
const Track = require('./Unqfy/Track');
const Playlist = require('./Unqfy/Playlist');
const Loggly = require('./Loggly/Loggly');
const ObserverLoggly = require('./Loggly/ObseverLoggly');
const ObserverNotify = require('./NotifyGmail/ObserverNotify');
const Log= new ObserverLoggly();
const Notify = new ObserverNotify();
const Manager = require('./NotifyGmail/ManagerSubscription');


class UNQfy {

  constructor(){
    this.artistas = [];
    this.playLists = [];
    this.indexArtista = -1;
    this.indexAlbum = -1;
    this.indexTrack = -1;
    this.indexPlaylist = -1;
    
  }


//--------------------------------------------------------------------------------------------------


//------------------------------------ Checks ------------------------------------------------------
  //Checkea que no exista un artista con ese nombre
  checkNameArtist(artistName){
   if(this.artistas.length > 0){
    const art = this.artistas.find((art)=> art.name.toLowerCase() === artistName.toLowerCase());
    if(art !== undefined){
       throw new ErrorNameDuplicate();
    }
   }
  }

  //Chekea que el track exista
  checkTrack(track){
    if(track === undefined || track < 0){
      throw new ErrorTrackExists();
    }
  }

  //Chekea que la playlist exista
  checkPlaylist(play){
    if(play === undefined || play < 0){
      throw new ErrorPlaylistExists();
    }
  }

  //Chekea que el artista exista
  checkArtist(artista){
    if(artista === undefined || artista < 0){
      throw new ErrorArtistExists();
    }
  }

  //Chekea que el album exista
  checkAlbum(album){
    if(album === undefined || album < 0){
      throw new ErrorAlbumExists();
    }
  }

  //Retorna el index del elemento en la lista
  indexElementById(array, id){
    return array.findIndex((elem) => elem.id === id);
  }

  //Retorna el elemento correspondiente al ID si no lo encuentra lanza una exception
  getElemById(array, id){
    return array.find((elem) => elem.id === id);
  }

//------------------------------------- ARTISTA ------------------------------------------------------------
 //Crea un nuevo artista y lo agrega a la lista de artistas de unqfy
  addArtist(artistData) {
    this.checkNameArtist(artistData.name);
    const artista = new Artista(artistData.name, artistData.country, ++this.indexArtista);
    this.artistas.push(artista);
    Log.envioLog(`Se ha creado el artista con id ${artista.id}`);
    return artista;
  
  }

  //Elimina el artista correspondiente al id 
  removeArtist(id){
    const index = this.indexElementById(this.artistas, id);
    this.checkArtist(index);
    const artista = this.getElemById(this.artistas, id);
    this.artistRemoveAlbums(artista);
    this.artistas.splice(index, 1); 
    Log.envioLog(`Se ha eliminado el artista con id ${id}`);
  }

  //Remueve los albums del artista
  artistRemoveAlbums(artista){
    if(artista.albums.length > 0){
      artista.albums.forEach((a) => this.removeAlbumId(a.id));
    }
  }

  //Retorna el artista correspondiente al ID
  getArtistById(id) {
    const artista = this.getElemById(this.artistas, id);
    this.checkArtist(artista);
    return artista;
  }

  //Retorna el artista con el albumId
  getArtistWithAlbumId(id){
    const artista =  this.artistas.find((art) => art.containAlbumId(id));
    this.checkArtist(artista);
    return artista;
  }

  //Retorna el artista con el trackId
  getArtistWithTrackId(id){
    const artista =  this.artistas.find((a) => a.containTrackId(id));  
    this.checkArtist(artista);
    return artista;
  }

  //Actualiza los datos del artista
  updateArtista(artistData, artista){
    artista.update(artistData.name, artistData.country);
    return this.getArtistById(artista.id);

  }

//------------------------------------ VISADO2 ------------------------------------------------------------
  //Retorna los albums del artista consultados a la api de spotify
  populateAlbumsForArtist(artistName){
    const artista = this.getArtistForName(artistName);
    artista.addAlbumsOfSpotify();
   
  }

  //Retorna el artista correspondiente al nombre pasado como argumento
  getArtistForName(artistName){
    const artista = this.artistas.find((art) => art.name.toLowerCase() === artistName.toLowerCase());
    this.checkArtist(artista);
    return artista;
  }

  //Retorna los albunes del artista
  getAlbumsForArtist(artistName){
    const artista = this.getArtistForName(artistName);
    this.checkArtist(artista);
    return artista.albums;
  }

   //Actualiza la info los datos de album
   updateAlbum(id,albumdata){
    const album = this.getAlbumById(id);
    this.checkAlbum(album);
    album.update(albumdata.name, albumdata.year);
  }

  //------------------------------------------- ALBUM -----------------------------------------------------

  

 

  //Retorna todos los albunes de la app
  getAlbunes(){
    return this.artistas.map((art) => art.albums).reduce((a,b) => a.concat(b),[]);
  } 

  //Retorna el album correspondiente al ID
  getAlbumById(id){ 
    const album= this.getElemById(this.getAlbunes(), id);
    this.checkAlbum(album);
    return album;
  }

  //Elimina el album correspondiente a la ID
  removeAlbumId(id){ 
    const artista = this.getArtistWithAlbumId(id); 
    const album = this.getAlbumById(id);
    this.removeTracks(album);
    const tracks = album.tracks;
    if(tracks.length >0){tracks.forEach((track) => this.allPlaylistRemoveTrack(track.id));}
    artista.removeAlbum(id); 
    Log.envioLog(`Se ha removido el album con id ${id}`);
  }

  //Retorna el album que contiene el track correspondiente al ID
  getAlbumWithTrackId(id){
    const artista =  this.getArtistWithTrackId(id);
    this.checkArtist(artista);  
    return artista.albumWithTrackId(id);
  }

  //Agrega un nuevo album al artista correspondiente al ID
  addAlbum(artistId, albumData) {
    const artista = this.getArtistById(artistId);
    const album = new Album(albumData.name, albumData.year, ++this.indexAlbum);
    artista.addAlbum(album);
    Notify.notifyApi(artistId, artista.name, albumData.name);
    Log.envioLog(`Se ha creado el album con id ${album.id}`);
    return album;
    
  }

  
//---------------------------------------------- TRACK --------------------------------------------------------------
  //Agrega un al track al album correspondiente al ID
  addTrack(albumId, trackData) {
    const track = new Track(trackData.name, trackData.duration,trackData.genres, ++this.indexTrack);
    const album = this.getAlbumById(albumId);
    album.addTrack(track);
    Log.envioLog(`Se ha creado el track con id ${track.id}`);
    return track; 
  }

  //Elimina el track correspondiente de la ID
  removeTrack(id){
    this.allPlaylistRemoveTrack(id);
    this.getAlbumWithTrackId(id).removeTrackId(id);
    Log.envioLog(`Se ha removido el track con id ${id}`);
    
    
  }

  //Elimina todos los tracks de un album de las playlists
  removeTracks(album){
    if(album.tracks.length > 0){
      album.tracks.forEach((t) => this.allPlaylistRemoveTrack(t.id));
    }

  }

  //Retorna todos los tracks de la app
  getTracks(){ 
    return this.getAlbunes().map((album) => album.getTracks()).reduce((a,b) => a.concat(b),[]);
  }

  //retorna el track correspondiente al Id 
  getTrackById(id) {
    const track = this.getElemById(this.getTracks(), id);
    this.checkTrack(track);
    return track;
  }
//---------------------------------- VISADO2 ---------------------------------------------------------------
  getLyrics(trackId){
    const track = this.getTracks().find((t) => t.id === trackId);
    this.checkTrack(track);
    track.getLyrics();
  }
  
//------------------------------ PLAYLIST ----------------------------------------------------------------------

 //Crea una playlist vacia y la agrega a la lista de playlists 
 addPlaylist(name){
  const playlist = new Playlist(name, ++this.indexPlaylist);
  this.playLists.push(playlist);
  Log.envioLog(`Se ha creado la playlist con id ${playlist.id}`);
  return playlist;
  }

  //reorna la Playlist correspondiente al Id
  getPlaylistById(id) {
    const play = this.getElemById(this.playLists, id);
    this.checkPlaylist(play);
    return play;
  }

//Elimina la playlist correspondiente al ID
removePlaylist(id){
  const index = this.indexElementById(this.playLists, id);
  this.checkPlaylist(index);
  this.playLists.splice(index, 1);
  Log.envioLog(`Se ha removido la playlist con id ${id}`);
}


// retorna: la nueva playlist creada
createPlaylist(name, genresToInclude, maxDuration) {
  const tracks = this.getTracksMatchingGenres(genresToInclude);
  const myPlaylist = this.addPlaylist(name);
  while( myPlaylist.duration() <= maxDuration && tracks.length > 0 ){
    if (myPlaylist.duration() + tracks[0].duration <= maxDuration){
      myPlaylist.addTrack(tracks.shift());
    }else{
      tracks.shift();
    }
  }
  return myPlaylist;
}


 //Retorna la duracion de la playlist correspondiente al ID
 durationPlaylist(id){
  return this.getPlaylistById(id).duration();
 } 
 
 //Elimina el track correspondiente de la ID en todas las playlist
 allPlaylistRemoveTrack(id){
  if(this.playLists.length > 0){
    this.playLists.forEach((play) => play.removeTrackId(id));
  }
 }


  //Agrega el track correspondiente al iD a la playlist correspondiente al ID
  playListAddTrack(playId, trackId){
  this.getPlaylistById(playId).addTrack(this.getTrackById(trackId));
  }

//-------------------------------------- BUSQUEDAS -------------------------------------------------------------
 
  // retorna: los tracks que contenga alguno de los generos pasados como parametro 
  getTracksMatchingGenres(genres) {
    return this.getTracks().filter((t) => t.containSomeGenres(genres));
  }
  
  //artistId(number)
  getTracksMatchingArtist(artistId) {
    return this.getArtistById(artistId).getTracks();
  }
  
  searchMatchElements(array, str){
    let st = str;
    if(st === undefined){st = ''}
    return array.filter((a) => a.name.toLowerCase().match(st.toLowerCase()));
  }

  //retorna los artista que machean con el string pasado como parametro
  getArtistasMachingWithName(str){
   return this.searchMatchElements(this.artistas , str); 
  }


  //retorna los albunes que machean con el string pasado como parametro
  getAlbumsMachingWithName(str){
    return this.searchMatchElements(this.getAlbunes(), str); 
  }

  //retorna los tracks que machean con el string pasado como parametro
  getTracksMachingWithName(str){
    return this.searchMatchElements(this.getTracks(), str); 
    
  }

  //retorna las playlists que machean con el string pasado como parametro
  getPlaylistsMachingWithName(str){
    return this.searchMatchElements(this.playLists, str);  
  }

  //retorna los Artistas, Playlists, Albums, Tracks que macheen con el str
  searchByName(str){
    return {
      artists: this.getArtistasMachingWithName(str),
      albums: this.getAlbumsMachingWithName(str),
      tracks: this.getTracksMachingWithName(str),
      playlists: this.getPlaylistsMachingWithName(str),
    };   
  } 

  

//---------------------------------------------------------------------------------------------------------
  save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy,Artista, Album,Playlist,Track, ObserverLoggly,Manager,Loggly];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy
};

