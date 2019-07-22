
class Subscription{
    constructor(email, idArtist){
        this.idArtist = idArtist;
        this.emails = [email];  
    }

    addEmail(email){
        if(!this.emails.includes(email)){
            this.emails.push(email);
        }
    }

    removeEmail(email){
        if(this.emails.includes(email)){
            const index = this.emails.findIndex((em) => em === email);
            this.emails.splice(index, 1);
        }
    }

    resetEmails(){
        this.emails =[];
    }

}

module.exports = Subscription;