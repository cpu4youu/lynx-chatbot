const cronJob = require('cron').CronJob;

/**
* Manages the message queue to execute commands when the corresponding LLM is available
* @return {Object} The cronJob object
*/
async function createLLLMCronjob(llmQueue, mutex) {
  return new cronJob(
      '*/5 * * * * *',
      async function() {
        console.log('cronjob attempt');
        for (let i = 0; i < llmQueue.length; i++) {
          if (llmQueue[i].length > 0 && llmQueue[i][0].isActive == 0) {
          // mutex lock
            await mutex.runExclusive(async () => {
              llmQueue[i][0].isActive = 1;
            });
            // mutex unlock
            console.log('attempting to execute command');
            await llmQueue[i][0].executeCommand();
          // mutex lock
          } else if (llmQueue[i].length > 0 && llmQueue[i][0].isActive == 3) {
          // the spawn thread has returned and we can process answer
            await mutex.runExclusive(async () => {
              llmQueue[i].shift();
            });
            // mutex unlock
            console.log('cronjob done');
          }
        }
      },
      null,
      true,
      'America/Los_Angeles',
  );
}

exports.createLLLMCronjob = createLLLMCronjob;
