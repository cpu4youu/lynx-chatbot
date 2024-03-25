const config = require('config');
const {useDocs} = require('../../tools/usedocs');

module.exports = {
  // Command Information
  name: 'docs',
  description:
    'get information from documents in human readable form',
  usage: 'docs @message',
  enabled: true,
  aliases: ['d'],
  category: 'langchain',
  memberPermissions: [],
  botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  /**
  * Fetches the answer response to the user's AW-docs-related question
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
      const docType = config.get('docsInfo').map[message.channel.id]
      if (!docType) {
        // server or channel can't access its own docs
        return message.reply("I'm sorry this channel can't access docs.",);
      }
      // check if channel can use docs
      // then check if this channel, ie: mc can access this channels ( mc's ) own docs
      if (config['channels'].includes(message.channel.id) &&
      config.get('docsInfo').access[message.channel.id].includes(docType)) {
        if (!args[0]) {
          const content =
            `${message.author} ` +
            ` Please ask me something about the technical blueprint!`;
          return message.channel.send(content);
        } else {
          try {
            const startTime = Date.now();
            const question = args.join(' ');
            console.log('Opening spawn');
            console.log(question);

            const fullAnswer = await useDocs(question, docs[docType]);
            if (fullAnswer == null) {
              throw new Error('LLM responded with bad data or failed to load');
            }
            const answer = fullAnswer.answer;
            const msElapsed = Date.now() - startTime;
            console.log(que);
            await mutex.runExclusive(async () => {
              // Queue 2D-Array order: [[apis], [lore], [docs]]
              que[2][0].isActive = 3;
            });
            // implement array of strings with error handling -
            // once have 2000 array of text for each item in array
            // try to send message, if one fails, return error, if they all pass,
            // return that they all pass
            const messageLen = answer.length;
            console.log(messageLen);
            if (messageLen < 2001) {
              return message.reply(
                  answer +
                  '\n\nAi query took ' +
                  msElapsed / 1000 +
                  ' seconds to complete.',
              );
            } else {
              const numMessages = Number(Math.ceil(messageLen / 2000));
              console.log('number of messages: ', numMessages);
              for (let i = 0; i < numMessages; i++) {
                if (i == numMessages - 1) {
                  console.log(i, numMessages);
                  const curMessage = answer.slice(1500 * i);
                  message.reply(
                      'Question: ' +
                      question +
                      '\n' +
                      'Part: ' +
                      `${i + 1}` +
                      '\n' +
                      curMessage +
                      '\n\nAi query took ' +
                      msElapsed / 1000 +
                      ' seconds to complete.',
                  );

                  return;
                } else {
                  const curMessage = answer.slice(1500 * i, 1500 * i + 1500);
                  message.reply(
                      'Question: ' +
                      question +
                      '\n' +
                      'Part: ' +
                      `${i + 1}` +
                      '\n' +
                      curMessage,
                  );
                }
              }
              console.log('over 2000');
            }
          } catch (error) {
            console.error(error);
            await mutex.runExclusive(async () => {
              // Queue 2D-Array order: [[apis], [lore], [docs]]
              que[2][0].isActive = 3;
            });
            return message.channel.send(
                `An error occurred with the documents LLM: ${error}`,
            );
          }
        }
      }
    })();
  },
};
