var rest = require('../API/RestClient');
var url = 'http://njmsabankbot.azurewebsites.net/tables/Appointments';

exports.getAppointments = function getAppointments(session, username){
	
	rest.getAppointments(url, session, username, handleAppointmentsResponse);
};


exports.deleteAppointment = function deleteAppointment(session,username){
	rest.getAppointments(url,session, username,function(message,session,username){
		var allAppointments = JSON.parse(message);
		for(var i in allAppointments) {
			console.log(username)
			console.log(allAppointments[i].username === username)
			if (allAppointments[i].appointment === appointment && allAppointments[i].username === username) {

				console.log(allAppointments[i]);
	            rest.deleteFavouriteFood(url,session,username,appointment, allAppointments[i].id ,handleDeletedFoodResponse)
				session.send("Appointment at %s at %s has been delted", appointment.branch, appointment.time);
			}
		}
	
	
	});
};

exports.makeAppointment = function makeAppointment(session, username, place, time){
	rest.makeAppointment(url, username, place, time);
};