const mysql = require('mysql');
const config = require('config');

// ------------------------------ DB FUNCTIONS ------------------------------

/**
* Sets up a connection to the database
*/
function setupConnection() {
  const con = mysql.createConnection({
    host: config.get('dbConfig').host,
    user: config.get('dbConfig').user,
    password: config.get('dbConfig').password,
    database: config.get('dbConfig').dbName,
  });
  return con;
}

/**
* Initiates a connection to the database
* @param {Function} con - the set up connection configuration function
* @return {Promise} resolves if successful or returns an error
*/
async function connectToDatabase(con) {
  return new Promise((resolve, reject) => {
    con.connect((err) => {
      if (err) {
        console.log('Error connecting to database:', err);
        reject(err);
      } else {
        console.log('Connected to database!');
        resolve();
      }
    });
  });
}

/**
* Shows the tables in the database
* @param {Function} con - the set up connection configuration function
*/
function showTables(con) {
  con.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }

    // Query to retrieve a list of all tables in the connected database
    const showTablesQuery = 'SHOW TABLES';

    // Execute the query
    con.query(showTablesQuery, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
      } else {
        // Display the list of tables
        console.log('Tables in the database:');
        results.forEach((table) => {
          console.log(table[`Tables_in_${con.config.database}`]);
        });
      }
    });
  });
}

// ------------------------------ QUESITONS MODEL ------------------------------

/**
* Creates the Questions table
* @param {Function} con - the set up connection configuration function
*/
async function createQuestionsTable(con) {
  const sql =
    'CREATE TABLE questions (discordId VARCHAR(255), channel VARCHAR(255), category VARCHAR(255), question VARCHAR(255), dateTime DATETIME)';
  con.query(sql, function(err, result) {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table created:');
      console.log(result);
      // await disconnectFromDatabase()
    }
  });
}

/**
* Adds a question to the Questions table
* @param {String} discordId - the user's discord ID
* @param {String} channel - the channel ID
* @param {String} category - the category name
* @param {String} question - the user's question
* @param {Date} dateTime - the date the quesiton was asked
* @param {Function} con - the set up connection configuration function
*/
function addQuestion(discordId, channel, category, question, dateTime, con) {
  // Example usage
  // const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " "); // 'YYYY-MM-DD HH:MM:SS'
  // addQuestion('SomeId', SomeCategory', 'SomeQuestion', currentDateTime);
  const sql =
    'INSERT INTO questions (discordId, channel, category, question, dateTime) VALUES (?, ?, ?, ?, ?)';
  con.query(
      sql,
      [discordId, channel, category, question, dateTime],
      function(err, result) {
        if (err) {
          console.error('Error adding user entry:', err);
        } else {
          console.log('Entry added:');
          console.log(result);
        // await disconnectFromDatabase()
        }
      },
  );
}

/**
* Gets the questions for the last 30 days from the Questions table
* @param {Function} con - the set up connection configuration function
* @return {Promise} resolves if successful or returns an error
*/
async function getLast30DayQuestions(con) {
  // Example usage: check getUser7DayStats

  // Current date and time
  const now = new Date();

  // Calculate date and time thresholds for the last 24 hours, 7 days, and 30 days
  const last30DaysThreshold = new Date(now - 30 * 24 * 60 * 60 * 1000);

  return new Promise((resolve, reject) => {
    const sql =
      'SELECT * FROM questions AS last30DayQuestions WHERE dateTime >= \'2024-01-06 02:20:24.798\'';
    const values = [last30DaysThreshold];

    con.query(sql, values, function(err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

/**
* Get the count of the total questions asked from the Questions table
* @param {Function} con - the set up connection configuration function
* @return {Promise} resolves if successful or returns an error
*/
async function getTotalQuestionCount(con) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS totalQuestionsCount FROM questions';

    con.query(sql, function(err, result) {
      if (err) {
        reject(err);
      }
      resolve(result[0]['totalQuestionsCount']);
    });
  });
}

// ------------------------------ USERS MODEL ------------------------------

/**
* Create the Users table
* @param {Function} con - the set up connection configuration function
*/
function createUsersTable(con) {
  const sql =
    'CREATE TABLE users (discordId VARCHAR(255) PRIMARY KEY, waxWallet VARCHAR(255), isVerified BOOLEAN, hashVal VARCHAR(255), totalQueries INT, hasBalance BOOLEAN)';
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log('Table created');
  });
}

/**
* Gets a user from Users table
* @param {String} discordId - the user's discord ID
* @param {Function} con - the set up connection configuration function
* @return {Promise} resolves if successful or returns an error
*/
async function getUser(discordId, con) {
  // Example usage
  // const targetDiscordId = "someDiscordId";
  // const user = await getUser(targetDiscordId);

  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE discordId = ? LIMIT 1';
    const values = [discordId];

    con.query(sql, values, function(err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

/**
* Adds a user to Users table
* @param {String} user - the user's discord ID
* @param {Function} con - the set up connection configuration function
*/
function addUser(user, con) {
  // Example usage
  // const newUser = {
  //   discordId: "someDiscordId",
  //   waxWallet: "someWaxWallet",
  //   isVerified: true,
  //   hashVal: "someHashValue",
  //   totalQueries: 10,
  //   hasBalance: false,
  // };
  // addUser(newUser);
  const {
    discordId,
    waxWallet,
    isVerified,
    hashVal,
    totalQueries,
    hasBalance,
  } = user;
  const sql =
    'INSERT INTO users (discordId, waxWallet, isVerified, hashVal, totalQueries, hasBalance) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [
    discordId,
    waxWallet,
    isVerified,
    hashVal,
    totalQueries,
    hasBalance,
  ];

  con.query(sql, values, function(err, result) {
    if (err) {
      throw err;
    }
    console.log('User entry added to users table:');
    console.log(result);
  });
}

/**
* Increments the totalQueries attribute for a user
* @param {String} discordId - the user's discord ID
* @param {Function} con - the set up connection configuration function
*/
function incrementTotalQueries(discordId, con) {
  const sql =
    'UPDATE users SET totalQueries = totalQueries + 1 WHERE discordId = ?';
  const values = [discordId];

  con.query(sql, values, function(err, result) {
    if (err) {
      throw err;
    }
    // The result variable contains information about the updated row
    console.log(discordId, ' totalQueries + 1');
  });
}

module.exports = {
  createQuestionsTable,
  addQuestion,
  getLast30DayQuestions,
  getTotalQuestionCount,
  createUsersTable,
  getUser,
  addUser,
  incrementTotalQueries,
  connectToDatabase,
  showTables,
  setupConnection,
};
