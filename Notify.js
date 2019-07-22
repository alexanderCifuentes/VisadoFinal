const express = require('express');
const app = express(); 
app.use(express.json());
const routehelper = require('./RouteHelperNotify');
const Manager = require('./ManagerSubscription');
const rp = require('request-promise');
const manager = new Manager();
const Validations = require('./Validations');
const ManejoErrores = require('./errorMiddleware');
const Slack = require('./slack');
const slack = new Slack();
const hora =  new Date();
//-------------------------------------- POST --------------------------------------------------------------

app.get('/api/funcionando', (req,res)=>{
  res.status(200).send();
});

//Subscribe un email a un artista. Si el email ya está suscrito no hace nada.
app.post('/api/subscribe', Validations.validate(Validations.validationSubscription), routehelper(async (req, res)=>{
  const id =+parseInt(req.body.artistId);
  await rp(`http://localhost:3000/api/artists/${id}`);
  manager.addSubscription(req.body.email, parseInt(req.body.artistId));
  res.status(200).send();

}));

//Desubscribe un email de un feed. Si el email no esta suscrito no hace nada.
app.post('/api/unsubscribe', Validations.validate(Validations.validationSubscription), routehelper(async (req,res) =>{
  const id =+parseInt(req.body.artistId);
  const art = await rp(`http://localhost:3000/api/artists/${id}`);
  console.log(art)
  manager.removeSubscription(req.body.email, parseInt(req.body.artistId));
  res.status(200).send();
}));

//

//Notifica vía mail, un mensaje a todos los usuarios suscritos a este artista.
app.post('/api/notify', (req,res) =>{
  manager.enviarMail(req.body);
  res.status(200).send({msg: 'OK'})
});

//Notifica vía mail, un mensaje a todos los usuarios suscritos a este artista.
app.post('/api/notify', Validations.validate(Validations.validarSendEmail), routehelper (async (req,res) =>{
  manager.enviarMail(req.body);
  res.status(200).send({msg: 'OK'})
}));


//Rutas invalidas
app.post('*', (req, res) =>{
  res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
});

//------------------------------------------- GET -------------------------------------------------------------

//Obtener todos los emails suscritos a un artista
app.get('/api/subscriptions', routehelper(async (req,res)=>{
  const id =+parseInt(req.query.artistId);
  await rp(`http://localhost:3000/api/artists/${id}`);
  res.status(200).send({"artistId": id, "subscriptors": manager.usersRegisterByArtist(id)});
}));

app.get('*', (req, res) =>{
  res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
});

//----------------------------------DELETE ---------------------------------------------------------------------

//Borra todas las suscripciones para un artista (útil cuando se borra un artistaen UNQfy).
app.delete('/api/subscriptions', Validations.validate(Validations.validarArtistId), routehelper(async (req,res)=>{
  const id =+parseInt(req.body.artistId);
  await rp(`http://localhost:3000/api/artists/${id}`);
  manager.removeSubscriptionsForArtist(parseInt(id));
  res.status(200).send();
}));

app.delete('*', (req, res) =>{
  res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
});

//Maneja errores del JSON
app.use(ManejoErrores);

app.set('port', process.env.PORT || 7000);

app.listen(app.get('port'), ()=> {
  console.log(`Listening on port ${app.get('port')}...`);
  slack.envioSlack(`[${hora}]: El servicio NotifyEmail ha vuelto a la normalidad`);
  
});




