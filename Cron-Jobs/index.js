
const cron = require('node-cron');


// Run a task every minute
// cron.schedule('* * * * *', () => {
//   console.log('Running a task every minute');
// });

cron.schedule('49 15 * * *',()=>{

    console.log('Runnig a task every minute ');

    console.log("Run this task after above task");
        

    
})