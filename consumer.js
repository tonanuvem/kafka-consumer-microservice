const { Kafka } = require("kafkajs");

const broker = `${process.env.HOST}:${process.env.PORTA}`;
const topico = process.env.TOPICO;

const ICONE = "https://cdn-icons-png.magnific.com/512/15716/15716953.png";
//const ICONE = "https://cdn4.iconfinder.com/data/icons/pop-scenes/1000/workspace___work_from_home_laptop_computer_drink_beverage-1024.png";

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
                const msg = message.value ? message.value.toString() : "";
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

// O producer publica o objeto JSON completo; para a notificação usamos o
// campo "texto" (mesmo comportamento do kafka-producer). Se não for JSON,
// encaminha a mensagem como veio.
function extrairTexto(msg) {
    try {
        const dados = JSON.parse(msg);
        if (dados && typeof dados === "object" && dados.texto) {
            return String(dados.texto);
        }
    } catch (_) {
        // não é JSON: usa a mensagem original
    }
    return msg;
}

function formatMSG(msg, url) {
    const texto = extrairTexto(msg);

    if (url.includes("hooks.slack.com")) {
        // formato de texto para o Slack
        return {
            "channel": process.env.CANAL,
            "username": "app_kafka_consumer",
            "text": texto,
            "icon_emoji": ":mailbox_with_mail:"
        };
    }

    // formato MessageCard para o Microsoft Teams
    return {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0072C6",
        "summary": "Nova Mensagem",
        "sections": [{
            "activityTitle": texto,
            "activitySubtitle": "Recebido via Kafka Consumer",
            "activityImage": ICONE
        }]
    };
}

async function postMSG_lida(msg) {
    const url = process.env.WEBHOOK;
    if (!url || url === "inserir_webhook") {
        console.log("WEBHOOK não configurado; mensagem não encaminhada.");
        return;
    }

    const payload = formatMSG(msg, url);

    try {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (resposta.ok) {
            console.log(`SUCCEEDED: Sent webhook (HTTP ${resposta.status})`);
        } else {
            console.error(`FAILED: Send webhook (HTTP ${resposta.status})`);
        }
    } catch (err) {
        console.error("Erro ao enviar webhook:", err);
    }
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
