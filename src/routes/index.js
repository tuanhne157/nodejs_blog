const meRouter = require('./me');
const siteRouter = require('./site');
// chọc dến file news.js
const newsRouter = require('./news');
const coursesRouter = require('./courses');

function route(app) {
    // Basic routing
    // Bóc tách: (req, res) => {res.render('news');} --> NewsController.js
    // app.get('/news', (req, res) => {
    //     res.render('news');
    // })
    app.use('/me', meRouter);

    app.use('/courses', coursesRouter);
    // route localhost:3000/news
    app.use('/news', newsRouter);
    // site.js
    app.use('/', siteRouter);

    // Route mẫu
    // app.get('/', (req, res) => {
    //     res.render('home');
    // })

    // Tạo router GET health
    // app.get('/health', (req, res) => {
    //   res.send('Server is healthy');
    // });

    // Tạo router GET users
    // app.get('/users', (req, res) => {
    //   const users = [
    //     { id: 1, name: 'Tuan' },
    //     { id: 2, name: 'Anh' }
    //   ];
    //   res.json(users);
    // });

    // Query parameters
    // http://localhost:3000/search?q=blog tanh
    // app.get('/search', (req, res) => {
    // // console.log(req.query.q); // q = query, lấy q ra: req.query.q
    //     res.render('search');
    // })
    // app.post('/search', (req, res) => {
    //   res.send('');
    // })
}

module.exports = route;
