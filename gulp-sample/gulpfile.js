const { series, parallel } = require("gulp");
const fs = require("fs");
exports.foo = (done) => {
  console.log("foo task");
  done();
};

exports.default = (done) => {
  console.log("默认任务");
  done();
};

exports.call_error = (done) => {
  console.log("错误任务");
  done(new Error("错误"));
};
exports.promiseTask = (done) => {
  console.log("promise task");
  return Promise.resolve();
};

exports.streamTask = () => {
  const rS = fs.createReadStream("package.json");
  const wS = fs.createWriteStream("temp.txt");
  rS.pipe(wS);
  return rS;
};
