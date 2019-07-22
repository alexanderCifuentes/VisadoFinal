const ErrorUNQ = require('./ErrorUNQ');
class ErrorTrackExists extends ErrorUNQ {
    constructor(){
        super('Track does not exist', 'ErrorTrackExists' , 404);
    }
}

module.exports = ErrorTrackExists;