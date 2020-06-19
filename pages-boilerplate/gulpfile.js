const { src, dest, parallel, series, watch } = require("gulp");
const loadPlugins = require("gulp-load-plugins");
const plugins = loadPlugins();
const del = require("del");
const data = {
  pkg: require("./package.json"),
};
const browserSync = require("browser-sync");
const bs = browserSync.create();
const style = () => {
  return src("src/assets/styles/*.scss", { base: "src" })
    .pipe(plugins.sass({ outputStyle: "expanded" }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

const script = () => {
  return src("src/assets/scripts/*.js", { base: "src" })
    .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

const page = () => {
  return src("src/*.html", { base: "src" })
    .pipe(plugins.swig({ data, defaults: { cache: false } }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

/* imagemin安装很多次都失败，
而且每次失败都会导致其他插件也出问题必须要删除node_modules重新npm i，
因此暂时注释imagemin的使用
*/
const image = () => {
  return (
    src("src/assets/images/**", { base: "src" })
      //.pipe(plugins.imagemin())
      .pipe(dest("dist"))
  );
};

const font = () => {
  return (
    src("src/assets/fonts/**", { base: "src" })
      //.pipe(plugins.imagemin())
      .pipe(dest("dist"))
  );
};

const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist"));
};

const clean = () => {
  return del(["dist", "temp", "release"]);
};

const compile = parallel(style, script, page);


const serve = () => {
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/*.html", page);
  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload //刷新页面
  );

  bs.init({
    notify: false,
    port: 8012,
    server: {
      baseDir: ["temp", "src", "public"],
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

const userefTask = () => {
  return (
    src("temp/*.html", { base: "temp" })
      .pipe(plugins.useref({ searchPath: ["dist", "."] }))
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true,//折叠所有空白字符
            minifyCSS: true,//压缩行内样式
            minifyJS: true,//压缩script标签
          })
        )
      )
      .pipe(dest("dist"))
  );
};

const build = series(clean, parallel(series(compile, userefTask), image, font, extra));
const dev = series(clean, compile, serve);
module.exports = {
  clean,
  build,
  serve,
  dev
};
