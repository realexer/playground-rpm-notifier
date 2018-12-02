module.exports =
{
    sse: {
        port: 9091,
        headers: {
            'Access-Control-Allow-Origin': '*' // 'http://localhost:63342, http://localhost:8001'
        }
    },
    amqp: {
        conn: 'amqp://guest:guest@localhost:5672',
        q: 'reddit-posts-notifications',
        tag: 'notifier'
    }
};