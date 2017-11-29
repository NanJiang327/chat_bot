/*
* @Project name: MSA Contoso Chat Bot
* @Author: Nan Jiang
*/

var rest = require('../API/RestClient');
var url = 'http://contosobotnj.azurewebsites.net/tables/Appointments';

exports.deleteAppointment = function deleteAppointment(session,username){
	rest.getAppointments(url,session, username,function(message,session,username){
		var allAppointments = JSON.parse(message);
		for(var i in allAppointments) {
			if (allAppointments[i].appointment === appointment && allAppointments[i].username === username) {

				console.log(allAppointments[i]);
	            rest.deleteFavouriteFood(url,session,username,appointment, allAppointments[i].id ,handleDeletedFoodResponse)
				session.send("Appointment at %s at %s has been deleted", appointment.branch, appointment.time);
			}
		}
	
	
	});
};

exports.makeAppointment = function makeAppointment(session, username, branch, time){
	var exist = false;
	rest.checkAppointmentsExist(url, session, username, branch, time, exist, handleCheckAppointmentResponse);
	
};

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