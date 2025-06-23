// ví dụ sử dụng fanout
const amqp = require('amqplib');

(async () => {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  const exchange = 'logs';
  // sử dụng exchange fanout để gửi nhiều queue
  await channel.assertExchange(exchange, 'fanout', { durable: false });

  const msg = '🔥 Hello subscribers!';
  channel.publish(exchange, '', Buffer.from(msg));
  console.log("📤 Sent:", msg);

  await channel.close();
  await conn.close();
})();
