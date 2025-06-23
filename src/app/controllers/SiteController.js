const Course = require('../models/Course');
const {mutipleMongooseToObject} = require('../../util/mongoose')

class SiteController {

    //Cách 1: dùng async kết hợp try catch
    // async index(req, res) {
    //     try {
    //         const courses = await Course.find({});
    //         res.json(courses);
    //     } catch (err) {
    //         res.status(400).json({ error: 'ERROR!' });
    //     }
    // }

    //Cách 2: dùng promise .then()
    index(req, res, next) {
        Course.find({})
            .then(courses => {
                res.render('home', {
                    courses: mutipleMongooseToObject(courses),
                });
            })
            .catch(next); // ⬅️ đẩy lỗi về middleware xử lý lỗi chung
    }

    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
