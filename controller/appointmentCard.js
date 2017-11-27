var rest = require('../API/RestClient');
var builder = require('botbuilder');
var url = 'http://njmsabankbot.azurewebsites.net/tables/Appointments';

	exports.getAppointments = function getAppointments(session, username){
        
		rest.getAppointments(url, session, username, handleAppointmentsResponse);
	};

	function handleAppointmentsResponse(message, session, username) {
        // Parase JSON
		var appointmentsResponse = JSON.parse(message);
		var allAppointments = [];
		for (var index in appointmentsResponse) {
			var usernameReceived = appointmentsResponse[index].username;
            var branch = appointmentsResponse[index].branch;
            var time = appointmentsResponse[index].time;

			//Convert the username to lower cases
			if (username.toLowerCase() === usernameReceived.toLowerCase()) {
                rest.getAppointments(url, session, username, branch, time, displayAppointmentCards);
			}
		}
    }
    
    function displayAppointmentCards(message, username, branch, time, session){
        // Parase JSON
		var appointmentsResponse = JSON.parse(message);
		var appointmentCards = [];
		
		var appointmentCard = new builder.Message(session).addAttachment({
			contentType: "application/vnd.microsoft.card.adaptive",
			content: {
				"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
				"type": "AdaptiveCard",
				"version": "1.0",
				"body": [
					{
						"type": "Container",
						"items": [
							{
								"type": "TextBlock",
								"text": Appointment,
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
								"type": "ColumnSet",
								"columns": [
									{
										"type": "Column",
										"width": "auto",
										"items": [
											{
												"type": "TextBlock",
												"text": branch,
												"text": time
											}
										]
									}
								]
							}
						]
					}
				]
			}
		});
		session.send(appointmentCard);
	}	