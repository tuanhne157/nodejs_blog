// jobScheduler.js
const cron = require('node-cron');
const sendToQueue = require('../rabbitmq/producer');

cron.schedule('* * * * *', async () => {
  const job = {
    type: 'generate_report',
    timestamp: new Date().toISOString(),
    source: 'cron'
  };

  try {
    await sendToQueue('tasks', job);
    console.log('✅ Cron: Sent job to RabbitMQ:', job);
  } catch (error) {
    console.error('❌ Cron failed:', error.message);
  }
});
