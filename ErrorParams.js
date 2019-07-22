const ErrorUNQ = require('./ErrorUNQ');
class ErrorParams extends ErrorUNQ {
    
    constructor(message){
        super(message, 'ErrorParams' , 416);
    }
    
}

module.exports = ErrorParams;