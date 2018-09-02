module.exports = function SymbolToUnitConverter() {

  const symbols = {
    'km': 'kilometer',
    'lbs': 'pound',
    'L': 'litre',
    'gal': 'gallon',
    'kg': 'kilogram',
    'mi': 'mile',
  };

  this.convert = function (symbol, num) {
    return `${symbols[symbol]}${num === 1 ? '' : 's'}`;
  };
};