const cron = require('node-cron');
const sendToQueue = require('../rabbitmq/producer');

cron.schedule('* * * * *', async () => {
  const job = {
    type: 'generate_report',
    id: Date.now(),
    timestamp: new Date().toISOString()
  };

  await sendToQueue('tasks', job);
});
