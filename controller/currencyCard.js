/*
* @Project name: MSA Contoso Chat Bot
* @Author: Nan Jiang
*/

var rest = require('../API/RestClient');
var builder = require('botbuilder');

exports.displayCurrencyCards = function getCurrencyData(session){
    var url = "http://apilayer.net/api/live?access_key=459c5f0b9bec61ec4abc10049635c558&currencies=NZD,CNY,AUD,GBP,EUR&source=&format=1";

    rest.getCurrencyData(url,session, displayCurrencyCards);
}

function displayCurrencyCards(message, session){
    var currencyList = JSON.parse(message);
    var currencyQutes = currencyList.quotes;
    var timeStamp = currencyList.timestamp;
    var time = timeStampConvertor(timeStamp);
    console.log("time1 = %s", timeStamp);
    console.log("time2 = %s", time);
    session.send(new builder.Message(session).addAttachment({
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
                            "text": "Currency Source: USD",
                            "size": "extraLarge",
                            "horizontalAlignment": "center"
                        },
                        {
                            "type": "TextBlock",
                            "horizontalAlignment": "center",
                            "text": "Last Upate: "+time+"",
                        }
                    ]
                },
                {
                    "type": "Container",
                    "separator":true,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "1 USD = "+currencyQutes.USDNZD+" NZD",
                            "color": "warning",
                            "separator": true,
                            "isSubtle": true,
                        },
                        {
                            "type": "TextBlock",
                            "text": "1 USD = "+currencyQutes.USDCNY+" CNY",
                            "color": "warning",
                            "separator": true,
                            "isSubtle": true,
                        },
                        {
                            "type": "TextBlock",
                            "text": "1 USD = "+currencyQutes.USDAUD+" AUD",
                            "color": "warning",
                            "separator": true,
                            "isSubtle": true,
                        },
                        {
                            "type": "TextBlock",
                            "text": "1 USD = "+currencyQutes.USDGBP+" GBP",
                            "color": "warning",
                            "separator": true,
                            "isSubtle": true,
                        },{
                            "type": "TextBlock",
                            "text": "1 USD = "+currencyQutes.USDEUR+" EUR",
                            "color": "warning",
                            "separator": true,
                            "isSubtle": true,
                        }
                    ]
                }
            ]
            
        }
    }));
}

// Convert time stamp to date time
function timeStampConvertor(timeStamp){
    var datetime = new Date();
    datetime.setTime(timeStamp * 1000);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    return year + "-" + month + "-" + date+" "+hour+":"+minute; 
};