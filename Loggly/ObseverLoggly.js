const rp = require('request-promise');
class ObserverLoggly{

    envioLog(msg){
        const opt = {
          method: 'POST',
          uri: 'http://localhost:3800/api/loggly',
          body: {
            msg: msg, 
          },
          json: true
        }
        rp(opt).then(console.log('Ok Loggly'))
          .catch((error) => {console.log('No se comunico a loggly')});
         
        }
}

module.exports = ObserverLoggly;