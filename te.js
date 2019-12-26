let firstDate = new Date("09/18/2017"),
    secondDate = new Date("09/15/2017"),
    timeDifference = secondDate.getTime() - firstDate.getTime();

console.log(timeDifference);
let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
console.log(differentDays);
