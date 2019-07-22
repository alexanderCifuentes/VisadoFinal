const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy
const ErrorNameExist = require('./nameExists');
const ErrorArtistExists = require('./ErrorArtistaExists');
const ErrorAlbumExists = require('.//ErrorAlbumExists');
const ErrorTrackExists = require('./ErrorTrackExists');
const ErrorPlayExists = require('./ErrorPlaylistExists');
const ErrorParams = require('./ErrorParams');


// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

function executeFunctionByName(fnName, array){
  const funciones ={};
  funciones['printArtistId'] = printArtistId; 
  funciones['addArtist'] = addArtist;
  funciones['getArtists'] = getArtists;
  funciones['removeArtist'] = removeArtist;
  funciones['addAlbum'] = addAlbum;
  funciones['printAlbumId'] = printAlbumId;
  funciones['getAlbums'] = getAlbums;
  funciones['removeAlbum'] = removeAlbum;
  funciones['albumWithTrackId']= albumWithTrackId;
  funciones['addTrack']= addTrack;
  funciones['printTrackId'] = printTrackId;
  funciones['getTracks']= getTracks;
  funciones['removeTrack'] = removeTrack;
  funciones['addPlaylist'] = addPlaylist;
  funciones['getPlaylists'] = getPlaylists;
  funciones['printPlaylistId'] = printPlaylistId;
  funciones['removePlaylist'] = removePlaylist;
  funciones['createPlaylist'] = createPlaylist;
  funciones['durationPlaylist'] = durationPlaylist;
  funciones['playlistAddTrack']=playlistAddTrack;
  funciones['getTracksMachingGenres']= getTracksMachingGenres;
  funciones['getArtistsMachingWithName'] =getArtistsMachingWithName; 
  funciones['getAlbumsMachingWithName'] =getAlbumsMachingWithName;
  funciones['getTracksMachingWithName']=getTracksMachingWithName;
  funciones['getPlaylistsMachingWithName']=getPlaylistsMachingWithName;
  funciones['searchByName']=searchByName;
  funciones['getTracksArtistId']= getTracksArtistId;
 
 
 
  funciones['populateAlbumsForArtist'] = populateAlbumsForArtist;
  funciones['getLyrics'] = getLyrics;
  funciones['getAlbumsForArtist'] = getAlbumsForArtist;


  if(funciones[fnName] === undefined){
    throw Error(`Error: comando ${fnName} no encontrado`);
  }
  
  return funciones[fnName](array);
}

//------------------------------------ Control Params ---------------------------------------------------
//Controla que los parametros de la funcion llamada sean los requeridos
function controlParams(strName, args, strParam, num){
  controlParametersOfLess(strName, args, strParam, num);
  controlParametersOfMore(strName, args, num);
}

//Controla que la funcion pasada no tenga parametros de mas
function controlParametersOfMore(strName, args, num){
  if(args.length > num){
    throw new ErrorParams(`Los parametros [${args.slice(num)}] no son necesarios en la funcion ${strName}`); 
  } 
}

//Controla que la funcion pasada no tenga parametros de menos
function controlParametersOfLess(strName, args, strParam, num){
  if(num !== 0 && args === undefined){
    throw new ErrorParams(`${strName} requiere los parametros ${strParam}`);
  }
  else if( args.length < num){
    throw new ErrorParams(`${strName} requiere los parametros ${strParam}`);
  }
}

//Function callback que se llama para evitar repetir codigo
function callbackUnq(args, elem, callback){
  try{
  callback(args);
  }catch(error){
    if(error instanceof ErrorNameExist){
      console.log(`ya existe un ${elem} con ese nombre`);
    }else if(error instanceof ErrorParams){
      console.log(error.message);   
    }else if(error instanceof ErrorAlbumExists){
      console.log(`No se encontro el Album en la app`);
    }else if(error instanceof ErrorArtistExists){
      console.log(`No se encontro el Artista en la app`);
    }else if(error instanceof ErrorTrackExists){
      console.log(`No se encontro el Track en la app`);
    }else if(error instanceof ErrorPlayExists){
      console.log(`No se encontro la Playlist en la app`);
    }else{
      throw error;
    }
  }
  

}

