var axios = require('axios');
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    Offset = kafka.Offset,
    Client = kafka.KafkaClient,
    topico = process.env.TOPICO, // topico = 'meu-topico',
    broker = process.env.HOST + ":" + process.env.PORTA, // broker = '192.168.10.133:9092',
    client = new Client({ kafaHost: broker });
//    topics = [{ topic: topic, partition: 1 }, { topic: topic, partition: 0 }],
//    options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 },
//    consumer = new Consumer(client, topics, options);

    console.log("Servidor broker: " + broker);

    consumer = new Consumer(client,
        [{ topic: topico, partition: 0, offset: 'latest'}],
        {
            autoCommit: false
        }
    );

consumer.on('message', function (message) {
    console.log(message);
    postMSG_lida_para_o_slack(message.value)
});

consumer.on('error', function (err) {
    console.log('Error:',err);
})

consumer.on('offsetOutOfRange', function (err) {
    console.log('Erro de : offsetOutOfRange:');
    console.log('Executar o comando no Kafka para verififcar:');
    console.log('\t bin/kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list <broker-ip:9092> --topic <topic-name> --time -2 ');
})

function postMSG_lida_para_o_slack(msg){
    // format payload for slack
    var sdata = formatForSlack(msg)
    var url = 'https://hooks.slack.com/services/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'
    axios.post(url, sdata)
    .then((response) => {
      console.log('SUCCEEDED: Sent slack webhook: \n', response.data);
      //resolve(response.data);
    })
    .catch((error) => {
      console.log('FAILED: Send slack webhook', error);
      reject(new Error('FAILED: Send slack webhook'));
    });
}

function formatForSlack(msg){
  var payload ={
    "channel":'#async',
    "username":'app_kafka_consumer',
    "text": msg,
    "icon_emoji":':taxi:'
  };
  // return json string of payload
  return JSON.stringify(payload)
}
