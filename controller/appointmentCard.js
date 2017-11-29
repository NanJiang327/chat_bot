/*
* @Project name: MSA Contoso Chat Bot
* @Author: Nan Jiang
*/
var rest = require('../API/RestClient');
var builder = require('botbuilder');
var request = require('request');
var url = 'http://contosobotnj.azurewebsites.net/tables/Appointments';


	exports.displayAppointments = function getAppointments(session, username){
		var weatherUrl = "http://api.apixu.com/v1/forecast.json?key=4afdc4ed6cc64789bbd223959172711 &q=Auckland&days=7"
	//	rest.getWeatherForecast(weatherUrl,session,handleWeatherInfoResponse);
		rest.getAppointments(url, session, username, handleAppointmentsResponse);

	}

	// function handleWeatherInfoResponse(message){
	// 	var weatherResponse = JSON.parse(message);
	// 	var weatherList = weatherResponse.location;
	// 	console.log("Location: %s----",weatherList);

	// }
	function handleAppointmentsResponse(message, session, username) {
		// Parase JSON
		var appointmentsResponse = JSON.parse(message);
		console.log("-=-=%s-=-=-", appointmentsResponse[0]);
		var allAppointmentCards = [];
		var AppointmentNumber = 0;

		for (var index in appointmentsResponse) {
			var usernameReceived = appointmentsResponse[index].username;
            var branch = appointmentsResponse[index].branch;
			var time = appointmentsResponse[index].time;
			//Convert the username to lower cases
			console.log("username: %s branch: %s, time : %s", usernameReceived, branch, time);
			if (username.toLowerCase() === usernameReceived.toLowerCase()&&checkDate(time)) {
				AppointmentNumber += 1;
				if(checkIfWithinSevenDays(time)){
					var appointmentCard = {
						contentType: "application/vnd.microsoft.card.adaptive",
						content: {
							"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
							"backgroundImage": "http://www.pptback.com/backgrounds/abstract-cartoon-cloud-art-backgrounds-powerpoint.jpg",
							"type": "AdaptiveCard",
							"version": "1.0",
							"body": [
								{
									"type": "Container",
									"items": [
										{
											"type": "TextBlock",
											"text": "Appointment "+AppointmentNumber+"",
											"size": "large"
										},
										{
											"type": "TextBlock",
											"text": "Appointment Information"
										}
									]
								},
								{
									"type": "Container",
									"spacing": "none",
									"items": [
										{
											"type": "FactSet",
											"facts": [
												{
													"title": "User: ",
													"value": username
												},
												{
													"title": "Branch: ",
													"value": branch
												},
												{
													"title": "Date: ",
													"value": time
												}
											]
										}
									]
								},
								{
									"separator": true,
									"type": "TextBlock",
									"text": "Seattle, WA",
									"size": "large",
									"isSubtle": true
								},
								{
									"type": "TextBlock",
									"text": "September 18, 7:30 AM",
									"spacing": "none"
								},
								{
									"type": "ColumnSet",
									"columns": [
										{
											"type": "Column",
											"width": "auto",
											"items": [
												{
													"type": "Image",
													"url": "http://messagecardplayground.azurewebsites.net/assets/Mostly%20Cloudy-Square.png",
													"size": "small"
												}
											]
										},
										{
											"type": "Column",
											"width": "auto",
											"items": [
												{
													"type": "TextBlock",
													"text": "42°C",
													"size": "extraLarge",
													"spacing": "none"
												}]
										}
									]
								}
							]
						}
				}

				}else{
					var appointmentCard = {
						contentType: "application/vnd.microsoft.card.adaptive",
						content: {
							"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
							"backgroundImage": "http://www.pptback.com/backgrounds/abstract-cartoon-cloud-art-backgrounds-powerpoint.jpg",
							"type": "AdaptiveCard",
							"version": "1.0",
							"body": [
								{
									"type": "Container",
									"items": [
										{
											"type": "TextBlock",
											"text": "Appointment "+AppointmentNumber+"",
											"size": "large"
										},
										{
											"type": "TextBlock",
											"text": "Appointment Information"
										}
									]
								},
								{
									"type": "Container",
									"spacing": "none",
									"items": [
										{
											"type": "FactSet",
											"facts": [
												{
													"title": "User: ",
													"value": username
												},
												{
													"title": "Branch: ",
													"value": branch,
												},
												{
													"title": "Date: ",
													"value": time,
												}
											]
										}
									]
								},
								{
									"separator": true,
									"type": "TextBlock",
									"text": "Weather service only availabe within 7 days",
									"size": "medium",
									"isSubtle": true
								},
							]
						}
				}
			};
				allAppointmentCards.push(appointmentCard);
			}
		}
		//Check if the user has appointments
		if(allAppointmentCards.length > 0){
				var cards = new builder.Message(session)
			.attachmentLayout(builder.AttachmentLayout.carousel)
			.attachments(allAppointmentCards);
			session.send(cards);
		}else{
			session.send("Hi, %s. You don't have any appointments at the moment",username);
		}
		
		
	}

//Method used to check the date
function checkDate(time){
    var today = new Date();
    var selectedDate =new Date(time.replace(/-/g,"/")); 
	// Check the date is futur or not
	var result = selectedDate - today;
     if(selectedDate > today){
         return true;
     }else{
          return false;       
	 } 
}

function checkIfWithinSevenDays(time){
	var today = new Date();
	var selectedDate =new Date(time.replace(/-/g,"/")); 
	// Check the date is futur or not
	var result = selectedDate - today;
	//Check the time difference in millisecond
	if(result <= 604800000){
		return true;
	}else{
		return false;       
	} 
}
    