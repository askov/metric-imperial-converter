let chai = require('chai'),
  expect = chai.expect,
  dbsetup = require('../../db');

chai.use(require('chai-http'));
chai.use(require('chai-json-schema'));

describe('Controllers: Integration tests (db required)', () => {
  let server;
  before(function (done) {
    server = require('../../server');
    done();
  });

  it('should return index page /GET', done => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
  });

  let resUserSchema = {
    type: 'object',
    required: ['name', 'userId'],
    properties: {
      name: {
        type: 'string'
      },
      userId: {
        type: 'string'
      }
    }
  };

  let resExerciseSchema = {
    type: 'object',
    required: ['description', 'duration', 'date'],
    properties: {
      description: {
        type: 'string'
      },
      duration: {
        type: 'number'
      },
      date: {
        type: 'string'
      }
    }
  };

  let resExerciseLogSchema = {
    type: 'array',
    items: {
      type: 'object',
      required: ['description', 'duration', 'date', '_id'],
      properties: {
        description: {
          type: 'string'
        },
        duration: {
          type: 'number'
        },
        date: {
          type: 'string'
        },
        _id: {
          type: 'string'
        }
      }
    }
  };

  let testUserId;

  it('should create new user /POST', done => {
    chai.request(server)
      .post('/api/exercise/new-user')
      .type('json')
      .send({
        name: 'Sam'
      })
      .end((err, res) => {
        testUserId = res.body.userId;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.jsonSchema(resUserSchema);
        done();
      });
  });

  it('should add new exercise by user id /POST ', done => {
    const obj = {
      userId: testUserId,
      description: 'exercise description',
      duration: 25,
    };
    chai.request(server)
      .post('/api/exercise/add')
      .type('json')
      .send(obj)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.jsonSchema(resExerciseSchema);
        done();
      });
  });

  it('should log user exercises /GET ', done => {
    chai.request(server)
      .get('/api/exercise/log?userId=' + testUserId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.be.jsonSchema(resExerciseLogSchema);
        done();
      });
  });

  after(function (done) {
    const cb = () => {
      dbsetup.disconnect(done);
    };
    server.close(cb);
  });
});
