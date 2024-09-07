const cron = require('node-cron');

// 随机生成 cron 表达式
function getRandomCronExpression() {
    // 生成随机的分钟（0-59）和小时（0-23）
    const randomMinute = Math.floor(Math.random() * 60);
    const randomHour = Math.floor(Math.random() * 24);

    // 格式化为cron表达式 (秒 分 时 * * *)
    return `${randomMinute} ${randomHour} * * *`;
}

// 定义任务
function exampleTask() {
    console.log('Task is executed at:', new Date().toLocaleString());
}

// 每天生成新的随机 cron 并调度任务
function scheduleDailyRandomTask() {
    const cronExpression = getRandomCronExpression();
    console.log(`Task scheduled to run at random time: ${cronExpression}`);

    // 调度任务
    cron.schedule(cronExpression, () => {
        exampleTask();
    });
}

// 启动时立即调度
scheduleDailyRandomTask();

// 可选：设置一个每天更新随机 cron 表达式的定时任务
cron.schedule('0 0 * * *', () => {  // 每天午夜重设
    scheduleDailyRandomTask();
});
