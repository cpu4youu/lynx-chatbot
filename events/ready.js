/**
  * Sets the discord bot's presence to listen for commands
  */
module.exports = async (client) => {
  try {
    client.user.setPresence({activity: {name: 'for help', type: 'WATCHING'}, status: 'online'});
    client.logger.ready(`${client.user.tag} is now up and running!`);
  } catch (e) {
    console.log(e);
  }
};
