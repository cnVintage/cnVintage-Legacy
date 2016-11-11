'use strict';

let {exec} = require('child_process');

class TaskQueue {
    constructor() {
        this.queue = [];
        this.busy = false;
        this.cnt = 0;
    }

    beginTasks() {
        this.busy = true;
        console.log(`[beginTasks] Queue length = ${this.queue.length}, Cnt = ${this.cnt}`);
        let front = this.queue.shift();
        exec(front.command, (err, stdout, stderr) => {
            setTimeout(() => {
                // We can assume that current shell job is done.
                // Run the callback and immediate start next task.
                front.callback(err, stdout, stderr);
                if (this.queue.length !== 0) {
                    this.beginTasks();
                }
                else {
                    // Well done.
                    this.busy = false;
                }
            }, 50);
        });
    }

    push(task) {
        this.queue.push(task);
        if (!this.busy)
            this.beginTasks();
    }
}

let taskQueue = new TaskQueue();

module.exports = {
    getTaskQueue: function() {
        return taskQueue;
    }
}