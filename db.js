// 获取Home目录
const homedir = require('os').homedir();
const fs = require("fs");
const path = require("path");
const home = process.env.Home || homedir;
const dbPath = path.join(home, '.dbTodo');

const db = {
    read(p = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(p, { flag: "a+" }, (err, data) => {
                if (err) return reject(err);
                let dbList, dataStr = data.toString();
                try {
                    dbList = JSON.parse(dataStr);
                } catch (error) {
                    dbList = [];
                }
                resolve(dbList);
            });
        })

    },
    write(dbList, p = dbPath) {
        return new Promise((resolve, reject) => {
            const str = JSON.stringify(dbList);
            fs.writeFile(p, str, (error) => {
                if (error) return reject(error);
                resolve();
            })
        })

    }
}

module.exports = db;