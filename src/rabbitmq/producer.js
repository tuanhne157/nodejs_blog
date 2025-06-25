const amqp = require('amqplib');

async function sendToQueue(queueName, payload, retries = 5) {
    let attempt = 0;

    while (attempt < retries) {
        try {
            const conn = await amqp.connect('amqp://rabbitmq'); // docker-compose dùng tên service
            const channel = await conn.createChannel();
            await channel.assertQueue(queueName, { durable: true });
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
                persistent: true
            });
            await channel.close();
            await conn.close();
            return;
        } catch (err) {
            attempt++;
            console.error(`❌ RabbitMQ connect failed (attempt ${attempt}):`, err.message);
            await new Promise(res => setTimeout(res, 3000));
        }
    }

    throw new Error('⚠️ Max retries reached: RabbitMQ unavailable');
}

module.exports = sendToQueue;
