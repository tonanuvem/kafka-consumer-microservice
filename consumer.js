// https://www.npmjs.com/package/ms-teams-webhook
const { IncomingWebhook } = require("ms-teams-webhook");
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    Offset = kafka.Offset,
    Client = kafka.KafkaClient,
    topico = process.env.TOPICO, // topico = 'meu-topico',
    broker = process.env.HOST + ":" + process.env.PORTA, // broker = '192.168.10.133:9092',
    client = new Client({ kafkaHost: broker });
//    topics = [{ topic: topic, partition: 1, offset:'earliest' }, { topic: topic, partition: 0, offset:'latest' }],
//    options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 },
//    consumer = new Consumer(client, topics, options);

    console.log("Servidor broker: " + broker);

    consumer = new Consumer(client,
        [{ topic: topico, partition: 0, offset: 'latest'}],
        { autoCommit: false, fromOffset: true }
    );


consumer.on('message', function (message) {
    console.log(message);
    postMSG_lida(message.value)
});

consumer.on('error', function (err) {
    console.log('Error:',err);
})

consumer.on('offsetOutOfRange', function (topic) {
    // Codigo : https://github.com/SOHU-Co/kafka-node/blob/master/example/consumer.js
    topic.maxNum = 2;
    offset.fetch([topic], function (err, offsets) {
        if (err) {
            return console.error(err);
        }
    var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
    consumer.setOffset(topic.topic, topic.partition, min);
  });
});

function postMSG_lida(msg){
    var url = process.env.WEBHOOK
    // Initialize
    const webhook = new IncomingWebhook(url);
    (async () => {
      await webhook.send({
        'text': msg
      });
    })();
}
