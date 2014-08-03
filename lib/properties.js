var writeProps;
var readWriteProps = writeProps = [
  "data", "shape", "stride", "offset",
];

var readProps  = [
  "dtype", "size", "order", "dimension",
].concat(readWriteProps);

module.exports = {
  readProps: readProps,
  writeProps: writeProps,
  readWriteProps: readWriteProps,
};
