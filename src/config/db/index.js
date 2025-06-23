// const mongoose = require('mongoose');

// async function connect() {
//     try {
//         await mongoose.connect('mongodb://mongo:27017/blog_dev', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('✅ Connect successfully!');
//     } catch (error) {
//         console.log('❌ Connect Failure!');
//     }
// }

// module.exports = { connect };

const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Connect Failure!", err.message);
  }
}

module.exports = { connect };
