const ErrorUNQ = require('./ErrorUNQ');
class ErrorPlaylistExists extends ErrorUNQ {
    constructor(){
        super('Playlist does not exist', 'ErrorPlaylistExists' , 404);
    }
}

module.exports = ErrorPlaylistExists;