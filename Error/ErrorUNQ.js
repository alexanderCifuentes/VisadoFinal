class ErrorUNQ extends Error{
    constructor(message, name, status){
        super(message);
        this.name = name,
        this.status = status;
    }
    
    toJson(){
        return{
            name: this.name,
            status: this.status,
            message: this.message
        };
    }
}
module.exports = ErrorUNQ;