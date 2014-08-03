var Ndarray = require('ndarray');

module.exports = function (ndarray) {

  return new Ndarray(
    ndarray.data.slice(),
    ndarray.shape.slice(),
    ndarray.stride.slice(),
    ndarray.offset
  );
}