//-------------------------------------- Artistas --------------------------------------------------------
//Agrega un artista a la unqfy
function addArtist(args) {
  callbackUnq(args,'Artista', ()=>{
    controlParams('addArtist',args, 'un artistName y un artistCountry', 2);
    const unqfy = getUNQfy();
    unqfy.addArtist({name: args[0], country:args[1]});
    saveUNQfy(unqfy);
    console.log(`Artista: ${args[0]} se ha creado con exito`); 
  });
}

//Elimina un artista de la unqfy
function removeArtist(args){
  callbackUnq(args, '', ()=>{
    controlParams('removeArtist',args,' un artistId', 1);
    const unqfy = getUNQfy();
    unqfy.removeArtist(Number(args[0]));
    saveUNQfy(unqfy); 
    console.log(`artista con ID: ${args[0]} se ha removido con exito`);
  });
  
}

//Retorna el artista correspondiente al ID
function printArtistId(args){
  callbackUnq(args,'',  ()=>{
    controlParams('printArtistId',args[0],'un artistId',1);
    const unqfy = getUNQfy();
    const art = unqfy.getArtistById(Number(args[0]));
    console.log({id: art.id, name: art.name, albums: art.albums, country: art.country});
  });
}

//retorna todos los artistas de la app
function getArtists(args){
  callbackUnq(args, '', ()=>{
    controlParams('getArtist ', args,  ' 0 parametros',0);
    const unqfy = getUNQfy();
    unqfy.artistas.forEach((e) => console.log({id: e.id, name: e.name, albums: e.albums, country: e.country}));
  });
}

//-------------------------------------- Albums --------------------------------------------------------
//crea un album y lo agrega al artista correspondiente al ID 
function addAlbum(args){
  callbackUnq(args, 'Album',()=>{
    controlParams('addAlbum',args, 'artistId, albumName , albumYear',3);
    const unqfy = getUNQfy();
    unqfy.addAlbum(Number(args[0]), {name: args[1], year: args[2] });
    saveUNQfy(unqfy);
    console.log(`Se ha agragado el album  ${args[1]} al artista con ID:  ${args[0]}`);
  });
}

//Remueve un albun correspondiente a la ID del artista que lo posea
function removeAlbum(args){
  callbackUnq(args, '', ()=>{
    controlParams('removeAlbum', args, ' albumId', 1);
    const unqfy = getUNQfy();
    unqfy.removeAlbumId(Number(args[0]));
    saveUNQfy(unqfy);
    console.log('Se ha removido el album con ID: '+ args[0]);
  });
}

//Retorna el album correspondiente a la ID
function printAlbumId(args){
  callbackUnq(args,'', ()=>{
    controlParams('printAlbumId',args[0],'un albumId',1);
    const unqfy = getUNQfy();
    console.log(unqfy.getAlbumById(Number(args[0])));
  });
}

//Retorna todos los albunes que tiene la app
function getAlbums(args){
  callbackUnq(args, '', ()=>{
    controlParams('getAlbums',args, '0 parametros',0);
    const unqfy = getUNQfy();
    console.log(unqfy.getAlbunes());
  });
}

//Retorna un album que contiene el trackId
function albumWithTrackId(args){
  callbackUnq(args,'', ()=>{
    controlParams('albumWithTrackId',args,'trackId',1);
    const unqfy = getUNQfy();
    console.log(unqfy.getAlbumWithTrackId(Number(args[0])));
  });
}

//--------------------------------- TRACKS --------------------------------------------------------------

