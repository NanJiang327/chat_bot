/*
* @Project name: MSA Contoso Chat Bot
* @Author: Nan Jiang
*/

var rest = require('../API/RestClient');
var builder = require('botbuilder');
var request = require('request');
var url = 'http://contosobotnj.azurewebsites.net/tables/Appointments';

	// used for unit test
	//module.exports = checkDate;

	exports.displayAppointments = function getAppointments(session, username){
		var weatherUrl = "http://api.apixu.com/v1/forecast.json?key=4afdc4ed6cc64789bbd223959172711 &q=Auckland&days=7";
		rest.getWeatherForecast(weatherUrl, session, username,handleWeatherInfoResponse);
	}

	function handleWeatherInfoResponse(message, session, username){
		var weatherInfo = JSON.parse(message);
		rest.getAppointments(url, session, username, weatherInfo, displayAppointmentsResponse);
	}

	function displayAppointmentsResponse(message, session, username, weatherInfo) {
		// Parase JSON
		var appointmentsResponse = JSON.parse(message);
		var allAppointmentCards = [];
		var AppointmentNumber = 0;
		var forecastDay = weatherInfo.forecast;
		var forecastItems = [];	

		//put 7 forecast itme  into forecast item set
		for(var i = 0; i <7; i++){
			var forecastItem = {};
			forecastItem.date = forecastDay.forecastday[i].date;
			forecastItem.temp = forecastDay.forecastday[i].day.avgtemp_c;
			forecastItem.text = forecastDay.forecastday[i].day.condition.text;
			
			forecastItems.push(forecastItem);
		}

		for (var index in appointmentsResponse) {
			var usernameReceived = appointmentsResponse[index].username;
            var branch = appointmentsResponse[index].branch;
			var time = appointmentsResponse[index].time;
			var temp, text;

			//Convert the username to lower cases
			if (username.toLowerCase() === usernameReceived.toLowerCase()&&checkDate(time)) {
				//get weather info for selected date
				for (var x in forecastItems){
					if(time === forecastItems[x].date){
						temp  = forecastItems[x].temp;
						text = forecastItems[x].text;
						break;
					}
				}
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
									"text": "AUCKLAND, NZ",
									"size": "large",
									"weight":"bolder"
								},
								{
									"type": "ColumnSet",
									"columns": [
										{
											"type": "Column",
											"width": "auto",
											"items": [
												{
													"type": "TextBlock",
													"text": ""+temp+" °C",
													"size": "medium",
													"spacing": "none"
												},
												{
													"type": "TextBlock",
													"text": text,
													"size": "medium",
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
	
