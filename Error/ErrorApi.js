const ErrorUNQ = require('./ErrorUNQ');
class ErrorApi extends ErrorUNQ {
    constructor(){
        super('Error Notify Gmail', 'ErrorApi' , 400);
    }
}

module.exports = ErrorApi;