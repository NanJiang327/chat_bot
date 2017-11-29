/*
* @Project name: MSA Contoso Chat Bot
* @Author: Nan Jiang
*/

var rest = require('../API/RestClient');
var url = 'http://contosobotnj.azurewebsites.net/tables/Appointments';

exports.deleteAppointment = function deleteAppointment(session,username,time, found){
	rest.getAppointmentsForDelete(url,session, username, time,function(message,session,username,time,found){
		var allAppointments = JSON.parse(message);
		var idFound;
		for(var i in allAppointments) {
			if (allAppointments[i].time === time && allAppointments[i].username === username) {
				found = true;
				idFound = allAppointments[i].id;
				break;
			}else{
				found = false;
			}
		}
		rest.checkAppointmentsExistForDelete(url, session, username, time, found, idFound,handleDeleteResponse);
	});
};

exports.makeAppointment = function makeAppointment(session, username,branch,  time){
	var exist = false;
	rest.checkAppointmentsExist(url, session, username, branch, time, exist, handleCheckAppointmentResponse);
	
};

//used to handle delete response
function handleDeleteResponse(message,session,username, time, found, idFound){
	if(found){
		rest.deleteAppointment(url,session,username,time,found,idFound,handleDeleteResponse);
		session.send("Hi, %s. Appointment at %s has been deleted", username, time);
	}else{
		session.send("Sorry, %s. you don't have an appointment at this day", username);
	}
}

//used to handle check appointment response
function handleCheckAppointmentResponse(message, session, username,branch,time, exist){
	var allAppointments = JSON.parse(message);
	for(var i in allAppointments){
		var usernameReceived = allAppointments[i].username;
		if(username.toLowerCase() === usernameReceived.toLowerCase()){
			if(allAppointments[i].time === time){
				exist = true;
				break;
			}else{
				exist = false;
			}
		}else{
			exist =false;
		}
	}
	rest.checkAppointmentsExist(url,session,username,branch,time,exist,hanldeCheckAppointmentResult);
}

// use for handle the check response result
function hanldeCheckAppointmentResult(message,session, username, branch, time, exist){
	if(exist){
		session.send("Sorry. You already have an appointment at %s", time);
	}else{
		session.send('Appointment for %s at %s at %s has been made',username, branch, time);
		rest.makeAppointment(url, username, branch, time);			
	}
}