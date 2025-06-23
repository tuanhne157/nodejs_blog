const amqp = require('amqplib');

(async () => {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  const exchange = 'logs';
  await channel.assertExchange(exchange, 'fanout', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });
  // bind:ràng buộc, là mũi tên ở giữa exchange và queue :  exchange --> queue
  channel.bindQueue(q.queue, exchange, '');

  console.log("📥 Waiting for messages in queue:", q.queue);

  channel.consume(q.queue, (msg) => {
    console.log("✅ Received:", msg.content.toString());
  }, { noAck: true });
})();
