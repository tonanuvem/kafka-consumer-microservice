/*
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.KafkaClient;
var argv = require('optimist').argv;
var topic = argv.topic || 'topic1';

var client = new Client({ kafaHost: 'localhost:9092' });
var topics = [{ topic: topic, partition: 1 }, { topic: topic, partition: 0 }];
var options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };

var consumer = new Consumer(client, topics, options);
var offset = new Offset(client)
*/

var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    Offset = kafka.Offset,
    Client = kafka.KafkaClient,
    topic = 'meu-topico',
    client = new Client({ kafaHost: '10.2.3.102:9092' }),
    topics = [{ topic: topic, partition: 1 }, { topic: topic, partition: 0 }],
    options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 },
    
    consumer = new Consumer(client,
        [{ topic: 'meu-topico', offset: 0}],
        {
            autoCommit: false
        }
    );

consumer.on('message', function (message) {
    console.log(message);
});

consumer.on('error', function (err) {
    console.log('Error:',err);
})

consumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange:',err);
})

/*import axios from 'axios';
const Kafka = require('no-kafka');
// Create an instance of the Kafka consumer
const consumer = new Kafka.SimpleConsumer({"connectionString":"localhost:9092"})
var data = function (messageSet) {
    messageSet.forEach(function (m) {
        var mensagem = m.message.value.toString('utf8');
        console.log(`Lida a msg: ${mensagem}`);
        postMSG_lida_para_o_slack(mensagem);
        console.log(`Postada a msg: ${mensagem}`);
    });
};

// Subscribe to the Kafka topic
return consumer.init().then(function () {
    console.log(`Inicio... subscrevendo no topico`);
    return consumer.subscribe('meu-topico', data);
});
*/

/*
OPÇÃO 1:

const options = {
  text: "Message from slack bot!!",
};

axios.post('<SLACK_WEBHOOK_URL>', JSON.stringify(options))
.then((response) => {
  console.log('SUCCEEDED: Sent slack webhook: \n', response.data);
  resolve(response.data);
})
.catch((error) => {
  console.log('FAILED: Send slack webhook', error);
  reject(new Error('FAILED: Send slack webhook'));
});
*/

/*
OPÇÃO 1:
*/
function postMSG_lida_para_o_slack(msg){
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
