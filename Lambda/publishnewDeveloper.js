'use strict';
var AWS = require("aws-sdk");
var sns = new AWS.SNS();

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));

        if (record.eventName == 'INSERT') {
            var first = JSON.stringify(record.dynamodb.NewImage.first_name.S);
            var last = JSON.stringify(record.dynamodb.NewImage.last_name.S);
            var email = JSON.stringify(record.dynamodb.NewImage.email.S);
            var registered = JSON.stringify(record.dynamodb.NewImage.registered_at.S);
            var city = JSON.stringify(record.dynamodb.NewImage.city.S);
            var state = JSON.stringify(record.dynamodb.NewImage.state.S);
        
            var params = {
                Subject: 'New Developer: ' + first + ' ' + last,
                Message: 'New Developer: ' + first + ' ' + last + ' from: ' + city + ',' + state + ' registered at' + registered + ':\n\n ' + "email: " + email,
                TopicArn: 'arn:aws:sns:us-east-1:275959433100:developersTopic'
            };
            sns.publish(params, function(err, data) {
                if (err) {
                    console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Results from sending message: ", JSON.stringify(data, null, 2));
                }
            });
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};