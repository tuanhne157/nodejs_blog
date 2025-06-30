require('dotenv').config(); // 👈 Giúp đọc file .env

const path = require('path');
const express = require('express');
const morgan = require('morgan'); // thong bao log
const methodOverride = require('method-override')
const { engine } = require('express-handlebars');


require('./cron/dailyReport'); // ✅ Đúng
  // ✅ chỉ cần require để kích hoạt cron job

const SortMiddleware = require('./app/middlewares/SortMiddleware');

const app = express();
const port = 3000;

const route = require('./routes');

const db = require('./config/db');

const initConsumer = require('./rabbitmq/consumer'); 
require('./cron/jobScheduler'); 

// Connect to DB
db.connect().then(() => {
  console.log("✅ MongoDB connected");

  initConsumer(); // 👈 KHỞI ĐỘNG consumer
});

// static file public , như img/logo.png
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded()); // dữ liệu từ form submit lên
app.use(express.json()); // từ client lên sever khi sử dụng các thư viện js

app.use(methodOverride('_method'))

// Custom middlewares
app.use(SortMiddleware);

// HTTP logger
// app.use(morgan('combined'))

//Template engine __ Cấu hình template engine sử dụng đuôi .hbs
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: require('./helpers/handlebars')
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init -- file routes
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
