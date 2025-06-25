// src/rabbitmq/consumer.js
const amqp = require('amqplib');
const generateDailyReport = require('../cron/dailyReport');

async function initConsumer(retries = 5, delay = 3000) {
  let attempt = 0;

  while (attempt < retries) {
    try {
      const conn = await amqp.connect('amqp://rabbitmq');
      const channel = await conn.createChannel();
      const queue = 'tasks';

      await channel.assertQueue(queue, { durable: true });

      console.log('👂 Listening to queue:', queue);

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const job = JSON.parse(msg.content.toString());
          console.log('📥 Received job:', job);

          try {
            if (job.type === 'generate_report') {
              await generateDailyReport(job);
            }
            channel.ack(msg);
          } catch (err) {
            console.error('❌ Error handling job:', err.message);
          }
        }
      });

      return; // thành công, kết thúc retry
    } catch (error) {
      attempt++;
      console.error(`❌ Failed to start consumer (attempt ${attempt}):`, error.message);
      if (attempt < retries) {
        console.log(`🔁 Retrying in ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }

  console.error('❌ Max retries reached. Could not connect to RabbitMQ.');
}

module.exports = initConsumer;
