var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){

    request.post({
        //todo
        url: '',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            //todo
            'Prediction-Key': ''
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
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