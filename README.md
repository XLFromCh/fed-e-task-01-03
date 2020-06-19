# fed-e-task-01-03

# 开发脚手架与自动化构建工作流封装

# 简答题

##  1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。

        有利于团队代码的规范化，避免团队开发时候的一系列冲突
        能够实现各种自动化操作，如自动化部署、自动化构建、自动化测试
        工程化带来的组件化有利于灵活实现业务

## 2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？

        带来了生态丰富的前端库，不仅避免重复造轮子还极大的促进了前端技术的进步

# 编程题

## 1、概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具

    脚手架实际上就是通过node脚本，将预先设定好的模板文件复制到指定的文件夹，并且通过传递参数或者配置文件地址去修改模板中的内容，从而达到快速创建新项目的目的。

    自定义一个简单的脚手架，执行npm link之后可以通过cli-demo <文件名> 这个命令创建项目的html文件

    index.js

    #!/usr/bin/env node
    const { resolve } = require('path')
    const fs = require('fs')
    const tempPath = resolve(__dirname, './temp/index.html')
    const outputPath = process.cwd()
    const fileName = process.argv[2] || "default"
    const readable = fs.createReadStream(tempPath);
    writable = fs.createWriteStream(resolve(outputPath, `${fileName}.html` ));
    readable.pipe(writable);

    package.json
    ....
    "bin": {
        "cli-demo": "./index.js"
    },
    ...

## 2、尝试使用 Gulp 完成 项目 的自动化构建

    const sass = require("sass");

    const loadGruntTasks = require("load-grunt-tasks"); 

    module.exports = (grunt) => {
    grunt.initConfig({

        sass: {
        options: {
            sourceMap: true,
            implementation: sass,
        },
        main: {
            files: {
            "dist/css/main.css": "src/assets/styles/main.scss",
            },
        },
        },
        babel: {
        options: {
            sourceMap: true,
            presets: ["@babel/preset-env"],
        },
        main: {
            files: {
            "dist/js/main.js": "src/assets/scripts/main.js",
            },
        },
        },
        watch: {
        js: {
            files: ["src/assets/scripts/*.js"],
            tasks: ["babel"],
        },
        css: {
            files: ["src/assets/style/*.scss"],
            tasks: ["sass"],
        },
        },

    }); 
    loadGruntTasks(grunt); 

    grunt.registerTask("default", ["sass", "babel", "watch"]); 
    }; 

## 3、使用 Grunt 完成 项目 的自动化构建       

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
