var Ndarray = require('ndarray');
var isNdarray = require('isndarray');

var ObservNdarray = require('../');
var clone = require('./clone');
var properties = require('./properties');

module.exports = ndarrayMethods;

var METHODS = module.exports.METHODS = [
  "get", "set", "index", "lo", "hi", "step", "transpose", "pick",
];

var methods = METHODS.map(function (name) {
  return [name, function () {
    var res = this._ndarray[name].apply(this._ndarray, arguments);

    if (res && isNdarray(res)) {
      res = ObservNdarray(res);
    }

    return res;
  }];
});

function ndarrayMethods (obs) {

  obs._observSet = obs.set;

  methods.forEach(function (tuple) {
    if (tuple[0] === 'get') {
      obs._ndarrayGet = tuple[1];
    } else if (tuple[0] === 'set') {
      obs._ndarraySet = tuple[1];
    }else {
      obs[tuple[0]] = tuple[1];
    }
  });

  obs.get = get;
  obs.set = set;

  return obs;
}

function get () {
  if (
    arguments.length === 1 &&
    typeof arguments[0] === 'string' &&
    properties.readProps.indexOf(arguments[0]) !== -1
  ) {
    return this._ndarray[arguments[0]];
  } else {
    return this._ndarrayGet.apply(this, arguments);
  }
}

function set () {
  if (arguments.length === 1) {
    return this._observSet.apply(this, arguments);
  } else if (
    arguments.length === 2 &&
    typeof arguments[0] === 'string' &&
    properties.writeProps.indexOf(arguments[0]) !== -1
  ) {
    var ndarray = this();
    ndarray[arguments[0]] = arguments[1];
    return this._observSet(ndarray);
  } else {
    var ndarray = this();
    this._ndarraySet.apply(ndarray, arguments);
    return this._observSet(ndarray);
  }
}
