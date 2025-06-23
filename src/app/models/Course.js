const mongoose = require('mongoose');
const slugify = require('slugify');
var mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  _id: { type: Number, },
  name: { type: String, default: 'hahaha', required: true },
  description: { type: String, maxLength: 600 },
  videoId: { type: String, required: true },
  deTail: { type: String },
  image: { type: String, default: 'hahaha' },
  slug: { type: String, slug: 'name', unique: true },
}, {
  timestamps: true 
});

// Custom query helpers
CourseSchema.query.sortable = function(req) {
  if ('_sort' in req.query) {
            const isValidtype = ['asc','desc'].includes(req.query.type);
            return this.sort({
                [req.query.column]: isValidtype ? req.query.type : 'desc',
           });
  }
  return this;
}

CourseSchema.plugin(AutoIncrement);
// Add plugins
CourseSchema.plugin(mongooseDelete, { 
  deletedAt: true,
  overrideMethods: 'all',
});

// Tạo slug thủ công trước khi lưu
CourseSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
