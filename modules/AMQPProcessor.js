const amqp = require('amqplib/callback_api');

const AMQPConfig =
{
    conn: '',
    q: '',
    tag: ''
};

class AMQPProcessor
{
    constructor(config)
    {
        this.config = Object.assign({}, AMQPConfig, config);

        this.subscribers = new Map();
    }

    connect()
    {
        amqp.connect(this.config.conn, (err, conn) =>
        {
            if(err) {
                throw new Error(`AMQP: connection failed. Details: '${err.toString()}'.`);
            }

            console.log('Amqp connected...');

            conn.createChannel((err, ch) =>
            {
                ch.assertQueue(this.config.q, {durable: true});

                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", this.config.q);

                ch.consume(this.config.q, (msg) =>
                {
                    console.log(" [x] Received %s", msg.content.toString());
                    console.log(" [x] Of type: %s", msg.properties.headers.type);

                    this.subscribers.forEach(function(func) {
                        console.log(" [x] Processing message...")

                        func(msg);
                    });

                }, {
                    noAck: true,
                    consumerTag: this.config.tag
                });
            });
        });
    }

    subscribe(id, func)
    {
        this.subscribers.set(id, func);
    }

    unsubscribe(id)
    {
        this.subscribers.delete(id);
    }
}

module.exports = AMQPProcessor;