const { Kafka } = require("kafkajs");
const { IncomingWebhook } = require("ms-teams-webhook");

const broker = `${process.env.HOST}:${process.env.PORTA}`;
const topico = process.env.TOPICO;

console.log("Servidor broker:", broker);
console.log("Topico:", topico);

const kafka = new Kafka({
    clientId: "kafka-consumer-microservice",
    brokers: [broker]
});

const consumer = kafka.consumer({
    groupId: process.env.GROUP_ID || "grupo-1"
});

async function iniciar() {

    try {
        await consumer.connect();
        console.log("Conectado ao Kafka.");
        await consumer.subscribe({
            topic: topico,
            fromBeginning: false
        });

        console.log("Consumindo mensagens...");

        await consumer.run({
            autoCommit: true,
            eachMessage: async ({ topic, partition, message }) => {
                const msg = message.value.toString();
                console.log({
                    topic,
                    partition,
                    offset: message.offset,
                    value: msg
                });
                await postMSG_lida(msg);
            }

        });
    } catch (err) {
        console.error("Erro:", err);
    }
}

async function postMSG_lida(msg) {
    const webhook = new IncomingWebhook(process.env.WEBHOOK);
    await webhook.send({
        text: msg
    });
}

process.on("SIGINT", async () => {
    console.log("Encerrando consumidor...");
    await consumer.disconnect();
    process.exit(0);

});

process.on("SIGTERM", async () => {
    await consumer.disconnect();
    process.exit(0);
});

iniciar();
