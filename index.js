var Observ = require('observ');
var Ndarray = require('ndarray');
var isNdarray = require('isndarray');

module.exports = ObservNdarray;

var addListener = require('./lib/add-listener');
var methods = require('./lib/methods');
var properties = require('./lib/properties');

function ObservNdarray (initialNdarray) {

  var ndarray = initialNdarray;

  if (!isNdarray(ndarray)) {
    var message = "observ-ndarray: Function expects input to be ndarray.";
    var err = new Error(message);
    err.input = input;
    throw err;
  };

  var initialState = new ndarray.constructor(
    ndarray.data.slice(),
    ndarray.shape,
    ndarray.stride,
    ndarray.offset
  );

  ndarray.data.forEach(function (observ, index) {
    initialState.data[index] = typeof observ === 'function' ?
      observ() : observ
  });

  var obs = Observ(initialState);

  obs._ndarray = ndarray;

  obs = methods(obs);
  obs = properties(obs);

  obs._removeListeners = ndarray.data.map(function (observ) {
    return typeof observ === 'function' ?
      addListener(obs, observ) : null
  });

  return obs;
}
