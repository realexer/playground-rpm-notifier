const http = require('http');

const SSEConfig =
{
    port: null,
    headers: {}
};

/**
 * Allowed frames elements according to the HTMLstandard:
 * https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
 * @type {{id: null, event: null, data: null, retry: null}}
 */
const SSEFrame =
{
    id: null,
    event: null,
    data: null,
    retry: null
};

class SSEServer
{
    constructor(config)
    {
        this.config = Object.assign({}, SSEConfig, config);
    }

    start(handler)
    {
        http.createServer((request, response) =>
        {
            console.log('Connected...');

            response.writeHead(200, Object.assign({
                'Connection': 'keep-alive',
                'Content-type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
            }, this.config.headers));

            handler(request, response);


            request.on('close', () => {
                response.end();
            });

        }).listen(this.config.port);

        console.log('Server started...');
    }

    sendFrame(response, frame)
    {
        try {
            let payload = Object.keys(frame).map(key => {
                return `${key}: ${frame[key]}`;
            });

            response.write(payload.join('\n'));
            response.write('\n\n');

            console.log('Stream sent...');

        } catch (e) {

            console.log('Failed to send stream: ');
            console.log(e);
        }
    }
}

module.exports = SSEServer;