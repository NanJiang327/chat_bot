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
		var AppointmentNumber = 0;
		for (var index in appointmentsResponse) {
			var usernameReceived = appointmentsResponse[index].username;
            var branch = appointmentsResponse[index].branch;
			var time = appointmentsResponse[index].time;
			
			//Convert the username to lower cases
			if (username.toLowerCase() === usernameReceived.toLowerCase()&&checkDate(time,session)) {
			    AppointmentNumber += 1;
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
function checkDate(time,session){
    //reg for time slot
    var timeValidator = /((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/;
    //remove space in time
    timeNoSpace = time.replace(/\s/g, "");
    var result = timeNoSpace.match(timeValidator);

    // Check date format
    if(result == null){
        session.send("The time format should be \"2017-11-27\"");
        return false;
    }else{
        var today = new Date();
        var selectedDate =new Date(timeNoSpace.replace(/-/g,"/")); 
        // Check the date is futur or not
        if(selectedDate > today){
            return true;
        }else{
            return false;       
        }
    }    
}
    