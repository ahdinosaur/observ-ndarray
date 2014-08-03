var Ndarray = require('ndarray');

var clone = require('./clone');
var setNonEnumerable = require('./set-non-enumerable');

module.exports = addListener;

function addListener (obs, observ) {
  var ndarray = obs._ndarray;

  return observ(function (value) {
    var obsValue = obs();

    var valueNdarray = clone(obsValue);

    var index = ndarray.data.indexOf(observ);

    // this code path should never be hit.
    // if so, there's a bug in the cleanup.
    if (index === -1) {
      var message = "observ-ndarray: Unremoved observ listener";
      var err = new Error(message);
      err.ndarray = ndarray;
      err.index = index;
      err.observ = observ;
      throw err;
    }

    valueNdarray.data.splice(index, 1, value);

    setNonEnumerable(valueNdarray, "_diff", [index, 1, value]);

    obs.set(valueNdarray);
  });
}
