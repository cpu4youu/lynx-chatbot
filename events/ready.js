const config = require('config');
const {sendError} = require('../tools/errormessage.js');

/**
  * Sets the discord bot's presence to listen for commands
  * @param {Object} client - The Discord Client object.
  */
module.exports = async (client) => {
  try {
    client.user.setPresence({activity: {name: 'for help', type: 'WATCHING'}, status: 'online'});
    client.logger.ready(`${client.user.tag} is now up and running!`);
    if (client.customDBError && client.customDBError["resVal"] == -1){
      await sendError(client, client.customDBError["resMessage"])
    }
  } catch (e) {
    console.log(e);
  }
};
