const ErrorUNQ = require('./ErrorUNQ');
class ErrorAlbumExists extends ErrorUNQ {
    constructor(){
        super('Album does not exist', 'ErrorAlbumExists' , 404);
    }
}

module.exports = ErrorAlbumExists;