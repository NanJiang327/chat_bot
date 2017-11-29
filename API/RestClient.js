/*
* @Project name: MSA Contoso Chat Bot
* @Author: Nan Jiang
*/

var request = require('request');

exports.getAppointments= function getData(url, session, username, weatherInfo, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username, weatherInfo);
        }
    });
};

exports.getAppointmentsForDelete= function getData(url, session, username, time, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username, time);
        }
    });
};

exports.checkAppointmentsExistForDelete= function getData(url, session, username,time,found,id, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username,time, found,id);
        }
    });
};

exports.checkAppointmentsExist= function getData(url, session, username,branch,time,exist, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username,branch,time, exist);
        }
    });
};


exports.deleteAppointment = function deleteData(url,session, username , time, found, id){
    var options = { 
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };
    
    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};

exports.makeAppointment = function SendData(url, username, branch, time){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "branch" : branch,
            "time" : time
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};

// Request weather data
exports.getWeatherForecast = function getData(url,session,username, callback){
    request.get(url, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
}

// Request currency data
exports.getCurrencyData = function getData(url,session, callback){
    request.get(url, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session);
        }
    });
}

//request QnA
exports.postQnAResults = function getData(url, session, question, callback){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': '6864ab085d7844118e02efb7c931e500',
            'Content-Type':'application/json'
        },
        json: {
            "question" : question
        }
      };
  
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body, session, question);
        }
        else{
            console.log(error);
        }
      });
  };