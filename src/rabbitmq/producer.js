const amqp = require('amqplib');

async function sendToQueue(queue, data) {
  try {
    const conn = await amqp.connect('amqp://rabbitmq');
    const channel = await conn.createChannel();

    await channel.assertQueue(queue, {
      durable: true,
      arguments: { 'x-message-ttl': 60000 }
    });

    const buffer = Buffer.from(JSON.stringify(data));
    channel.sendToQueue(queue, buffer, { persistent: true });

    console.log("📤 Sent to queue:", data);

    await channel.close();
    await conn.close();
  } catch (err) {
    console.error("❌ Failed to send message:", err.message);
  }
}

module.exports = sendToQueue;
