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
var rgbHex = require('rgb-hex');
var kuler = require('kuler');

function createPixel (red, green, blue) {
  return ObservStruct({
    red: Observ(red),
    green: Observ(green),
    blue: Observ(blue),
  });
}

var state = ObservStruct({
  grid: ObservNdarray(new Ndarray([
    createPixel(255, 0, 0),
    createPixel(0, 255, 0),
    createPixel(0, 0, 255),
    createPixel(0, 255, 255),
    createPixel(255, 255, 0),
    createPixel(255, 255, 255),
    createPixel(255, 0, 0),
    createPixel(0, 255, 0),
    createPixel(0, 0, 255),
  ], [3, 3])),
});

state(function (currState) {
  // currState.grid is an ndarray
  // currState.grid.get(0, 0) is a plain object
  for (var i = 0; i < currState.grid.shape[0]; i++) {
    for (var j = 0; j < currState.grid.shape[1]; j++) {
      var pixel = currState.grid.get(i, j);
      var color = rgbHex(pixel.red, pixel.green, pixel.blue);
      process.stdout.write(kuler('•').style(color));
    }
    process.stdout.write('\n');
  }
});

state.grid.get(0, 0).red.set(255);
console.log("---");
state.grid.get(0, 0).green.set(255);
console.log("---");
state.grid.get(0, 0).blue.set(255);
```
