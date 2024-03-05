const {examplesText} = require('../../tools/statictexts.js');
const config = require('config');

module.exports = {
  // Command Information
  name: 'examples',
  description: 'Get a list of questions the chatbot can easily answer',
  usage: 'examples\nexamples [command]',
  enabled: true,
  aliases: ['e'],
  category: 'langchain',
  memberPermissions: [],
  botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  /**
  * Replies to the user with the example questions they can ask
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
        return message.reply(examplesText());
      } catch (error) {
        console.error(error);
        return message.channel.send('An error occurred while sending data.');
      }
    }
  },
};
