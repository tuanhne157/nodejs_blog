const amqp = require('amqplib');

async function receiveMsg() {
    try {
        const conn = await amqp.connect('amqp://localhost:5672');
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

                // Giả lập xử lý
                setTimeout(() => {
                    console.log("🛠 Done processing:", content.id);
                    // Nchannel.ack : consumer bị crash trước khi xử lý xong → RabbitMQ gửi lại message cho consumer khác.
                    channel.ack(msg); // Xác nhận đã xử lý 
                }, 2000);
            }
        }, { noAck: false });  // phải có channel.ack nếu không nó sẽ không xác nhận là đã xử lý

    } catch (err) {
        console.error("Error:", err);
    }
}

receiveMsg();
