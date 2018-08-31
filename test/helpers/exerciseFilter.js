const chai = require('chai'),
  expect = chai.expect,
  exerciseFilter = require('../../helpers/exerciseFilter');

describe('Helper: exercise filter', function () {
  function createTestData(dates) {
    return dates.map(el => {
      return { date: new Date(el) };
    });
  }
  const dates = ['2018-07-03', '2018-07-10', '2018-07-04', '2018-07-12'];
  const data = createTestData(dates);

  it('should return null if data is not array', function (done) {
    let limit;
    let from;
    let to;
    expect(exerciseFilter(null, from, to, limit)).equal(null);
    done();
  });

  it('should return array', function (done) {
    let from;
    let to;
    let limit;
    expect(exerciseFilter(data, from, to, limit)).to.be.an('array');
    done();
  });

  it('should return same array if from, to, limit: undefined', function (done) {
    let from;
    let to;
    let limit;
    expect(exerciseFilter(data, from, to, limit)).eql(data);
    done();
  });

  it('should return same array when limit > array length, from,to: undfined', function (done) {
    let from;
    let to;
    let limit = 999;
    expect(exerciseFilter(data, from, to, limit)).eql(data);
    done();
  });

  it('should return shortened array, if limit < array length', function (done) {
    const dates = ['2018-07-03', '2018-07-10'];
    const res = createTestData(dates);
    let from;
    let to;
    let limit = 2;
    expect(exerciseFilter(data, from, to, limit)).eql(res);
    done();
  });

  it('should return same array when limit can not be parsed as Int, from,to: undfined', function (done) {
    let from;
    let to;
    let limit = 'a42';
    expect(exerciseFilter(data, from, to, limit)).eql(data);
    done();
  });

  it('should filter with interval [from, ...]', function (done) {
    const dates = ['2018-07-10', '2018-07-04', '2018-07-12'];
    const res = createTestData(dates);
    let from = '2018-07-04';
    let to;
    let limit;
    expect(exerciseFilter(data, from, to, limit)).eql(res);
    done();
  });

  it('should filter with interval [... ,to]', function (done) {
    const dates = ['2018-07-03', '2018-07-10', '2018-07-04'];
    const res = createTestData(dates);
    let from;
    let to = '2018-07-11';
    let limit;
    expect(exerciseFilter(data, from, to, limit)).eql(res);
    done();
  });

  it('should filter with interval [from, to]', function (done) {
    const dates = ['2018-07-10', '2018-07-04'];
    const res = createTestData(dates);
    let from = '2018-07-04';
    let to = '2018-07-10';
    let limit;
    expect(exerciseFilter(data, from, to, limit)).eql(res);
    done();
  });

  it('should return empty array if to < from', function (done) {
    let from = '2018-07-10';
    let to = '2018-07-04';
    let limit;
    expect(exerciseFilter(data, from, to, limit)).eql([]);
    done();
  });

});