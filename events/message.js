const config = require('config');
const {
  addQuestion,
  getUser,
  addUser,
  incrementTotalQueries,
} = require('../tools/database');

// create a class to hold pertinent info about message
class Message {
  constructor(client, message, args, data, func) {
    this.isActive = 0;
    this.client = client;
    this.message = message;
    this.args = args;
    this.data = data;
    this.executeCommand = async function() {
      if (typeof func === 'function') {
        console.log('func is a function');
        await func.call(this); // Call the function with the current instance as 'this'
      } else {
        console.error('func is not a function');
      }
    };
  }
}

/**
  * Evaluate a message event to determine if it meets the criteria of a question to be answered
  * @param {Object} client - The Discord Client object.
  * @param {Array} queue - The queue array tracking completion of queries received by bot.
  * @param {Object} mutex - The Mutex dependency object.
  * @param {String} docs - The docs object containing document type and document content for the LLM to interpret.
  * @param {Function} con - The database connection startup function.
  * @param {Object} message - The Discord message object.
  */
module.exports = async (client, queue, mutex, docs, con, message) => {
  try {
    // If author is a bot then return
    if (message.author.bot) return;

    // If the message isn't in a guild return following message
    if (!message.guild) {
      return message.channel.send(
          'Please use my commands in your guild as they do not work\
           in direct messages. Using `$$help` in your server to get started.',
      );
    }

    // Get prefix from guild
    const prefix = config.get('prefixes')[message.guild.id];

    /**
    If someon @'s the discord bot, this responds telling them to use the prefix.
    In the future, we will instruct users to use slash commands
    */
    if (!message.content.toLowerCase().startsWith(prefix)) {
      if (
        message.content === `<@!${message.client.user.id}>` ||
        message.content === `<@${message.client.user.id}>`
      ) {
        return message.reply(
            'Uh-Oh! You forgot the prefix? It\'s `' + prefix + '`',
        );
      }
      return;
    }

    // Checking if the message is a command
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const cmd =
      client.commands.get(commandName) ||
      client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
      );

    // If it isn't a command then return
    if (!cmd) return;

    const llmCommands = new Set(['daoapi', 'awdocs', 'miningapi', 'lore']);
    // Verify channel origin to match corresponding data that channel is authorized to retrieve

    // is channel authorized to make command to llm
    if (
      !config.get('channels').includes(message.channel.id)
    ) {
      //   if not, return
      console.log('not authorized channel');
      return;
    }
    // Get the user database
    const data = {};
    data.config = config;
    data.cmd = cmd;
    // check if it does not require llm:
    if (llmCommands.has(cmd.name) == false) {
      //  forward it on (call helper function)
      console.log('not llm command');
      executeCommand();
    } else {
      console.log('llm command');
      const discordId = message.author.username;
      const user = await getUser(discordId, con);
      // If user new, add to users table
      if (user.length == 0) {
        const newUser = {
          discordId: discordId,
          waxWallet: '',
          isVerified: false,
          hashVal: '',
          totalQueries: 0,
          hasBalance: false,
        };
        addUser(newUser, con);
      }

      // add new question to questions table
      const question = args.join(' ');
      const currentDateTime = new Date()
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS'
      addQuestion(
          discordId,
          message.channel.id,
          cmd.name,
          question,
          currentDateTime,
          con,
      );

      // increase user question by 1
      incrementTotalQueries(discordId, con);

      console.log('llm command: ', cmd.name);
      // create a new object that holds pertinent data
      const newMessage = new Message(
          client,
          message,
          args,
          data,
          executeCommand,
      );
      console.log('about to enter mutex');
      // mutex lock
      await mutex.runExclusive(async () => {
        console.log('entered mutex');
        // in order: apis, lore, docs
        if ((cmd.name == 'daoapi') | (cmd.name == 'miningapi')) {
          newMessage.queueNum = 0;
          queue[0].push(newMessage);
        } else if (cmd.name == 'lore') {
          newMessage.queueNum = 1;
          queue[1].push(newMessage);
        } else {
          newMessage.queueNum = 2;
          queue[2].push(newMessage);
        }
      });
      console.log('left mutex');
      // mutex unlock
    }

    /**
    * Executes the appropriate command that the user called to answer the user question
    * @return {Number | Error} Returns a promise with evaluation code for Success or Error
    */
    async function executeCommand() {
      // If channel isn't nsfw and command is return error
      if (!message.channel.nsfw && cmd.nsfw) {
        return; // Error message
      }

      // If command is owner only and author isn't owner return
      // if(cmd.ownerOnly && message.author.id !== config.ownerID){
      //   return;
      // }

      if (message.guild) {
        const userPerms = [];

        // Checking for members permission
        cmd.memberPermissions.forEach((perm) => {
          if (!message.channel.permissionsFor(message.member).has(perm)) {
            userPerms.push(perm);
          }
        });

        // If user permissions arraylist length is more than one return error
        if (
          userPerms.length > 0 &&
          !message.member.roles.cache.find(
              (r) => r.name.toLowerCase() === config.adminRole.toLowerCase(),
          )
        ) {
          client.logger.cmd(
              `${message.author.tag} used ${cmd.name} - Missing permissions`,
          );
          return message.channel.send(
              'Looks like you\'re missing the following permissions:\n' +
              userPerms.map((p) => `\`${p}\``).join(', '),
          );
        }

        const clientPerms = [];

        // Checking for client permissions
        cmd.botPermissions.forEach((perm) => {
          if (!message.channel.permissionsFor(message.guild.me).has(perm)) {
            clientPerms.push(perm);
          }
        });

        // If client permissions arraylist length is more than one return error
        if (clientPerms.length > 0) {
          client.logger.cmd(
              `${message.author.tag} used ${cmd.name} - Missing permissions`,
          );
          return message.channel.send(
              'Looks like I\'m missing the following permissions:\n' +
              clientPerms.map((p) => `\`${p}\``).join(', '),
          );
        }
      }

      // Execute the command and log the user in console
      return new Promise(function(resolve, reject) {
        (async () => {
          try {
            console.log('exucting execCMD Promise');
            const results = await cmd.execute(
                client,
                message,
                args,
                data,
                queue,
                mutex,
                docs,
                con,
            );
            console.log('finished exucting execCMD Promise');
            return resolve(results);
          } catch (err) {
            return reject(err);
          }
        })();
      });
    }
  } catch (err) {
    console.error(err);
  }
};
