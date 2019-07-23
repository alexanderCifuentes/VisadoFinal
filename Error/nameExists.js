const ErrorUNQ = require('./ErrorUNQ');
class NameExists extends ErrorUNQ {
    
    constructor(){
        super('element already exists in the database', 'NameDuplicate' , 409);
    }
    
}

module.exports = NameExists;