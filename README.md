# kafka-consumer-microservice

Consome mensagens de um tópico Kafka e encaminha a notificação para o
Microsoft Teams (MessageCard) ou para o Slack (texto), conforme a URL do
webhook configurado em `WEBHOOK`.

> docker run --name consumidor_Kafka --rm --net=host --env TOPICO=meu-topico --env HOST=IP --env PORTA=9092 --env WEBHOOK=URL tonanuvem/64aoj_consumer_kafka:latest

Variáveis de ambiente:

- `HOST`: IP/host do broker Kafka
- `PORTA`: porta do broker (padrão `9092`)
- `TOPICO`: tópico consumido
- `GROUP_ID`: grupo do consumidor (padrão `grupo-1`)
- `WEBHOOK`: URL do webhook do Teams ou do Slack
- `CANAL`: canal usado no Slack (padrão `lab-consumidor`)

O formato é escolhido automaticamente:

- URL contendo `hooks.slack.com` → payload de texto (`channel`, `username`,
  `text`, `icon_emoji`), igual ao `kafka-producer`.
- Qualquer outra URL → `MessageCard` do Teams com
  `activitySubtitle: "Recebido via Kafka Consumer"`.

Se a mensagem recebida for o JSON publicado pelo producer, o campo `texto` é
usado na notificação; caso contrário, a mensagem é encaminhada como veio.
