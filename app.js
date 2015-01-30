var ENV = process.env.NODE_ENV || 'local',
    cluster = require('cluster');

switch (ENV) {
    case 'local':
        console.log('Local mode configuration');
    case 'development':
        console.log('Application run in development environment (single thread).');
        runSingleThread();
        break;
    case 'production':
        if (cluster.isMaster) {
            console.log('Application run in production environment (multi threads).');
        }
        runMultiThreads();
        break;
    default:
        console.error('Wrong ENV.');
}

function runSingleThread() {
    require('./init.js');
}

function runMultiThreads() {
    var i, pid,
        numCPUs = require('os').cpus().length,
        rssWarn = (250 * 1024 * 1024),
        heapWarn = (250 * 1024 * 1024),
        workers = {};

    if (cluster.isMaster) {
        for (i = 0; i < numCPUs; i++) {
            createWorker();
        }

        setInterval(function() {
            var time = new Date().getTime();

            for (pid in workers) {
                if (workers.hasOwnProperty(pid) && workers[pid].lastCb + 5000 < time) {
                    console.error('Long running worker ' + pid + ' killed.');

                    workers[pid].worker.kill();
                    delete(workers[pid]);
                    createWorker();
                }
            }
        }, 1000);

        cluster.on('exit', function(worker, code, signal) {
            console.log('worker ' + worker.process.pid + ' died');
        });
    }
    else {
        runSingleThread();

        setInterval(function report() {
            process.send({
                cmd: 'reportMem',
                memory: process.memoryUsage(),
                process: process.pid
            });
        }, 1000);
    }

    function createWorker() {
        var worker = cluster.fork().process;

        worker.on('disconnect', function(worker) {
            console.error('Worker disconnected!');
            createWorker();
        });

        console.log('Created worker: ' + worker.pid + '.');

        workers[worker.pid] = {
            worker: worker,
            lastCb: new Date().getTime() - 1000
        };

        worker.on('message', function(m) {
            if (m.cmd === 'reportMem') {
                if( workers[m.process] ) {
                    workers[m.process].lastCb = new Date().getTime();

                    if (m.memory.rss > rssWarn) {
                        console.log('Worker ' + m.process + ' using too much memory.');
                    }
                } else {
                    console.log('No worker find for:', m);
                }
            }
        });
    }
}