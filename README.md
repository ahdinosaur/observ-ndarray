# observ-ndarray

an [ndarray](http://npmjs.org/ndarray) containing observable values

### WORK IN PROGRESS

## example

an `ObservNdarray` is an observable version of an [ndarray](http://npmjs.org/ndarray), every mutation of the array or mutation of an observable element in the array will cause the `ObservNdarray` to emit a new changed [ndarray](http://npmjs.org/ndarray).

```
var ObservStruct = require('observ-struct');
var ObservNdarray = require('observ-ndarray');
var Observ = require('observ');
var Ndarray = require('ndarray');

var createPixel (red, green, blue) {
  return ObservStruct({
    red: red,
    green: green,
    blue: blue,
  });
}

var state = ObservStruct({
  grid: ObservNdarray(new Ndarray([
    createPixel(0, 0, 0),
    createPixel(128, 128, 128),
    createPixel(256, 256, 256),
    createPixel(128, 128, 128),
    createPixel(0, 0, 0, 0),
    createPixel(128, 128, 128),
    createPixel(256, 256, 256),
    createPixel(128, 128, 128),
  ], [4, 4])),
});

state(function (currState) {
  // currState.grid is an ndarray
  // currState.grid.get(0, 0) is a plain object
  for (var i = 0; i < currState.grid.shape[0]) {
    for (var j = 0; j < currState.grid.shape[1]) {
      console.log(currState.grid.get(i, j));
    }
  }
});
```
