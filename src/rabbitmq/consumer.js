const amqp = require('amqplib');

async function initConsumer() {
  try {
    const conn = await amqp.connect('amqp://rabbitmq'); // ✅ đúng tên service Docker
    const channel = await conn.createChannel();
    const queue = 'tasks';

    await channel.assertQueue(queue, {
      durable: true,
      arguments: { 'x-message-ttl': 60000 }
    });

    console.log("👂 Waiting for messages in queue:", queue);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log("✅ Received:", content);

        setTimeout(() => {
          console.log("🛠 Done processing:", content.id);
          channel.ack(msg);
        }, 2000);
      }
    }, { noAck: false });
  } catch (err) {
    console.error("❌ Consumer error:", err.message);
  }
}

module.exports = initConsumer;
