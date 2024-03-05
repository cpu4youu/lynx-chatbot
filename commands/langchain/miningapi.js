const config = require('config');

const {useMiningApi} = require('../../tools/useminingapi');

module.exports = {
  // Command Information
  name: 'miningapi',
  description: 'get information from the mining API in human readable form',
  usage: 'miningapi @message',
  enabled: true,
  aliases: ['ma'],
  category: 'langchain',
  memberPermissions: [],
  botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  /**
  * Fetches the answer response to the user's mining API-related question
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
      if (config.get('channels').includes(message.channel.id)) {
        if (!args[0]) {
          const content =
            `${message.author} ` +
            ` Please ask me something about the Dao API data!`;
          return message.channel.send(content);
        } else {
          try {
            const startTime = Date.now();
            const question = args.join(' ');
            const answer = await useMiningApi(question);
            if (answer == null) {
              throw 'API responded with bad data or failed to load';
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
            console.error(error);
            await mutex.runExclusive(async () => {
              que[0][0].isActive = 3;
            });
            return message.reply('An error occurred while fetching data.');
          }
        }
      }
    })();
  },
};
