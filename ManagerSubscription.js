const Subscription = require('./Subscription');
const email = require('./gmail/get-token/sendMail');
const sendMail = new email();

class ManagerSubscription {
    constructor(){
        this.subscriptions = [];
    }
    

    //Agrega una subscripcion nueva
    addSubscription(email, idArtist){
        const sub = this.subscriptions.find((s) => s.idArtist === idArtist);
        if(sub !== undefined){
            sub.addEmail(email);
        }else{
            this.subscriptions.push(new Subscription(email, idArtist));
        }      
    }

    //Elimina la subscripcion de un usuario a un artista
    removeSubscription(email, idArtist){
        const sub = this.subscriptions.find((sub) => sub.idArtist === idArtist);
        if(sub !== undefined){
            sub.removeEmail(email);
        }
    }

    //elimina todas las susbscripciones que tenga un artista
    removeSubscriptionsForArtist(idArtist){
        const sub = this.subscriptions.find((sub) => sub.idArtist === idArtist);
        if(sub !== undefined){
            sub.resetEmails();
        }
    }


     //Retorna los usuarios inscriptos a las notificaciones de un idArtist
     usersRegisterByArtist(idArtist){
        const sub = this.subscriptions.find((sub) => sub.idArtist === idArtist);
        if(sub !== undefined){
            return sub.emails;
        }else{
            return [];
        }
    }

    enviarMail(data){
        const {artistId,artistName, albumName} = data;
        const subscripciones = this.usersRegisterByArtist(artistId);
        console.log(subscripciones)
        if(subscripciones.length>0){
            console.log('Se enviaran mails');
            subscripciones.forEach((email) => sendMail.enviarEmail(artistName, albumName, email));
        }else{
            console.log(this.subscriptions);
        }
    }


}

module.exports = ManagerSubscription;