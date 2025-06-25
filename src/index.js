// src/index.js
const initConsumer = require('./rabbitmq/consumer');
initConsumer(); // ✅ gọi hàm đúng

require('dotenv').config(); // Đọc file .env

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');

require('./cron/dailyReport');
require('./cron/jobScheduler');

const SortMiddleware = require('./app/middlewares/SortMiddleware');
const route = require('./routes');
const db = require('./config/db');

const app = express();
const port = 3000;

// Connect to DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(SortMiddleware);

app.engine('hbs', engine({
  extname: '.hbs',
  helpers: require('./helpers/handlebars')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app);

app.listen(port, () => {
  console.log(`✅ App listening on port ${port}`);
});
