var Observ = require('observ');
var ObservArray = require('observ-array');
var Ndarray = require('ndarray');
var isNdarray = require('isndarray');

function ObservNdarray () {

  var data, shape, stride, constructor;

  if (isNdarray(arguments[0])) {
    // ndarray given
    var ndarray = arguments[0];
    data = ndarray.data.slice();
    shape = ndarray.shape.slice();
    stride = ndarray.stride.slice();
    constructor = arguments[1] && arguments[1].constructor || Ndarray;
  } else {
    // ndarray arguments given
    data = arguments[0];
    shape = arguments[1];
    stride = arguments[2];
    constuctor = arguments[3] && arguments[3].constructor || Ndarray;
  }

  // create observable
  var obs = Observ();

  // set observable arguments
  obs.data = typeof data === 'function' ? data : ObservArray(data);
  obs.shape = typeof shape === 'function' ? shape : ObservArray(shape);
  obs.stride = typeof stride === 'function' ? stride : ObservArray(stride);

  // store original set function
  obs._set = obs.set;

  // initialize value
  var lastValue = constructor(obs.data(), obs.shape(), obs.stride());

  // define index
  obs.index = function () {
    return lastValue.index.apply(lastValue, arguments);
  }

  // define get
  obs.get = function () {
    return lastValue.get.apply(lastValue, arguments);
  }

  // define set
  obs.set = function () {
    if (arguments.length === 1) {
      obs._set(arguments[0]);
      return
    }
    var args = Array.prototype.slice.apply(arguments);
    obs.data.put(
      obs.index.apply(
        obs.index, args.slice(0, args.length - 1)
      ),
      args[args.length - 1]
    );
  }

  var update = function update () {
    lastValue = constructor(obs.data(), obs.shape(), obs.stride())
    obs.set(lastValue);
  };

  obs._removeListeners = [
    obs.data(update),
    obs.shape(update),
    obs.stride(update),
  ];

  update();

  return obs;
}

module.exports = ObservNdarray;
