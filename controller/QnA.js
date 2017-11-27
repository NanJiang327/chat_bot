var rest = require('../API/Restclient');

exports.talkToQnA = function postQnAResults(session, question){
    //todo
    var url = '';
    rest.postQnAResults(url, session, question, handleQnA)
};

function handleQnA(body, session, question) {
    session.send(body.answers[0].answer);
};