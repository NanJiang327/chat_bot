var rest = require('../API/Restclient');

exports.talkToQnA = function postQnAResults(session, question){
    //todo
    var url = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/301861b0-a21a-4990-b98c-7b739e69cb7e/generateAnswer';
    rest.postQnAResults(url, session, question, handleQnA)
};

function handleQnA(body, session, question) {
    session.send(body.answers[0].answer);
};