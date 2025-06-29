const Course = require('../models/Course');
const {mongooseToObject, mutipleMongooseToObject} = require('../../util/mongoose')

class MeController {

    // [GET] /me/stored/courses
    storedCourses(req, res, next) {

        // let courseQuery = Course.find({});
        Promise.all([
            Course.find({}).sortable(req), 
            Course
        ])
            .then(([courses, deletedCount]) =>
                res.render('me/stored-courses',{
                    deletedCount,
                    courses: mutipleMongooseToObject(courses),
                }),
            ) 
            .catch(next);
    }

    // [GET] /me/trash/courses
    trashCourses(req, res, next) {
        Course.findDeleted({})
            .then(courses => res.render('me/trash-courses',{
                courses: mutipleMongooseToObject(courses)
            }))
            .catch(next);
    }

}

module.exports = new MeController();
