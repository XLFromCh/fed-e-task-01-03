//grunt入口文件
/* module.exports = (grunt) => {
  grunt.registerTask("foo", () => {
    console.log("hellow");
  });
  grunt.registerTask("bar", "任务描述", () => {
    console.log("hellow bar");
  });

  

  grunt.registerTask("async-task", function () {
    //console.log('hellow')
    const done = this.async();
    setTimeout(() => {
      console.log("异步");
      done();
    }, 1000);
  });
  grunt.registerTask("async-bad", function () {
    //console.log('hellow')
    const done = this.async();
    setTimeout(() => {
      console.log("失败异步");
      done(false);
    }, 1000);
  });
  grunt.registerTask("bad", () => {
    console.log("失败");
    return false;
  });

  grunt.registerTask("default", ["bad","foo", "bar"]);
};
 */

/* module.exports = (grunt) => {
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.initConfig({
    clean: {
      temp: "temp/*.js",
    },
    build: {
      options: {
        foo: {
          bar: "12313",
        },
      },
      css: {
        options: {
          foo: {
            bar: "测试",
          },
        },
      },
      js: "2",
    },
  });
  grunt.registerTask("foo", () => {
    console.log(grunt.config("foo"));
    console.log(grunt.config("foo.bar"));
  });

  grunt.registerMultiTask("build", function () {
    console.log(this.options());
    console.log(`build task ${this.target} ${this.data}`);
  });
}; */
module.exports = (grunt) => {
  grunt.loadNpmTasks("grunt-sass");
  grunt.initConfig({
    sass: {
      options: {
        implementation: sass,
      },
      main: {
        flies: {
          "sass url": "css url",
        },
      },
    },
  });
};
