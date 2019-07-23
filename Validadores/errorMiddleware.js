const errorMiddleware = (error, req, res, next) => { 
    res.status(400)
    .send({status: 400,errorCode: 'BAD_REQUEST'});
 };

module.exports = errorMiddleware;