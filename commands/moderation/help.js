const {helpText1, helpText2} = require('../../tools/statictexts.js');
const config = require('config');

module.exports = {
  // Command Information
  name: 'help',
  description: 'Get the list of commands Lynx offers',
  usage: 'help\nhelp [command]',
  enabled: true,
  aliases: ['h'],
  category: 'General',
  memberPermissions: [],
  botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,
  /**
  * Replies to the user with the a quick guide on how to ask questions
  * @param {Object} client - The Discord Client object.
  * @param {Object} message - The Discord message object.
  * @param {Array} args - The string quesiton to ask the Lore LLM.
  * @param {Object} data - The configuration object holding config info.
  * @param {Array} que - The queue array tracking completion of queries received by bot.
  * @param {String} mutex - The Mutex dependency object.
  * @param {String} docs - The docs object containing document type and document content for the LLM to interpret.
  * @param {Function} con - The database connection startup function.
  */
  async execute(client, message, args, data, que, mutex, docs, con) {
    if (config.get('channels').includes(message.channel.id)) {
      try {
        message.reply(helpText1());
        return message.reply(helpText2());
      } catch (error) {
        console.error(error);
        return message.channel.send('An error occurred while sending data.');
      }
    }
  },
};
