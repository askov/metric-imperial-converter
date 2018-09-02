module.exports = function MetricImperialConverter() {
  const k = {
    'gal/L': 3.78541,
    'lbs/kg': 0.453592,
    'mi/km': 1.60934
  };

  const units = {
    'gal': { k: k['gal/L'], unit: 'L' },
    'L': { k: 1 / k['gal/L'], unit: 'gal' },
    'lbs': { k: k['lbs/kg'], unit: 'kg' },
    'kg': { k: 1 / k['lbs/kg'], unit: 'lbs' },
    'mi': { k: k['mi/km'], unit: 'km' },
    'km': { k: 1 / k['mi/km'], unit: 'mi' },
  };

  this.convert = function (val, unit) {
    if (!units[unit]) {
      return {
        error: 'invalid unit'
      };
    }
    if (!/^\d+$/.test(val)) {
      return {
        error: 'invalid number'
      };
    }
    return {
      val: val * units[unit].k,
      unit: units[unit].unit
    };
  };
};