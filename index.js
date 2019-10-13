const db = require("./db");
const inquirer = require('inquirer');

module.exports.add = async (title) => {
    const dbList = await db.read();
    dbList.push({ title, done: false });
    await db.write(dbList);
}

module.exports.clear = async () => {
    await db.write([]);
}

function taskUpTrue(dbList, index) {
    dbList[index].done = true;
    db.write(dbList);
}

function taskUpFalse(dbList, index) {
    dbList[index].done = false;
    db.write(dbList);
}

function updataTitle(dbList, index) {
    inquirer.prompt({
        type: 'input',
        name: 'Title',
        message: "请输入标题",
        default: dbList[index].title
    }).then(answer3 => {
        dbList[index].title = answer3.Title;
        db.write(dbList);
    });
}

function delTask(dbList, index) {
    dbList.splice(index, 1);
    db.write(dbList);
}

function actionTask(dbList, index) {
    const actions = { taskUpTrue, taskUpFalse, updataTitle, delTask };
    inquirer
        .prompt({
            type: 'list',
            name: 'action',
            message: '请操作',
            choices: [
                { name: "-退出-", value: 'Q' },
                { name: "已完成", value: 'taskUpTrue' },
                { name: "未完成", value: 'taskUpFalse' },
                { name: "改标题", value: 'updataTitle' },
                { name: "删除", value: 'delTask' }
            ]
        }).then(answer => {
            let action = actions[answer.action];
            action && action(dbList, index);
        });
}

function createTask(dbList) {
    inquirer.prompt({
        type: 'input',
        name: 'task',
        message: "请输入新的标题"
    }).then(answer4 => {
        dbList.push({
            title: answer4.task,
            done: false
        })
        db.write(dbList);
    });
}

function printTask(dbList) {
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: '请选择你需要操作的任务',
            choices: [{ name: "+创建任务+", value: '-2' }, { name: "-退出-", value: '-1' }, ...dbList.map((task, index) => {
                return { name: `${task.done ? '[√]' : '[×]'} 任务${index + 1}-> ${task.title}`, value: index.toString() }
            })]
        }).then(answers => {
            let index = parseInt(answers.index);
            if (index >= 0) {
                actionTask(dbList, index)
            } else if (index === -2) {
                createTask(dbList)
            }
        });
}

module.exports.showAll = async () => {
    const dbList = await db.read();
    printTask(dbList)
}