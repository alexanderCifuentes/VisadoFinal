const rp = require('request-promise');

class Slack{
    envioSlack(text){
        const url = 'https://hooks.slack.com/services/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';
        let message = {"text": text};
        message = JSON.stringify(message);
    
    rp.post({url: url, body: message})
      .then((resp) => 
         console.log("Enviada notificacion al slack"))
       .catch((error) => 
         console.log(error.message)
       );
    }
}
module.exports = Slack;
