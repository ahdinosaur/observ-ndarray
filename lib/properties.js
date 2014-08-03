module.exports = ndarrayProperties;

var READ = module.exports.READ = [
  "dtype", "size", "order", "dimension",
];

var readProps = READ.map(function (prop) {
  return [prop, function () {
    return this._ndarray[prop];
  }];
});

var WRITE = module.exports.WRITE = [
  "data", "shape", "stride", "offset",
];

var readWriteProps = WRITE.map(function (prop) {
  return [prop, function () {
    return this._ndarray[prop];
  }, function (val) {
    return this._ndarray[prop] = val;
  }];
});

function ndarrayProperties (obs) {

  readProps.forEach(function (tuple) {
    Object.defineProperty(obs, tuple[0], {
      get: tuple[1],
    });
  });

  readWriteProps.forEach(function (tuple) {
    Object.defineProperty(obs, tuple[0], {
      get: tuple[1],
      set: tuple[2],
    });
  });

  return obs;
}
