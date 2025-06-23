const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');
const mongoose = require('mongoose');

const logger = require('../../util/logger');

class CourseController {
    // [GET] /courses/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then(course => {
                res.render('courses/show', { course: mongooseToObject(course) });
            })
            .catch(next);
    }

    // [GET] /courses/create
    create(req, res, next) {
        res.render('courses/create');
    }

    // [POST] /courses/store
    async store(req, res, next) {
        try {
            req.body.image = `https://i.ytimg.com/vi/${req.body.videoId}/maxresdefault.jpg`;

            const totalCount = await Course.countDocumentsWithDeleted();
            if (totalCount === 0) {
                const counterCollection = mongoose.connection.collection('counters');
                await counterCollection.updateOne(
                    { _id: 'Course' },
                    { $set: { seq: 0 } },
                    { upsert: true }
                );
                logger.info('🔄 Reset Course counter to 0');
            }

            const course = new Course(req.body);
            await course.save();

            logger.info(`✅ Created course: ${course.name} (ID: ${course._id})`);
            res.redirect('/me/stored/courses');
        } catch (error) {
            logger.error(`❌ Error storing course: ${error.message}`);
            next(error);
        }
    }


    // [GET] /courses/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then(course => res.render('courses/edit', {
                course: mongooseToObject(course),
            }))
            .catch(next);
    }

    // [PUT] /courses/:id
    update(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                logger.info(`✏️ Updated course: ${req.params.id}`);
                res.redirect('/me/stored/courses');
            })
            .catch(err => {
                logger.error(`❌ Error updating course ${req.params.id}: ${err.message}`);
                next(err);
            });
    }


    // [DELETE] /courses/:id
    delete(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => {
                logger.info(`🗑️ Soft-deleted course: ${req.params.id}`);
                res.redirect('/me/stored/courses');
            })
            .catch(err => {
                logger.error(`❌ Error soft-deleting course ${req.params.id}: ${err.message}`);
                next(err);
            });
    }


    // [DELETE] /courses/:id/force
    forceDelete(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/me/trash/courses'))
            .catch(next);
    }

    // [PATCH] /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }
}

module.exports = new CourseController();
