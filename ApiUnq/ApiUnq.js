const express = require('express');
const app = express();      
app.use(express.json());  
const JSON = require('circular-json');
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({extended:true}));
const unqmod = require('../unqfy');
const ManejoErrores = require('../Validadores/errorMiddleware');
const Validations = require('../Validadores/Validations');
const fs = require('fs');
const routehelper = require('./RouteHelper');
const routehelperArtist = require('./RoutehelperArtist');


//---------------------------------- PERSISTENCIA ----------------------------------------------------------
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

//-------------------------------------- POST --------------------------------------------------------------
//Agrega un artista a la app
app.post('/api/artists', Validations.validate(Validations.validationArtist), routehelper(async (req, res) =>{
  const unqfy = getUNQfy();
  const artista = unqfy.addArtist( req.body);
  saveUNQfy(unqfy);
  res.status(201).send({
    'id': artista.id,
    'name': artista.name,
    'country':artista.country,
    'albums': artista.albums
  });
}));

//Agrega un album a la app
app.post('/api/albums',Validations.validate(Validations.validationAlbum), routehelperArtist(async (req, res) =>{
  const unqfy = getUNQfy();
  const album = unqfy.addAlbum(parseInt(req.body.artistId), {name: req.body.name, year: req.body.year});
  saveUNQfy(unqfy);
  res.status(201).send({
    'id': album.id,
    'name': album.name,
    'year': album.year,
    'tracks': album.tracks
  });

}));

//Rutas invalidas
app.post('*', (req, res) =>{
  res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
});

//-------------------------------------- GET --------------------------------------------------------------
//Devuelve todos los artistas
app.get('/api/artists', routehelper( async (req, res)=>{
  const unqfy = getUNQfy();
  const artistas = unqfy.getArtistasMachingWithName(req.query.name);
  res.status(200).send(JSON.stringify(artistas.map((ele)=> returnArtist(ele))));
}));

//Imprime el artista como lo pide el test
function returnArtist(ele){
  return {'id': ele.id,
          'name': ele.name,
          'albums': ele.albums,
          'country': ele.country};
}

//Devuelve todos los albums
app.get('/api/albums', routehelper( async (req, res)=>{
  const unqfy = getUNQfy();
  const albunes = unqfy.getAlbumsMachingWithName(req.query.name);
  res.send(JSON.stringify(albunes));
}));

//Devuelve un artista segun su ID
app.get('/api/artists/:id', routehelper( async (req,res) =>{
  const unqfy = getUNQfy();
  res.status(200).send(returnArtist(unqfy.getArtistById(parseInt(req.params.id))));  

}));

//Devuelve un album segun su ID
app.get('/api/albums/:id',routehelper(async (req,res) =>{
  const unqfy = getUNQfy();
  const album = unqfy.getAlbumById(parseInt(req.params.id));
  res.status(200).send( JSON.stringify(album));
}));

//Rutas invalidas
app.get('*', (req, res) =>{res.status(404).send({status: 404,errorCode: 'RESOURCE_NOT_FOUND'});
});

//-------------------------------------- PUT --------------------------------------------------------------
//Actualiza un artista
app.put('/api/artists/:id', routehelper( async (req,res) =>{ 
  const unqfy = getUNQfy();
    const artista = unqfy.getArtistById(Number(req.params.id));
    console.log('Aca voy');
    unqfy.updateArtista( req.body, artista);
    saveUNQfy(unqfy);
    res.status(200).send( {
      'id': artista.id,
      'name': artista.name,
      'country':artista.country,
      'albums': artista.albums});
}));

//Rutas invalidas
app.put('*', (req, res) =>{res.status(404).send({status: 404,errorCode: 'RESOURCE_NOT_FOUND'});
});
//-------------------------------------- DELETE --------------------------------------------------------------
//elimina el artista correspondiente al ID
app.delete('/api/artists/:id', routehelper( async (req,res) =>{
  const unqfy = getUNQfy();
  unqfy.removeArtist(parseInt(req.params.id));
 
  saveUNQfy(unqfy);
  res.status(204).send();
  
}));

//elimina el album correspondiente al ID
app.delete('/api/albums/:id', routehelper( async (req,res) =>{ 
  const unqfy = getUNQfy();
  unqfy.removeAlbumId(Number(req.params.id));
  saveUNQfy(unqfy);
  res.status(204).send(); 
}));

//Rutas invalidas
app.delete('*', (req, res) =>{ res.status(404).send({status: 404,errorCode: 'RESOURCE_NOT_FOUND'});
});

//-------------------------------------- PATCH --------------------------------------------------------------
//Actualiza el album correspondiente al ID
app.patch('/api/albums/:id', routehelper(async (req,res) =>{ 
  const unqfy = getUNQfy();
  unqfy.updateAlbum(parseInt(req.params.id),req.body);
  saveUNQfy(unqfy);
  const album = unqfy.getAlbumById(parseInt(req.params.id));
  res.status(200).send( {
      'id': album.id,
      'name': album.name,
      'year': album.year,
      'tracks': album.tracks});
}));

//Rutas invalidas
app.patch('*', (req, res) =>{res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND' });
});


//-----------------------------------------------------------------------------------------------------------
//Maneja errores del JSON
app.use(ManejoErrores);

//Crea el servidor
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), ()=> console.log(`Listening on port ${app.get('port')}...`));


