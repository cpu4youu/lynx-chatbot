const config = require('config');

async function sendError(client, message) {
    for (const id_index in config.get("ADMIN_CHANNELS")){
        await client.channels.fetch(config.get("ADMIN_CHANNELS")[id_index]);
        const channel = client.channels.cache.get(config.get("ADMIN_CHANNELS")[id_index]);
        channel.send(message) 
    }
}

exports.sendError = sendError;