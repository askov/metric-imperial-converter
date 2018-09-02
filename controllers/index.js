const express = require('express'),
  router = express.Router(),
  MetricImperialConverter = require('../helpers/MetricImperialConverter'),
  SymbolToUnitConverter = require('../helpers/SymbolToUnitConverter'),
  mic = new MetricImperialConverter(),
  stuc = new SymbolToUnitConverter();
// console.log('#some', SymbolToUnitConverter);
/**
 * GET: Index page.
 */
router.get('/', (req, res) => {
  res.render('index', {});
});
router.get('/api/convert', (req, res) => {
  console.log('#req', req.query);

  const initNum = 3.1,
    initUnit = 'mi',
    initUnitFull = stuc.convert(initUnit, initNum),
    returnNum = 5,
    returnUnit = 'km',
    returnUnitFull = stuc.convert(returnUnit, returnNum);


  res.json({
    initNum,
    initUnit,
    returnNum,
    returnUnit,
    string: `${initNum} ${initUnitFull} converts to ${returnNum} ${returnUnitFull}`
  });
});


module.exports = router;
