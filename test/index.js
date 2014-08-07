var test = require('tape');
var Observ = require('observ');
var computed = require('observ/computed');
var Ndarray = require('ndarray');

var ObservNdarray = require('../');
var METHODS = require('../lib/methods').METHODS;

test("ObservNdarray is a function", function (t) {
  t.equal(typeof ObservNdarray, "function");
  t.end();
});

test("ObservNdarray contains initial value", function (t) {
  var arr = ObservNdarray(new Ndarray([
    Observ("foo"),
    Observ("bar"),
    Observ("baz"),
    "foobar",
  ]));
  var initial = arr();

  METHODS.forEach(function (name) {
    t.equal(typeof arr[name], "function");
  });
  t.equal(initial.size, 4);
  t.equal(initial.get(0), "foo");
  t.equal(initial.get(1), "bar");
  t.equal(initial.get(2), "baz");
  t.equal(initial.get(3), "foobar");

  t.equal(arr[0], undefined);
  t.equal(arr[1], undefined);
  t.notEqual(arr.length, 4);

  t.end();
});

test("ObservNdarray emits changes", function (t) {
  var arr = ObservNdarray(new Ndarray([
      Observ("foo"),
      Observ("bar"),
  ]));
  var initArr = arr();
  var changes = [];

  arr(function (state) {
    changes.push(state);
  });

  arr.get(0).set("foo2");
  arr.get(1).set("bar2");

  t.equal(changes.length, 2);
  t.equal(initArr.get(0), "foo");
  t.equal(initArr.get(1), "bar");
  t.notEqual(initArr, changes[0]);
  t.notEqual(changes[0], changes[1]);
  t.ok(changes[0]._diff);
  t.equal(Object.keys(changes[0]).indexOf("_diff"), -1);
  t.deepEqual(changes[0]._diff, [0, 1, "foo2"]);
  t.deepEqual(changes[0].get(0), "foo2");
  t.deepEqual(changes[0].get(1), "bar");
  t.deepEqual(changes[1].get(0), "foo2");
  t.deepEqual(changes[1].get(1), "bar2");

  t.end();
});

test("ObservNdarray throws error when not given ndarray as input", function (t) {
  var errMsg = "observ-ndarray: Function expects input to be ndarray.";
  t.throws(function () { new ObservNdarray() }, errMsg);
  t.end();
});

test("ObservNdarray emits shape changes", function (t) {
  var arr = ObservNdarray(new Ndarray([
      Observ("foo"),
      Observ("bar"),
      Observ("foobar"),
      Observ("barfoo"),
  ], [2, 2]));

  var value = arr();

  arr(function (state) {
    value = state;
  });

  t.deepEqual(value.shape.slice(), [2, 2]);
  t.deepEqual(value.get(0, 0), "foo");
  t.deepEqual(value.get(0, 1), "bar");
  t.deepEqual(value.get(1, 0), "foobar");
  t.deepEqual(value.get(1, 1), "barfoo");
  t.deepEqual(value.get(0, 2), undefined);
  t.deepEqual(value.get(1, 2), undefined);

  arr.set('shape', [1, 4]);

  t.deepEqual(value.shape.slice(), [1, 4]);

  t.deepEqual(value.get(0, 0), "foo");
  t.deepEqual(value.get(0, 1), "bar");
  t.deepEqual(value.get(0, 2), "foobar");
  t.deepEqual(value.get(0, 3), "barfoo");
  t.deepEqual(value.get(0, 4), undefined);
  t.deepEqual(value.get(1, 0), undefined);

  t.end()
})
