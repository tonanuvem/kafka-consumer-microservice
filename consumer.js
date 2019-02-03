var axios = require('axios');
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    Client = kafka.KafkaClient,
    topico = process.env.TOPICO, // topico = 'meu-topico',
    broker = process.env.HOST + ":" + process.env.PORTA, // broker = '192.168.10.133:9092',
    client = new Client({ kafaHost: broker });
//    topics = [{ topic: topic, partition: 1, offset:'earliest' }, { topic: topic, partition: 0, offset:'latest' }],
//    options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 },
//    consumer = new Consumer(client, topics, options);

    console.log("Servidor broker: " + broker);
    // Codigo : https://www.npmjs.com/package/kafka-node#consumer
    offset = new kafka.Offset(client);
    offset.fetch([
        { topic: topico, partition: 0, time: -2, maxNum: 1 }
    ], function (err, data) {
        console.log('Error obtendo Fetch do Offset:',err);
    });
    //console.log("Offset fetched: " + JSON.stringify(offset));

    consumer = new Consumer(client,
        [{ topic: topico, partition: 0, offset: 'latest'}],
        { autoCommit: false, fromOffset: true }
    );


consumer.on('message', function (message) {
    console.log(message);
    postMSG_lida_para_o_slack(message.value)
});

consumer.on('error', function (err) {
    console.log('Error:',err);
})
/*
consumer.on('offsetOutOfRange', function (err) {
    console.log('Erro de : offsetOutOfRange:');
    //console.log('Executar o comando no Kafka para verififcar:');
    //console.log('\t bin/kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list <broker-ip:9092> --topic <topic-name> --time -2 ');
    //process.exit(1);
    topico.maxNum = 2;
    offset.fetch([topico], function (err, offsets) {
    if (err) {
          return console.error(err);
    }
    var min = Math.min.apply(null, offsets[topico.topic][topico.partition]);
    consumer.setOffset(topico.topic, topico.partition, min);
    console.log('\t Consertando erro : fetched data from the smallest(oldest) offset');
  });
})
*/
consumer.on('offsetOutOfRange', function (topic) {
  topic.maxNum = 2;
  offset.fetch([topic], function (err, offsets) {
    if (err) {
      return console.error(err);
    }
    var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
    consumer.setOffset(topic.topic, topic.partition, min);
  });
});

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
