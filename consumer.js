const Kafka = require('no-kafka');

// Create an instance of the Kafka consumer
const consumer = new Kafka.SimpleConsumer({"connectionString":"127.0.0.1:29092"})
var data = function (messageSet) {
    messageSet.forEach(function (m) {
        var mensagem = m.message.value.toString('utf8');
        postMSG(mensagem);
    });
};

// Subscribe to the Kafka topic
return consumer.init().then(function () {
    return consumer.subscribe('kafka-python-topic', data);
});

function postMSG(msg){
  // format payload for slack
  var sdata = formatForSlack(msg, chan)
  // log in console
  console.log(sdata)
  // post
   $.ajax({
     // url is what you get from activating the "Incoming WebHooks" slack integration
     // if you leave, you should see an error message "No Team", status 404
     url: 'https://hooks.slack.com/services/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',
     type: 'POST',
     processData: true,
     data : sdata ,
     success : function(data) {
       // success will show on page
       console.log(data)
       $('#result').html(data);
     },
     error: function(data){
       // error will show error object
       console.log(data)
       $('#result').html("error:"+JSON.stringify(data));
    }
   });
}
/*
* format for slack
* change "username" per instructions
* change emoji icon if desired
*/
function formatForSlack(msg, chan){
  var payload ={
    "channel":chan,
    "username":'app_html',
    "text": msg,
    "icon_emoji":':ghost:'
  };
  // return json string of payload
  return JSON.stringify(payload)
}
