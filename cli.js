#!/usr/bin/env node
const program = require('commander');
const api = require("./index.js")

program
    .command('add')
    .description('添加一个任务')
    .action((...args) => {
        let str = args.slice(0, -1).join(" ");
        api.add(str).then(() => console.log(`${str}添加成功`)).catch(() => console.log("添加失败"))
    });

program
    .command('clear')
    .description('清空所有任务')
    .action(() => {
        api.clear().then(() => console.log("清空成功")).catch(() => console.log("清空失败"))
    });


program.parse(process.argv);

if (process.argv.length === 2) {
    void api.showAll();
}
