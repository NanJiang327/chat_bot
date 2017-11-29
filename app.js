/*
* @Project name: MSA Contoso Chat Bot
* @Author: Nan Jiang
*/

var restify =  require('restify');
var builder = require('botbuilder');
var luis = require('./controller/Luis');

// Set up Restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3980, function(){
    console.log('%s server created - listening to %s',server.name, server.url);
});

// Create connector for communicating with the bot framework
var connector = new builder.ChatConnector({
    appId:"3c5a5ef7-4022-45eb-a166-4a51c5a76344",
    appPassword:"vhRXO682*tggnmROEN66|#="
});

// Listen for messages from users
server.post('/api/messages',connector.listen());

// Receive messages from user
var bot = new builder.UniversalBot(connector, function (session){
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

//Sends greeting message when the bot is added to a conversation
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                var reply = new builder.Message()
                    .address(message.address)
                    .addAttachment({
                        contentType: "application/vnd.microsoft.card.adaptive",
                        content: {
                            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
					        "backgroundImage": "https://i.pinimg.com/736x/df/0f/71/df0f710dccc57370c25fdb59b10311cd--free-iphone-wallpaper-wallpaper-for.jpg",
                            "type": "AdaptiveCard",
                            "version": "1.0",
                            "body": [
                                {
                                    "type": "Container",
                                    "items": [
                                        
                                        {
                                            "type": "ColumnSet",
                                            "columns": [
                                                {
                                                    "type": "Column",
                                                    "width": "auto",
                                                    "items": [
                                                        {
                                                            "type": "Image",
                                                            "url": "https://avatars3.githubusercontent.com/u/6422482?s=400&v=4",
                                                            "size": "medium",
                                                            "horizontalAlignment":"center",
                                                            "style": "person"
                                                        }
                                                    ]
                                                }
                                                
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "Container",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Welcome to Contoso Bank Chat bot!",
                                            "size": "large",
                                            "weight":"bolder",
                                            "wrap": true
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "You can type \"I want to make an appointment at branch 1 at (yyyy-mm-dd)\" to make an appointment, etc. ",
                                            "wrap": true
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "You can enter an img url of a currency to check the type of currency",
                                            "wrap": true
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "You can type \"currency rate\" to check currency",
                                            "wrap": true
                                        }
                                    ]
                                }
                            ]
                            
                        }
                    });
                bot.send(reply);
            }
        });
    }
});
    
// This line will call the function in your LuisDialog.js file
luis.startDialog(bot);