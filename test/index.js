var test = require('tape');
var Observ = require('observ');
var computed = require('observ/computed');
var isndarray = require('isndarray');
var Ndarray = require('ndarray');

var ObservNdarray = require('../');

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

  t.equal(typeof arr.get, "function");
  t.equal(typeof arr.set, "function");
  t.equal(typeof arr.index, "function");
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

  arr.set(0, "foo2");
  arr.set(1, "bar2");

  t.equal(changes.length, 2);
  t.equal(initArr.get(0), "foo");
  t.equal(initArr.get(1), "bar");
  t.notEqual(initArr, changes[0]);
  t.notEqual(changes[0], changes[1]);
  t.ok(changes[0].data._diff);
  t.equal(Object.keys(changes[0].data).indexOf("_diff"), -1);
  t.deepEqual(changes[0].data._diff, [0, 1, "foo2"]);
  t.deepEqual(changes[0].get(0), "foo2");
  t.deepEqual(changes[0].get(1), "bar");
  t.deepEqual(changes[1].get(0), "foo2");
  t.deepEqual(changes[1].get(1), "bar2");

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

  arr.shape.set([1, 4]);

  t.deepEqual(value.shape.slice(), [1, 4]);

  t.deepEqual(value.get(0, 0), "foo");
  t.deepEqual(value.get(0, 1), "bar");
  t.deepEqual(value.get(0, 2), "foobar");
  t.deepEqual(value.get(0, 3), "barfoo");

  t.end()
});

test("ObservNdarray functions as grid", function (t) {

  t.plan(12);

  var grid = ObservNdarray([0,1,2,3,4,5], [2,3]);
  // 0 1 2
  // 3 4 5
  t.equal(grid.get(0,1), 1);
  t.equal(grid.get(1,0), 3);
  t.equal(grid.get(1,1), 4);

  // set
  var removeListeners = [
    grid.data(function (value) {
      t.same(value._diff, [1, 1, 'A']);
      t.same(value, [0,'A',2,3,4,5]);
    }),
    grid(function(value){
      t.ok(isndarray(value), 'emits ndarray');
      t.same(value.data._diff, [1, 1, 'A']);
      t.same(value.data, [0,'A',2,3,4,5]);
      t.equal(value.get(0,1), 'A');
    }),
  ];
  grid.set(0,1, 'A');
  removeListeners.forEach(invoke);

  t.same(grid.index(1,0), 3);

  // direct data update
  var removeListeners = [
    grid.data(function (value) {
      t.same(value, [0,'A',2,'Z',4,5]);
    }),
    grid(function (value) {
      t.equal(value.get(1,0), 'Z');
    }),
  ]
  grid.data.put(3, 'Z');
  removeListeners.forEach(invoke);

  t.end();
})

test('nested Observ', function(t){
  t.plan(10);
  var inner = Observ(0);
  var grid = ObservNdarray([inner,1,2,3,4,5], [2,3]);

  // set inner
  var removeListeners = [
    inner(function (value) {
      t.equal(value, 'A');
    }),
    grid.data(function (value) {
      t.same(value._diff, [ 0, 1, 'A' ]);
      t.same(value, ['A',1,2,3,4,5]);
    }),
    grid(function (value) {
      t.same(value.data._diff, [ 0, 1, 'A' ]);
      t.equal(value.get(0,0), 'A');
    }),
  ];
  inner.set('A');
  t.equal(grid.get(0,0), inner);
  removeListeners.forEach(invoke);

  // override with put
  var removeListeners = [
    inner(function(value) {
      t.ok(false, 'this should not get called');
    }),
    grid.data(function (value) {
      t.same(value._diff, [ 0, 1, 'B' ]);
      t.same(value, ['B',1,2,3,4,5]);
    }),
    grid(function (value) {
      t.equal(value.get(0,0), 'B');
    }),
  ];
  grid.set(0,0, 'B');
  t.equal(grid.get(0,0), 'B');
  removeListeners.forEach(invoke);
  t.end();
});

test('set beyond internal data.length', function (t) {
  var grid = ObservNdarray([0], [2,3]);
  grid.set(1,2, 'Z');
  t.equal(grid.get(1,2), 'Z');
  t.same(grid.data(), [0,,,,,'Z']);
  t.end();
});

function invoke(f){
  return f();
}
