var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){

    request.post({
        //todo
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/a06d8cfe-2cf5-445a-8e3b-037bba8f7ebf/url?iterationId=351dd5e6-1d0e-48cc-8fec-edabd3f5160f',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            //todo
            'Prediction-Key': '4d5cb4a2235a41968cd441c03eebdbf3'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Sorry we did not recognize this url, please try another');
    }
}