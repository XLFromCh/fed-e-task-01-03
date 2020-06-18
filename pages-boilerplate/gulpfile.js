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
    .pipe(dest("dist"))
    .pipe(bs.reload({ stream: true }));
};

const script = () => {
  return src("src/assets/scripts/*.js", { base: "src" })
    .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("dist"))
    .pipe(bs.reload({ stream: true }));
};

const page = () => {
  return src("src/*.html", { base: "src" })
    .pipe(plugins.swig({ data, defaults: { cache: false } }))
    .pipe(dest("dist"))
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
  return del(["dist", "temp"]);
};

const compile = series(clean, parallel(style, script, page));

const build = series(clean, parallel(compile, image, font, extra));

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
      baseDir: ["dist", "src", "public"],
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

const useref = () => {
  return (
    src("dist/*.html", { base: "dist" })
      .pipe(plugins.useref({ searchPath: ["dist", "."] }))
      
      /* .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          })
        )
      ) */
      .pipe(dest("dist"))
  );
};

const dev = series(compile, serve);
module.exports = {
  style,
  script,
  page,
  image,
  font,
  compile,
  clean,
  build,
  serve,
  dev,
  useref,
};