//agrega un track al album correspondiente al Id
function addTrack(args){ 
  callbackUnq(args, 'Track', ()=>{
    controlParametersOfLess('addTrack', args, 'albumId, trackName, trackDuraction [trackGenres]', 4);
    const unqfy = getUNQfy();
    unqfy.addTrack(Number(args[0]), {name: args[1], duration: Number(args[2]), genres: args.slice(3)});
    saveUNQfy(unqfy);
    console.log('Se ha agregado el track ' + args[1] + ' al album con ID: ' + args[0]);
  });
 
}

//Elimina el track correspondiente al ID
function removeTrack(args){
  callbackUnq(args,'',  ()=>{
    controlParams('removeTrack',args,'trackId',1);
    const unqfy = getUNQfy();
    unqfy.removeTrack(Number(args[0]));
    saveUNQfy(unqfy);
    console.log('Se ha eliminado el track con ID: '+ args[0]);
  });


}

//Retorna el track correspondiente al Id
function printTrackId(args){
  callbackUnq(args, '', ()=>{
    controlParams('printTrackId',args[0],'trackId',1);
    const unqfy = getUNQfy();
    console.log(unqfy.getTrackById(Number(args[0])));
  });

}

//Retorna los tracks de la app
function getTracks(args){
  callbackUnq(args, '', ()=>{
    controlParams('getTracks',args,'0 parametros',0);
    const unqfy = getUNQfy();
    console.log(unqfy.getTracks());
  });
}

//-------------------------------------------- Playlist --------------------------------------------------

//Agrega una playlist a la app sin tracks
function addPlaylist(args){
  callbackUnq(args,'', ()=>{
    controlParams('addPlaylist',args,'playlistName',1);
    const unqfy = getUNQfy();
    unqfy.addPlaylist(args[0]);
    saveUNQfy(unqfy);
    console.log('Se ha creado la Playlist ' + args[0]);
  });
  
}

//Elimina la playlistId correspondiente al ID
function removePlaylist(args){
 callbackUnq(args, '',  ()=>{
  controlParams('removePlaylistId',args, 'playlistId',1);
  const unqfy = getUNQfy();
  unqfy.removePlaylist(Number(args[0]));
  saveUNQfy(unqfy);
  console.log('se ha eliminado la Playlist con ID: ' + args[0]);
 });
}

//Retorna la playList correspondiente al ID
function printPlaylistId(...args){
  callbackUnq(args, '', ()=>{
    controlParams('printPlaylistId',args[0], 'playlistId',1);
    const unqfy = getUNQfy();
    console.log(unqfy.getPlaylistById(Number(args[0])));
  });
}

//Agrega un track a la playlist 
function playlistAddTrack(args){
  callbackUnq(args, '', ()=>{
    controlParams('playlistAddTrack',args, 'una playlistId y un trackId', 2);
    const unqfy = getUNQfy();
    unqfy.playListAddTrack(Number(args[0]),Number(args[1]));
    saveUNQfy(unqfy);
    console.log('se ha agregado el track con id '+ args[1]+  ' a la Playlist con ID: ' + args[0]);
  });
}


//Retorna todas las playlists de la app
function getPlaylists(args){
  callbackUnq(args, '',  ()=>{
    controlParams('getPlaylists',args,'0 parametros',0);
    const unqfy = getUNQfy();
    console.log(unqfy.playLists);
  });
  }

//Crea una playlist con los genreos incluidos y un tiempo max de duracion 
function createPlaylist(args){
  callbackUnq(args, '',  ()=>{
    controlParametersOfLess('createPlaylist',args, 'namePlaylist, uno o varios genreros, maxDuration',3);
    const unqfy = getUNQfy();
    unqfy.createPlaylist(args[0], args.slice(1,args.length -1), Number(args[args.length - 1]));
    saveUNQfy(unqfy);
    console.log('Se ha creado con exito la Playlist: ' + args[0]);
  });
}

