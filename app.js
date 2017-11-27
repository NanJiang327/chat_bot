var restify =  require('restify');
var builder = require('botbuilder');
var luis = require('./controller/Luis');

// Set up Restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s server created - listening to %s',server.name, server.url);
});

// Create connector for communicating with the bot framework
var connector = new builder.ChatConnector({
    appId:"",
    appPassword:""
});

// Listen for messages from users
server.post('/api/messages',connector.listen());

// Receive messages from user
var bot = new builder.UniversalBot(connector, function (session){
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// connector.startConversation(function(session){
//     session.send('-----------112121212------');
// })
    
// This line will call the function in your LuisDialog.js file
luis.startDialog(bot);