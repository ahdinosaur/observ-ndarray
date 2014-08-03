var ObservNdarray = require('../');

module.exports = ndarrayMethods;

var METHODS = module.exports.METHODS = [
  "get", "set", "index", "lo", "hi", "step", "transpose", "pick",
];

var methods = METHODS.map(function (name) {
  return [name, function () {
    var res = this._ndarray[name].apply(this._ndarray, arguments);

    if (res && res.constructor === this._ndarray.constructor) {
      res = ObservNdarray(res);
    }

    return res;
  }];
});

function ndarrayMethods (obs) {

  obs._observSet = obs.set;

  methods.forEach(function (tuple) {
    if (tuple[0] === 'set') {
      obs._ndarraySet = tuple[1];
    }
    obs[tuple[0]] = tuple[1];
  });

  obs.set = set;

  return obs;
}

function set () {
  if (arguments.length === 1) {
    return this._observSet.apply(this, arguments);
  } else {
    return this._ndarraySet.apply(this, arguments);
  }
}
