
const Discord = require('discord.js');
const Mutex = require('async-mutex').Mutex;

const {setupConnection, connectToDatabase} = require('./tools/database.js');
const {loadDocuments} = require('./tools/documents.js');
const {createLLLMCronjob} = require('./tools/cronjob.js');

const config = require('config');
const fs = require('fs');
const util = require('util');

const con = setupConnection();

/**
 * Initialize the necessary actions to run the Discord bot
 */
async function _startUp() {
  try {
    // create the queue array to manage messages
    const llmQueue = [[], [], []];
    const mutex = new Mutex();
    const readDir = util.promisify(fs.readdir);

    const llmCronjob = await createLLLMCronjob(llmQueue, mutex);

    // connect to database
    const client = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES']});
    client.commands = new Discord.Collection();
    client.cooldowns = new Discord.Collection();
    client.logger = require('./modules/logger.js');

    // connect to database
    await connectToDatabase(con);
    const docs = await loadDocuments();

    // Error Logging
    client
        .on('disconnect', () =>
          client.logger.log('Bot is disconnecting...', 'warn'))
        .on('reconnecting', () =>
          client.logger.log('Bot reconnecting...', 'log'))
        .on('error', (e) => client.logger.log(e, 'error'))
        .on('warn', (info) => client.logger.log(info, 'warn'));

    // Starting all events
    const eventFiles = fs
        .readdirSync('./events/')
        .filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
      const event = require(`./events/${file}`);
      const eventName = file.split('.')[0];
      client.logger.event(`Loading Event - ${eventName}`);
      client.on(eventName, event.bind(null, client, llmQueue, mutex, docs, con));
    }

    // Load all the commands
    const folders = await readDir('./commands/');
    folders.forEach((direct) => {
      const commandFiles = fs
          .readdirSync('./commands/' + direct + '/')
          .filter((file) => file.endsWith('.js'));
      for (const file of commandFiles) {
        const command = require(`./commands/${direct}/${file}`);
        client.commands.set(command.name, command);
      }
    });

    client.login(config.get('token'));
    llmCronjob.start();
  } catch (error) {
    // Ensure that the database connection is closed even if an error occurs
    console.log('disconnected from database');
    con.end();
    console.error(error);
  }
}

_startUp();

// Logging unhandeld errors
process.on('unhandledRejection', (err) => {
  console.error(err);
});

// module.exports = { client };
