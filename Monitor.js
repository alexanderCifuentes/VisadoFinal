const Slack = require('./slack');
const slack = new Slack();
const hora =  new Date();
const rp = require('request-promise');


function callServiceGmail(){
    rp(`http://localhost:7000/api/funcionando`).then().catch((error) =>{
        slack.envioSlack(`[${hora}]: servicio NotifyEmail ha dejado de funcionar”`); 
})
};

function callServiceLoggly(){
  rp(`http://localhost:3800/api/funcionando`).then().catch((error) =>{
        slack.envioSlack(`[${hora}]: servicio Loggly ha dejado de funcionar”`); 
})
};

function monitoreoServicios(){
    callServiceGmail();
    callServiceLoggly();
}

setInterval(monitoreoServicios, 30000);

