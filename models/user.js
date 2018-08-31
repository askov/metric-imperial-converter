const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  exerciseFilter = require('../helpers/exerciseFilter'),
  excercise = require('./exercise');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  exercises: [excercise.schema]
});

const User = mongoose.model('User', userSchema);

module.exports.model = User;

module.exports.save = function (name, cb) {
  const user = new User({
    name
  });
  user.save(function (err, data) {
    if (err) return cb(err);
    cb(null, data);
  });
};

module.exports.addExercise = function (obj, cb) {
  User.findByIdAndUpdate(obj.userId, {
    $push: {
      exercises: {
        description: obj.description,
        duration: obj.duration,
        date: obj.date,
      }
    }
  }, { new: true, runValidators: true }).select({ exercises: { $slice: -1 }, _id: 0, name: 0 }).exec(function (err, data) {
    if (err) return cb(err);
    if (!data) return cb(new Error('user not found'));
    cb(null, data);
  });
};

module.exports.log = function (obj, cb) {
  User.findById(obj.userId).exec(function (err, data) {
    if (err) return cb(err);
    cb(null, exerciseFilter(data.exercises, obj.from, obj.to, obj.limit));
  });
};