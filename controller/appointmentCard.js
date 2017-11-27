var rest = require('../API/RestClient');
var builder = require('botbuilder');
var url = 'http://njmsabankbot.azurewebsites.net/tables/Appointments';

	exports.getAppointments = function getAppointments(session, username){
        
		rest.getAppointments(url, session, username, handleAppointmentsResponse);
	};

	function handleAppointmentsResponse(message, session, username) {
        // Parase JSON
		var appointmentsResponse = JSON.parse(message);
		var allAppointmentCards = [];
		for (var index in appointmentsResponse) {
			var usernameReceived = appointmentsResponse[index].username;
            var branch = appointmentsResponse[index].branch;
            var time = appointmentsResponse[index].time;

			//Convert the username to lower cases
			if (username.toLowerCase() === usernameReceived.toLowerCase()) {
			   var AppointmentNumber = parseFloat(index) + 1;
			   var appointmentCard = {
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
									"type": "ColumnSet",
									"columns": [
										{
											"type": "Column",
											"width": "auto",
											"items": [
												{
													"type": "TextBlock",
													"text": "Branch: "+branch+"",
												},
												{
													"type": "TextBlock",
													"text": "Date: "+time+"",
												},
											]
										}
									]
								}
							]
						}
					]
				}
			};
				allAppointmentCards.push(appointmentCard);
			}
		}
		var cards = new builder.Message(session)
			.attachmentLayout(builder.AttachmentLayout.carousel)
			.attachments(allAppointmentCards);
		session.send(cards);	
		
    }
    