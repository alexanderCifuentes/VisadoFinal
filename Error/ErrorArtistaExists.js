const ErrorUNQ = require('./ErrorUNQ');
class ErrorArtistaExists extends ErrorUNQ {
    constructor(){
        super('Artista does not exist', 'ErrorArtistaExists' , 404);
    }
}

module.exports = ErrorArtistaExists;