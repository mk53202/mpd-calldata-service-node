var TaskTimer = require('tasktimer');

var timer = new TaskTimer(1000)
// interval can be updated anytime by setting the `timer.interval` property.

// Add task(s) based on tick intervals.
timer.addTask({
    name: 'job1',       // unique name of the task
    tickInterval: 5,    // run every 5 ticks (5 x interval = 5000 ms)
    totalRuns: 15,      // run 10 times only. (set to 0 for unlimited times)
    callback: function (task) {
        // code to be executed on each run
        console.log(task.name + ' task has run ' + task.currentRuns + ' times.');
        if( task.currentRuns >= task.totalRuns ) {
          timer.stop()
        }
    }
});

// Execute some code on each tick... (every 1 second)
timer.on('tick', function () {
    console.log('tick count: ' + timer.tickCount);
    console.log('elapsed time: ' + timer.time.elapsed + ' ms.');
    // stop timer (and all tasks) after 1 hour
    if (timer.tickCount >= 3600000) timer.stop();
});

// Start the timer
timer.start()
