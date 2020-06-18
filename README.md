# fed-e-task-01-03
开发脚手架与自动化构建工作流封装
简答题
1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。
        有利于团队代码的规范化，避免团队开发时候的一系列冲突
        能够实现各种自动化操作，如自动化部署、自动化构建、自动化测试
        工程化带来的组件化有利于灵活实现业务


2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？
        带来了生态丰富的前端库，不仅避免重复造轮子还极大的促进了前端技术的进步

编程题
1、概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具
    脚手架实际上就是通过node脚本，将预先设定好的模板文件复制到指定的文件夹，并且通过传递参数或者配置文件地址去修改模板中的内容，从而达到快速创建新项目的目的。

    自定义一个简单的脚手架，通过npm run <文件名> <目标文件夹路径> 这个命令创建项目的html文件

    const { resolve } = require('path')
    const fs = require('fs')
    const tempPath = resolve(__dirname, './temp/temp.html')
    const outputPath = process.argv[3] || "src"
    const fileName = process.argv[2] || "default"
    const readable = fs.createReadStream(tempPath);
    writable = fs.createWriteStream(resolve(outputPath, `${fileName}.html`));
    readable.pipe(writable);

    ....
    "scripts": {
        "creat": "node cli.js"
    },
    ...


2、尝试使用 Gulp 完成 项目 的自动化构建

3、使用 Grunt 完成 项目 的自动化构建        