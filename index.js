
const config = require('./config.js');
const AMQPProcessor = require('./modules/AMQPProcessor.js');
const SSEServer = require('./modules/SSEServer.js');

const amqp = new AMQPProcessor(Object.assign({}, config.amqp));

const server = new SSEServer(Object.assign({}, config.sse));

server.start((request, response) =>
{
    server.sendFrame(response, {
        id: 0,
        event: 'Hello',
        data: 'And welcome!'
    });

    amqp.subscribe(response, function(msg)
    {
        if(response.finished) return;

        console.log(msg);

        let msgJson = msg.content.toString();
        let msgData = JSON.parse(msgJson);

        server.sendFrame(response, {
            id: msgData.url,
            event: 'PostProcessed',
            data: JSON.stringify(msgJson)
        });
    });

    response.onclose = () =>
    {
        amqp.unsubscribe(response);
        response.end();
    };
});

amqp.connect();