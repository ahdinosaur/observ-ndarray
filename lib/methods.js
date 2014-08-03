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
  methods.forEach(function (tuple) {
    obs[tuple[0]] = tuple[1];
  });
  return obs;
}
