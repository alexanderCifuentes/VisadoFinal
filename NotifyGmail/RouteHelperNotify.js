
function routehelperApi(callback){
  
    return async (req, res) => {
      try{
        await callback(req, res);
      }catch(error){
        res.status(404).send({status: 404,errorCode: "RELATED_RESOURCE_NOT_FOUND"});
    }
    }
  
  }

  module.exports = routehelperApi;