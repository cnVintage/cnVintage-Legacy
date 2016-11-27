// Test script for cnVintage-legacy

class TestQueue {
    constructor(onfinish) {
        this.queue = [];
        this.onfinish = onfinish;
    }
    push (task) {
        if (task instanceof Array) {
            task.forEach(item => this.push(item));
        }
        else if (typeof task.name === 'undefined' || typeof task.entry === 'undefined') {
            console.log('Illegal task.')
            process.exit(1);
        }
        else {
            this.queue.push(task);
        }
    }
    start(offset = 0) {
        if (offset == this.queue.length) {
            console.log('Test finished with no error report.');
            process.exit(0);
        }
        else {
            this.queue[offset].entry.call(this, (err) => {
                console.log(`Catch an error on test: ${this.queue[offset].name}\nError: ` + err);
                process.exit(2);
            }, () => {
                console.log(`Passed: ${this.queue[offset].name}`);
                this.start(offset + 1);
            })
        }
    }
}

let main = () => {
    const {spawn} = require('child_process');

    console.log('Starting server...');
    let server = spawn('node', ['index.js'], {cwd: '..'});
    process.on('exit', () => {
        console.log('Stoping server...');
        server.kill();
        console.log('** WARNING: Image Proxy module is untested. **');
    })
    let testQueue = new TestQueue();
    testQueue.push(require('./db-conn'));
    testQueue.push(require('./site-index'));
    testQueue.push(require('./site-tagview'));
    testQueue.push(require('./site-search'));
    testQueue.push(require('./site-discussview'));
    testQueue.push(require('./katex-render'));
    testQueue.start();
};

main();
