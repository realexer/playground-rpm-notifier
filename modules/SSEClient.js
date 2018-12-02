const SSEConfig =
    {
        url: '' // http url
    };

const SSEListener = {
    onmessage: function (e) {
        console.log(e.data);
    },
    onopen: function (e) {
        console.log('Connection open.');
    },
    onerror: function (e) {
        console.log('Connection error. %s', e.toString());
    },
    onclose: function() {
        console.log('Connection closed.');
    }
};

class SSEClient
{
    constructor(config)
    {
        this.config = Object.assign({}, SSEConfig, config);
        this.listeners = new Map();
        this.source = null;
    }

    connect()
    {
        this.source = new EventSource(this.config.url);
        this.source = Object.assign(this.source, SSEListener);

        this.listeners.forEach((listener) =>
        {
            this.source.addEventListener(listener.event, (e) =>
            {
                console.log(e.data);
                listener.func(e);
            });
        });
    }

    addEventListener(eventName, listener, id = eventName)
    {
        this.listeners.set(id, {
            event: eventName,
            func: listener
        });
    }

    disconnect()
    {
        this.source.close();
    }
}