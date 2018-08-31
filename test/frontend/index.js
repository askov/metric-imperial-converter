const { expect } = require('chai'),
  puppeteer = require('puppeteer'),
  config = require('../../config'),
  dbsetup = require('../../db'),
  server = require('../../server');

describe('Index page puppeteer tests', function () {
  let browser;
  let page;

  before(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    dbsetup.drop(() => { });
  });

  beforeEach(async function () {
    page = await browser.newPage()
    await page.goto(`http://localhost:${config.port}`);
  });

  afterEach(async function () {
    await page.close();
  });

  after(async function () {
    await browser.close();
    const cb = () => {
      dbsetup.disconnect();
    };
    await server.close(cb);
  });

  it('should show error on wrong name submit', async function () {
    await page.type('input[name="name"]', '1', { delay: 100 });
    await page.click("#js-new-user-form > button");
    const err = await page.evaluate(() => document.querySelector('#js-new-user-form .error-container').innerHTML);
    expect(err).equal('* User name must contain only alphanumeric characters, underscore and start with letter');
    expect(page.url()).to.equal(`http://localhost:${config.port}/`);
  });

  let testUserId;

  it('should redirect on correct name submit', async function () {
    await page.type('input[name="name"]', 'sam', { delay: 100 });
    await Promise.all([
      page.click("#js-new-user-form > button"),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    const pre = await page.$('pre');
    const res = await (await pre.getProperty('innerHTML')).jsonValue();

    testUserId = JSON.parse(res).userId;
    expect(testUserId).to.exist;

    await page.screenshot({
      path: 'test/frontend/screenshots/user.png',
      clip: { x: 0, y: 0, width: 1024, height: 100 }
    });

    expect(page.url()).to.equal(`http://localhost:${config.port}/api/exercise/new-user`);
  });

  it('should redirect on correct exercise submit', async function () {

    await page.type('input[name="userId"]', testUserId, { delay: 100 });
    await page.type('input[name="description"]', 'good exercise', { delay: 100 });
    await page.type('input[name="duration"]', '15', { delay: 100 });

    await Promise.all([
      page.click("#js-new-exercise-form > button"),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);
    await page.screenshot({
      path: 'test/frontend/screenshots/exercise.png',
      clip: { x: 0, y: 0, width: 1024, height: 100 }
    });
    expect(page.url()).to.equal(`http://localhost:${config.port}/api/exercise/add`);

  });
});