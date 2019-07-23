const ErrorName = require('../Error/nameExists');
const ErrorArtistExists = require('../Error/ErrorArtistaExists');
const ErrorAlbumExists = require('../Error/ErrorAlbumExists');
function routehelperArtist(callback){
  
    return async (req, res) => {
      try{
        await callback(req, res);
      }catch(error){
        if(error instanceof ErrorArtistExists){ res.status(404).send({status: 404, errorCode: "RELATED_RESOURCE_NOT_FOUND"});}
        if(error instanceof ErrorAlbumExists){ res.status(404).send({status: 404, errorCode: "RESOURCE_NOT_FOUND"});}
        if(error instanceof ErrorName){ res.status(409).send({ status: 409, errorCode: 'RESOURCE_ALREADY_EXISTS'});}   
    }
    }
  }

  module.exports = routehelperArtist;