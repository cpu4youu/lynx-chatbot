const mysql = require('mysql');
const config = require('config');

// ------------------------------ DB FUNCTIONS ------------------------------

/**
* Sets up a connection to the database
* @return {Object} The con object
*/
function setupConnection() {
  const con = mysql.createConnection({
    host: config.get('dbConfig').host,
    user: config.get('dbConfig').user,
    password: config.get('dbConfig').password,
    database: config.get('dbConfig').dbName,
    timeout: 5000,
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
    
    // Set a timeout for the connection attempt
    const timeout = setTimeout(() => {
      con.destroy(); // Destroy the connection if it takes too long
      resolve({resVal: -1, resMessage: 'An Error has occurred while trying to connect to the database'});
    }, 5000); // Timeout duration in milliseconds

    con.connect((err) => {
      clearTimeout(timeout); // Clear the timeout if the connection is successful
      if (err) {
        // console.log('Error connecting to database:', err);
        resolve({resVal: -1, resMessage: 'An Error has occurred while trying to connect to the database'});
      } else {
        resolve({resVal: 0, resMessage: 'Connected to Database'});
      }
    });
    con.on('error', function(err) {
      resolve({resVal: -1, resMessage: err});
    })
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
    // const showTablesQuery = 'SHOW TABLES';
    const showTablesQuery = { query: 'SHOW TABLES;', timeout: 100 }

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
    `CREATE TABLE questions (discordId VARCHAR(255), channel VARCHAR(255), 
    category VARCHAR(255), question VARCHAR(255), dateTime DATETIME)`;
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
* @return {String} the string message of success or error
*/
async function addQuestion(discordId, channel, category, question, dateTime, con) {
  return new Promise((resolve, reject) => {
    
    // Set a timeout for the connection attempt
    const timeout = setTimeout(() => {
      con.destroy(); // Destroy the connection if it takes too long
      resolve({resVal: -1, resMessage: 'An Error has occurred while trying to connect to the database'});
    }, 5000); // Timeout duration in milliseconds

    const sql =
    'INSERT INTO questions (discordId, channel, category, question, dateTime) VALUES (?, ?, ?, ?, ?)';
    con.query(
        sql,
        [discordId, channel, category, question, dateTime],
        function(err, result) {
          clearTimeout(timeout); // Clear the timeout if the connection is successful
          if (err) {
            console.error('Error adding user entry:', err);
            resolve({resVal: -1, resMessage: 'An Error has occurred adding this question to the questions table'});
          } else {
            console.log('Entry added:');
            resolve({resVal: 0, resMessage: 'Entry added'});
          }
        },
    );
  });
};

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
  console.log("before promise in getlast30")
  return new Promise((resolve, reject) => {
    // Set a timeout for the connection attempt
    const timeout = setTimeout(() => {
      con.destroy(); // Destroy the connection if it takes too long
      resolve({resVal: -1, resMessage: 'An Error has occurred while trying to connect to the database'});
    }, 5000); // Timeout duration in milliseconds

    const sql =
      'SELECT * FROM questions AS last30DayQuestions WHERE dateTime >= ?';
    const values = [last30DaysThreshold];
    console.log("before query in getlast30")
    con.query(sql, values, function(err, result) {
      clearTimeout(timeout); // Clear the timeout if the connection is successful
      console.log("cleared timeout")
      if (err) {
        // console.log('Error connecting to database:', err);
        resolve({resVal: -1, resMessage: 'An Error has occurred while trying to connect to the database to get last 30 questions'});
      }
      resolve({resVal: 0, resMessage: result});
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
    // Set a timeout for the connection attempt
    const timeout = setTimeout(() => {
      con.destroy(); // Destroy the connection if it takes too long
      resolve({resVal: -1, resMessage: 'An Error has occurred while trying to connect to the database'});
    }, 5000); // Timeout duration in milliseconds

    const sql = 'SELECT COUNT(*) AS totalQuestionsCount FROM questions';

    con.query(sql, function(err, result) {
      clearTimeout(timeout); // Clear the timeout if the connection is successful
      if (err) {
        resolve({resVal: -1, resMessage: 'An Error has occurred getting the total question count from the questions table'});
      }
      resolve({resVal: 0, resMessage: result[0]['totalQuestionsCount']});
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
    `CREATE TABLE users (discordId VARCHAR(255) PRIMARY KEY, waxWallet VARCHAR(255), 
    isVerified BOOLEAN, hashVal VARCHAR(255), totalQueries INT, hasBalance BOOLEAN)`;
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
    // Set a timeout for the connection attempt
    const timeout = setTimeout(() => {
      con.destroy(); // Destroy the connection if it takes too long
      resolve({resVal: -1, resMessage: 'An Error has occurred while trying to connect to the database'});
    }, 5000); // Timeout duration in milliseconds

    const sql = 'SELECT * FROM users WHERE discordId = ? LIMIT 1';
    const values = [discordId];

    con.query(sql, values, function(err, result) {
      clearTimeout(timeout); // Clear the timeout if the connection is successful
      if (err) {
        resolve({resVal: -1, resMessage: 'An Error has occurred getting the user from the users table'});
      }
      resolve({resVal: 0, resMessage: result});
    });
  });
}

/**
* Adds a user to Users table
* @param {String} user - the user's discord ID
* @param {Function} con - the set up connection configuration function
*/
async function addUser(user, con) {
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
  return new Promise((resolve, reject) => {
    // Set a timeout for the connection attempt
    const timeout = setTimeout(() => {
      con.destroy(); // Destroy the connection if it takes too long
      resolve({resVal: -1, resMessage: 'An Error has occurred while trying to connect to the database'});
    }, 5000); // Timeout duration in milliseconds

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
      clearTimeout(timeout); // Clear the timeout if the connection is successful
      if (err) {
        resolve({resVal: -1, resMessage: 'An Error has occurred while adding a user to the the users table'});
      }
      resolve({resVal: 0, resMessage: 'User entry added to users table:'});
    });
  });
}

/**
* Increments the totalQueries attribute for a user
* @param {String} discordId - the user's discord ID
* @param {Function} con - the set up connection configuration function
*/
async function incrementTotalQueries(discordId, con) {
  return new Promise((resolve, reject) => {
    // Set a timeout for the connection attempt
    const timeout = setTimeout(() => {
      con.destroy(); // Destroy the connection if it takes too long
      resolve({resVal: -1, resMessage: 'An Error has occurred while trying to connect to the database'});
    }, 5000); // Timeout duration in milliseconds

    const sql =
    'UPDATE users SET totalQueries = totalQueries + 1 WHERE discordId = ?';
    const values = [discordId];

    con.query(sql, values, function(err, result) {
      clearTimeout(timeout); // Clear the timeout if the connection is successful
      if (err) {
        resolve({resVal: -1, resMessage: 'An Error has occurred incrementing total queries in the users table'});
      }
      // The result variable contains information about the updated row
      resolve({resVal: 0, resMessage: `${discordId} totalQueries + 1`});
      console.log();
    });
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
