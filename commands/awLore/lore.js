const fetch = require('node-fetch');
const config = require('config');


/**
 * Fetches the answer response to the user's lore-related question
 * @param {String} question - The string quesiton to ask the Lore LLM.
 * @return {String} The string response to the user question.
 */
async function _getLore(question) {
  const url = config.get('LORE_API_URL');
  const data = {
    modelInput: 'CosmosChronicler',
    userInput: `${question}`,
    beCreative: '1',
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Your-User-Agent', // Adding User-Agent is necessary
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res.response;
  } catch (error) {
    console.error('FetchError:', error.message);
    return error.message;
  }
}

module.exports = {
  // Command Information
  name: 'lore',
  description: 'get information from the AW LLM in human readable form',
  usage: 'lore @message',
  enabled: true,
  aliases: ['l'],
  category: 'langchain',
  memberPermissions: [],
  botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  /**
 * Fetches the answer response to the user's lore-related question
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
            ` Please ask me something about the AW Lore data!`;
          return message.channel.send(content);
        } else {
          try {
            const startTime = Date.now();
            const question = args.join(' ');
            console.log('Opening spawn');
            console.log(question);
            const answer = await _getLore(question);
            const msElapsed = Date.now() - startTime;
            await mutex.runExclusive(async () => {
              // Queue 2D-Array order: [[apis], [lore], [docs]]
              que[1][0].isActive = 3;
            });
            return message.reply(
                answer +
                '\n AI query took ' +
                msElapsed / 1000 +
                ' seconds to complete.',
            );
          } catch (error) {
            console.error(error);
            return message.channel.send(
                'An error occurred while fetching data.',
            );
          }
        }
      }
    })();
  },
};
