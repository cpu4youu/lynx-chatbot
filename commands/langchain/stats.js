const {
  getUser,
  getLast30DayQuestions,
  getTotalQuestionCount,
} = require('../../tools/database');
const config = require('config');

module.exports = {
  // Command Information
  name: 'stats',
  description: 'Get statistics on the questions and users that use the service',
  usage: 'stats\nstats [command]',
  enabled: true,
  aliases: ['s'],
  category: 'langchain',
  memberPermissions: [],
  botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  /**
  * Replies to the user with the statistics on questions they and the community have asked
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

    // customDBError if error state, reply to user saying DB is down and then return
    if (client.customDBError && client.customDBError["resVal"] == -1){
      return message.channel.send(`There is an error with the database conneciton. Please try again later!`);
    }
    /**
    * Filter questions based on their age.
    *
    * @param {Array<Object>} questions - The array of questions to filter.
    * @param {number} maxAgeInMilliseconds - The maximum age of questions to include in the result, in milliseconds.
    * @return {Array<Object>} - The filtered array of questions.
    */
    function filterQuestionsByAge(questions, maxAgeInMilliseconds) {
      const currentTime = new Date();

      // Filter questions based on the age
      const filteredQuestions = questions.filter((question) => {
        const ageInMilliseconds = currentTime - question.dateTime;
        return ageInMilliseconds < maxAgeInMilliseconds;
      });

      return filteredQuestions;
    }

    /**
    * Filter questions based on their discordID.
    *
    * @param {Array<Object>} questions - The array of questions to filter.
    * @param {number} discordId - The discord ID to include in the result.
    * @return {Array<Object>} - The filtered array of questions.
    */
    function filterQuestionsById(questions, discordId) {
      // Filter questions based on the age
      const filteredQuestions = questions.filter((question) => {
        const curDiscordId = question.discordId;
        return curDiscordId == discordId;
      });

      return filteredQuestions;
    }

    if (config.get('channels').includes(message.channel.id)) {
      try {
        const userRes = await getUser(message.author.username, con);
        if (userRes["resVal"] == -1){
          client.users.cache.get('tapat1o').send(userRes["resMessage"])
        }
        const user = userRes["resMessage"]
        if (user.length == 0) {
          const fetchLastQuestions = await getLast30DayQuestions(con);
          if (fetchLastQuestions['resVal'] == -1) {
            // Add code to message devs after upgrading discord.js package
            throw new Error(fetchLastQuestions["resMessage"]);

          }
          const last30DayQuestions = fetchLastQuestions['resMessage'];
          const last24HrQuestions = filterQuestionsByAge(
              last30DayQuestions,
              24 * 60 * 60 * 1000,
          );
          const last7DayQuestions = filterQuestionsByAge(
              last30DayQuestions,
              7 * 24 * 60 * 60 * 1000,
          );
          const fetchQuesionts = await getTotalQuestionCount(con);
          if (fetchQuesionts['resVal'] == -1) {
            client.users.cache.get('tapat1o').send(fetchQuesionts["resMessage"])
            client.users.cache.get('izay21').send(fetchQuesionts["resMessage"])
          }
          const totalQuestions = fetchQuesionts['resMessage'];
          const answer = `\nUSER STATISTICS:\n\
- Looks like you haven't asked any questions yet!\n\n \
COMMUNITY STATISTICS:\n\
- 24-hour community question cout: ${last24HrQuestions.length}\n\
- 7-day community question cout:${last7DayQuestions.length}\n\
- 30-day community question cout: ${last30DayQuestions.length} \n\n\
TOTAL QUESTION COUNT: ${totalQuestions}\n \
`;
          return message.reply(answer);
        } else {
          const totalUserQuestions = user[0].totalQueries;
          const fetchLastQuestions = await getLast30DayQuestions(con);
          if (fetchLastQuestions['resVal'] == -1) {
            client.users.cache.get('tapat1o').send(fetchLastQuestions["resMessage"])
            client.users.cache.get('izay21').send(fetchLastQuestions["resMessage"])
          }
          const last30DayQuestions = fetchLastQuestions['resMessage'];
          const last24HrQuestions = filterQuestionsByAge(
              last30DayQuestions,
              24 * 60 * 60 * 1000,
          );
          const last7DayQuestions = filterQuestionsByAge(
              last30DayQuestions,
              7 * 24 * 60 * 60 * 1000,
          );
          const fetchQuesionts = await getTotalQuestionCount(con);
          if (fetchQuesionts['resVal'] == -1) {
            client.users.cache.get('tapat1o').send(fetchQuesionts["resMessage"])
            client.users.cache.get('izay21').send(fetchQuesionts["resMessage"])
          }
          const totalQuestions = fetchQuesionts['resMessage'];
          const user24HrQuestions = filterQuestionsById(
              last24HrQuestions,
              message.author.username,
          );
          const user7DayQuestions = filterQuestionsById(
              last7DayQuestions,
              message.author.username,
          );
          const user30DayQuestions = filterQuestionsById(
              last30DayQuestions,
              message.author.username,
          );
          const answer = `\nUSER STATISTICS:\n\
- 24-hour user question count: ${user24HrQuestions.length}\n\
- 7-day user question count: ${user7DayQuestions.length}\n\
- 30-day user question count: ${user30DayQuestions.length}\n\n \
COMMUNITY STATISTICS:\n\
- 24-hour community question count: ${last24HrQuestions.length}\n\
- 7-day community question count:${last7DayQuestions.length}\n\
- 30-day community question count: ${last30DayQuestions.length} \n\n\
TOTAL USER QUESTION COUNT: ${totalUserQuestions}\n \
TOTAL QUESTION COUNT: ${totalQuestions}\n \
`;
          message.reply(answer);
          return;
        }
      } catch (error) {
        console.error(error);
        return message.channel.send(`An error occurred while sending data: ${error}`);
      }
    }
  },
};
