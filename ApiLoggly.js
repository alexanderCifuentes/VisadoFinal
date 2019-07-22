const express = require('express');
const app = express(); 
app.use(express.json());
const Loggly = require('./Loggly');
const Slack = require('./slack');
const slack = new Slack();
const hora =  new Date();

app.get('/api/funcionando', (req,res)=>{
  res.status(200).send();
});

function routehelper(callback){
  return async (req, res) => {
      await callback(req, res);
  }
}


app.post('/api/loggly/', routehelper(async (req,res)=>{
  const msg = req.body.msg;
  Loggly.info(msg);
  res.send();
  console.log('ok loggly');
}));



app.set('port', process.env.PORT || 3800);

app.listen(app.get('port'), ()=> {
  console.log(`Listening on port ${app.get('port')}...`);
  slack.envioSlack(`[${hora}]: El servicio Loggly ha vuelto a la normalidad`);
  
});
