// giải quyết độ tin cậy  ttl,durable,persistent,noAck
const amqp = require('amqplib');

async function sendMsg() {
    try {
        const conn = await amqp.connect('amqp://localhost:5672');
        const channel = await conn.createChannel();
        const queue = 'tasks';

        // durable : Queue không bị mất nếu RabbitMQ restart.
        // Mặc định: durable: false → queue sẽ bị xóa khi broker restart.
        await channel.assertQueue(queue, { 
            durable: true,
            arguments: { 'x-message-ttl': 60000 } // TTL:  Ý nghĩa: Message hết hạn sẽ bị loại bỏ sau 60s(giảm tắc nghẽn queue).
        }); 

        const msg = { text: "Xử lý ảnh", id: Date.now() };
        const msgBuffer = Buffer.from(JSON.stringify(msg));

        // persistent : Message sẽ được lưu vào disk, thay vì chỉ ở RAM.
        // Kết hợp với durable queue để bảo vệ message khi broker crash.
        channel.sendToQueue(queue, msgBuffer, { persistent: true });
        console.log("📤 Sent:", msg);

        await channel.close();
        await conn.close();
    } catch (err) {
        console.error("Error:", err);
    }
}

// gọi lại hàm để chạy, nếu không gọi thì hàm sẽ k chạy
// JavaScript sẽ không tự chạy hàm nếu bạn không gọi nó
sendMsg();