//retorna la duraccion de la playlist correspondiente al ID
function durationPlaylist(args){
  callbackUnq(args, '', ()=>{
    controlParams('durationPlaylist',args, 'playlistId',1);
    const unqfy = getUNQfy();
    console.log('Duracion de la Playlist con ID '+ args[0]+ ' es de: '+unqfy.durationPlaylist(Number(args[0])));
  });
}

//------------------------------ Busquedas -------------------------------------------
//Retorna los tracks que tienen almenos uno de los generos pasados como argumento
function getTracksMachingGenres(args){
  callbackUnq(args, '', ()=>{
    controlParametersOfLess('getTracksMachingGenres', args,'uno o varios tipos de genero', 1);
    const unqfy = getUNQfy();
    console.log(unqfy.getTracksMatchingGenres(args));
  })
}

//Retorna los artistas que machean con el string pasado como argumento
function getArtistsMachingWithName(args){
  callbackUnq(args, '',  ()=>{
    controlParams('getArtistsMachingWithName',args,'un string',1 );
    const unqfy = getUNQfy();
    console.log(unqfy.getArtistasMachingWithName(args[0]));
  });
}

//Retorna los albunes que machean con el string pasado como argumento
function getAlbumsMachingWithName(args){
  callbackUnq(args, '', ()=>{
    controlParams('getAlbumsMachingWithName',args,'un string',1 );
    const unqfy = getUNQfy();
    console.log(unqfy.getAlbumsMachingWithName(args[0]));
  });
  }

//Retorna los tracks que machean con el string pasado como argumento
function getTracksMachingWithName(args){
  callbackUnq(args, '', ()=>{
    controlParams('getTracksMachingWithName',args,'un string',1 );
    const unqfy = getUNQfy();
    console.log(unqfy.getTracksMachingWithName(args[0]));
  });
  }

//Retorna las playlists que machean con el string pasado como argumento
function getPlaylistsMachingWithName(args){
  callbackUnq(args, '', ()=>{
    controlParams('getPlaylistsMachingWithName',args,'un string',1 );
    const unqfy = getUNQfy();
    console.log(unqfy.getPlaylistsMachingWithName(args[0]));
  });
  }

//retorna los Artistas, Playlists, Albums, Tracks que macheen con el str
function searchByName(args){
  callbackUnq(args, '', ()=>{
    controlParams('searchByName',args,'un string',1 );
    const unqfy = getUNQfy();
    console.log(unqfy.searchByName(args[0]));
  });
}

//retorna los tracks correspondientes al artistaId
function getTracksArtistId(args){
  callbackUnq(args, '', ()=>{
    controlParams('getTracksArtistId',args,'artistId',1 );
    const unqfy = getUNQfy();
    console.log(unqfy.getTracksMatchingArtist(Number(args[0])));
  });
 }


//------------------------------- VISADO2 ------------------------------------------------------------------

function populateAlbumsForArtist(args){
  callbackUnq(args, 'Artista', ()=>{
    const unqfy = getUNQfy();
    unqfy.populateAlbumsForArtist(args[0]);
    saveUNQfy(unqfy);
  });
}

function getLyrics(args){
  callbackUnq(args, 'Track', ()=>{
    const unqfy = getUNQfy();
    unqfy.getLyrics(Number(args[0]));
    saveUNQfy(unqfy);
  });
}

function getAlbumsForArtist(args){
  callbackUnq(args, 'Artista', ()=>{
    const unqfy = getUNQfy();
    console.log(unqfy.getAlbumsForArtist(args[0]));
    saveUNQfy(unqfy);
  });
}

//---------------------------------- VISADO3 -----------------------------------------------------------------



//----------------------------------------------------------------------------------------------------------

function main() {
  const params = process.argv.slice(2);
  const commandName = params[0];
  const commandArgs = params.slice(1);
 
  executeFunctionByName(commandName,commandArgs);

}
main();