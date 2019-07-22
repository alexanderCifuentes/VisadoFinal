
function validate(validation){
    return (req, res, next)=>{
        try{
            validation(req.body);
            next();
        }catch(error){
            next({cod: 400, errorCode: 'BAD_REQUEST'});}  
    };
}

//Validacion de artista
function validationArtist(data){
    const {name , country} = data;
    if(typeof name !== 'string' || name === undefined){
        throw ({cod: 400, errorCode: 'BAD_REQUEST'});
    }

    if(typeof country !== 'string' || name === undefined){
        throw ({cod: 400, errorCode: 'BAD_REQUEST'});
    }
}


function validationTrack(data){
    const {albumId, name, duration} = data;
    
    if(typeof name !== 'string' || name === undefined){
        throw ({cod: 400, errorCode: 'BAD_REQUEST'});
    }

    if(typeof albumId !== 'number' || albumId === undefined){
        throw ({cod: 400, errorCode: 'BAD_REQUEST'});
    }

    if(typeof duration !== 'number' || duration === undefined){
        throw ({cod: 400, errorCode: 'BAD_REQUEST'});
    }
}

//Validacion de album
function validationAlbum(data){
    const {name , year, artistId} = data;
    
    if(typeof name !== 'string' || name === undefined){
        throw ({cod: 400, errorCode: 'BAD_REQUEST'});
    }

    if(typeof year !== 'number' || year === undefined){
        throw ({cod: 400, errorCode: 'BAD_REQUEST'});
    }

    if(typeof artistId !== 'number' || artistId === undefined){
        throw ({cod: 400, errorCode: 'BAD_REQUEST'});
    }

}

//Validacion del json para subscribir y desuscribir
function validationSubscription(data){
    const {email , artistId} = data;
    if(typeof email !== 'string' || email === undefined){
        throw ({cod: 400, errorCode: 'BAD_REQUEST'});
    }

    if(typeof artistId !== 'number' || artistId === undefined){
        throw ({cod: 400, errorCode: 'BAD_REQUEST'});
    }
}

function validarSendEmail(data){
    const {id, artistName, albumName} = data;

    if(typeof id !== 'number' || id === undefined){
        throw ({cod: 402, errorCode: 'BAD_REQUEST'});
    }

    if(typeof artistName !== 'string' || artistName === undefined){
        throw ({cod: 402, errorCode: 'BAD_REQUEST'});
    }

    if(typeof albumName !== 'string' || albumName === undefined){
        throw ({cod: 402, errorCode: 'BAD_REQUEST'});
    }

}

function validarArtistId(data){
    const {artistId} = data;  
    if(typeof artistId !== 'number' || artistId === undefined){
        throw ({cod: 400, errorCode: 'BAD_REQUEST'});
    }
}

module.exports={
    validationArtist,validate,validationAlbum, validationTrack,validationSubscription, validarSendEmail,validarArtistId
}