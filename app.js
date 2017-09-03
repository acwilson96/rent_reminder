var nodemailer = require('nodemailer');
var config     = require('./flat_credentials.json');
var stopDate   = {
    day: config.end_date.substring(0,2),
    month: config.end_date.substring(3,5),
    year: config.end_date.substring(6,10)
}

var date = new Date();
console.log(date.getFullYear())

// Execute every hour.
var checkHourly = setInterval(() => {
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    // Check we are within date.
    if (year < stopDate.year) {
        checkDate(date);
    }
    else if ((year == stopDate.year) && (month <= stopDate.month)) {
        checkDate(date);
    }
    else if ((year == stopDate.year) && (month <= stopDate.month) && (date <= stopDate.day)) {
        checkDate(date);
    } else {
        // Passed stop date, clear the interval.
        clearInterval(checkHourly);
    }
}, 3600000);

function checkDate(currDate) {
    // Check if its 9am of the 27th, and execute appropriately.
}