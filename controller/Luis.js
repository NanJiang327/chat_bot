var builder = require('botbuilder');
var customVision = require('./CustomVision');
var appointment = require('./Appointments');
var appointmentCard = require('./appointmentCard');
var qna = require('./QnA');

exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b3af0d31-1a00-41dd-9849-e6a5c38bcbd5?subscription-key=6b1443a209db4491a09da29c00fcf5ea&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('GetAppointment', [
        function (session, args, next) {
			session.dialogData.args = args || {};
			if (!session.conversationData["username"]) {
				builder.Prompts.text(session, "Enter a username to get your appointments.");
            }else {
				next(); // Skip if we already have this info.
			}
		},
		function (session, results, next) {
			if (!isAttachment(session)) {

				if (results.response) {
					session.conversationData["username"] = results.response;
				}

				session.send("Retrieving your appointments");
                appointmentCard.getAppointments(session.conversationData["username"],session); 
			}
		}
    ]).triggerAction({
        matches: 'GetAppointment'
    });

    bot.dialog('DeleteAppointment', [
        function (session, args, next){
            if(!isAttachment(session)){
                session.dialogData.args = args || {};
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Enter a username first.");
                } else {
                    next(); // Skip if we already have this info.
                }
        }},
        function (session, results,next) {
            if (!isAttachment(session)) {
                if (results.response) {
                        session.conversationData["username"] = results.response;
                }
           
                session.send("You want to delete one of your favourite foods.");
            
                // Pulls out the food entity from the session if it exists
                var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');
            
                // Checks if the for entity was found
                if (foodEntity) {
                    session.send('Deleting \'%s\'...', foodEntity.entity)
    
                    food.deleteFavouriteFood(session,session.conversationData['username'],foodEntity.entity); //<--- CALLL WE WANT
                } else {
                     session.send("No food identified! Please try again");
                }
             }
    }]).triggerAction({
        matches: 'DeleteAppointment'
    });

    bot.dialog('AddAppointment', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to make appointments.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                // Pulls out the time entity from the session if it exists
                var time = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'time');
            
                // Pulls out the place entity from the session if it exists
                var place = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'place');

                // Checks if the time and place entity was found
                if (time.entity&&place.entity) {
                
                    if(place.entity === "branch 1"){
                        if(checkDate(time,session)){;
                            appointment.makeAppointment(session, session.conversationData["username"], place.entity, timeNoSpace);
                        }
                    }else{
                        session.send("Can only make appointments at \'branch 1\' at the moment");
                    }
                } else {
                    session.send("No branch or time identified");
                }
            }
        }
    ]).triggerAction({
        matches: 'AddAppointment'
    });

    bot.dialog('WelcomeIntent', [
        // Insert logic here later
        function (session, args, next) {
			session.dialogData.args = args || {};
			if (!session.conversationData["username"]) {
				builder.Prompts.text(session, "Hi, please enter your name first.");
			} else {
				next(); // Skip if we already have this info.
			}
		},
        function (session, results){

            if (results.response) {
                session.conversationData["username"] = results.response;
            }
            session.send("Hi, %s. What can I do for you today?", session.conversationData["username"]);
        }
    ]).triggerAction({
        matches: 'WelcomeIntent'
    });

    bot.dialog('QnA', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            builder.Prompts.text(session, new builder.Message(session).addAttachment({
				contentType: "application/vnd.microsoft.card.adaptive",
				content: {
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "type": "AdaptiveCard",
                    "version": "1.0",
                    "body": [
                    {
                        "type": "ColumnSet",
                        "columns": [
                        
                        {
                            "type": "Column",
                            "width": 2,
                            "items": [
                            {
                                "type": "TextBlock",
                                "text": "How can I help you today?",
                                "weight": "bolder",
                                "size": "medium"
                            },
                            {
                                "type": "TextBlock",
                                "text": "You can ask:",
                                "isSubtle": true,
                                "wrap": true,
                                "size": "small"
                            },
                            {
                                "type": "TextBlock",
                                "text": "where is the branch 1?",
                                "isSubtle": true,
                                "wrap": true,
                                "size": "small"
                            },
                            {
                                "type": "TextBlock",
                                "text": "how many branchs in auckland?",
                                "isSubtle": true,
                                "wrap": true,
                                "size": "small"
                            },
                            {
                                "type": "TextBlock",
                                "text": "what can I do in the chat bot?",
                                "isSubtle": true,
                                "wrap": true,
                                "size": "small"
                            },
                            {
                                "type": "TextBlock",
                                "text": "I want to know more informations",
                                "isSubtle": true,
                                "wrap": true,
                                "size": "small"
                            }
                            
                            ]
                        }
                        ]
                    }
                    ]
                }
              }));
        },
        function (session, results, next) {
            qna.talkToQnA(session, results.response);
        }
    ]).triggerAction({
        matches: 'QnA'
    });

    
// Function is called when the user inputs an attachment
function isAttachment(session) { 
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
        
        customVision.retreiveMessage(session);
        //call custom vision here later
        return true;
    }
    else {
        return false;
    }
}

//Method used to check the date
function checkDate(time,session){
    //reg for time slot
    var timeValidator = /((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/;
    //remove space in time.entity
    timeNoSpace = time.entity.replace(/\s/g, "");
    console.log('-=-=-%s-=-=',timeNoSpace);
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
            session.send("Can only make appointments for the future");
            return false;       
        }
    }    
}

}