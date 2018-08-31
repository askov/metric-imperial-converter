const user = require('../../models/user'),
  chai = require('chai'),
  expect = chai.expect,
  dbsetup = require('../../db');

describe('Model: User', function () {
  it('should not pass validation when created with incorrect object', function (done) {
    const x = new user.model(null);
    x.validate(function (err) {
      expect(err.errors).to.exist;
      done();
    });
  });
  it('should pass validation when created with correct object', function (done) {
    const x = new user.model({
      name: 'Sam'
    });
    x.validate(function (err) {
      expect(err).to.not.exist;
      done();
    });
  });

  describe('Actions', function () {
    let samUserId;

    before(function (done) {
      dbsetup.connect(done);
    });

    it('should save new user Sam', function (done) {
      const name = 'Sam';
      const cb = (err, data) => {
        samUserId = data['_id'];
        expect(err).to.be.null;
        expect(data.name).equal('Sam');
        expect(data['_id']).to.exist;
        done();
      };
      user.save(name, cb);
    });

    it('should save new user Ammy', function (done) {
      const name = 'Ammy ';
      const cb = (err, data) => {
        expect(err).to.be.null;
        expect(data.name).equal('Ammy');
        expect(data['_id']).to.exist;
        done();
      };
      user.save(name, cb);
    });

    it('should not save user with already existing username', function (done) {
      const name = 'Sam';
      const cb = (err, data) => {
        expect(err).to.not.be.null;
        expect(err.name).equal('MongoError');
        done();
      };
      user.save(name, cb);
    });

    it('should return empty array of exercises', function (done) {
      const query = {
        userId: samUserId
      };
      const cb = (err, data) => {
        expect(err).to.be.null;
        expect(data).to.be.an('array');
        expect(data.length).equal(0);
        done();
      };
      user.log(query, cb);
    });

    it('should add new exercise', function (done) {
      const date = new Date();
      const obj = {
        userId: samUserId,
        description: 'new exercise',
        duration: 15,
        date: date,
      };
      const cb = (err, data) => {
        expect(err).to.be.null;
        expect(data).to.be.an('object');
        expect(data.exercises).to.be.an('array');
        expect(data.exercises[0].description).equal('new exercise');
        expect(data.exercises[0].duration).equal(15);
        expect(data.exercises[0].date.toDateString()).equal(date.toDateString());
        done();
      };
      user.addExercise(obj, cb);
    });

    it('should return user exercise log with one item', function (done) {
      const query = {
        userId: samUserId,
        limit: null,
        from: null,
        to: null
      };
      const cb = (err, data) => {
        expect(err).to.be.null;
        expect(data).to.be.an('array');
        expect(data.length).equal(1);
        done();
      };
      user.log(query, cb);
    });

    after(function (done) {
      dbsetup.disconnect(done);
    });
  });

});
