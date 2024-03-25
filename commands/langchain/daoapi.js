const config = require('config');
const {useDaoApi} = require('../../tools/usedaoapi');

module.exports = {
  // Command Information
  name: 'daoapi',
  description: 'get information from the dao API in human readable form',
  usage: 'daoapi @message',
  enabled: true,
  aliases: ['da'],
  category: 'langchain',
  memberPermissions: [],
  botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  /**
  * Fetches the answer response to the user's dao API-related question
  * @param {Object} client - The Discord Client object.
  * @param {Object} message - The Discord message object.
  * @param {Array} args - The string quesiton to ask the Lore LLM.
  * @param {Object} data - The configuration object holding config info.
  * @param {Array} que - The queue array tracking completion of queries received by bot.
  * @param {String} mutex - The Mutex dependency object.
  * @param {String} docs - The docs object containing document type and document content for the LLM to interpret.
  * @param {Function} con - The database connection startup function.
  */
  execute(client, message, args, data, que, mutex, docs, con) {
    (async () => {
      if (config['channels'].includes(message.channel.id)) {
        if (!args[0]) {
          const content =
            `${message.author} ` +
            ` Please ask me something about the Dao API data!`;
          return message.channel.send(content);
        } else {
          try {
            const startTime = Date.now();
            const question = args.join(' ');
            const answer = await useDaoApi(question);
            if (answer == null) {
              throw new Error('API responded with bad data or failed to load');
            }
            console.log('finished getting answer: ');
            console.log(answer);
            const msElapsed = Date.now() - startTime;
            await mutex.runExclusive(async () => {
              // Queue 2D-Array order: [[apis], [lore], [docs]]
              que[0][0].isActive = 3;
            });
            return message.reply(
                answer +
                '\n AI query took ' +
                msElapsed / 1000 +
                ' seconds to complete.',
            );
          } catch (error) {
            console.log('This is the error', error);
            await mutex.runExclusive(async () => {
              que[0][0].isActive = 3;
            });
            return message.channel.send(
              `An error occurred with the API LLM: ${error}`,
          );
          }
        }
      }
    })();
  },
};
