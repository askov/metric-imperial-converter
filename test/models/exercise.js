const exercise = require('../../models/exercise'),
  chai = require('chai'),
  expect = chai.expect;

describe('Model: Exercise', function () {
  it('should not pass validation when created without duration', function (done) {
    const x = new exercise.model({ description: 'exercise description' });
    x.validate(function (err) {
      expect(err.errors).to.exist;
      done();
    });
  });

  it('should not pass validation when created without description', function (done) {
    const x = new exercise.model({ duration: 15 });
    x.validate(function (err) {
      expect(err.errors).to.exist;
      done();
    });
  });

  it('should pass validation when required fields provided', function (done) {
    const x = new exercise.model({ description: 'exercise description', duration: '15' });
    x.validate(function (err) {
      expect(err).to.not.exist;
      done();
    });
  });
});
