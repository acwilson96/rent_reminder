var nodemailer = require('nodemailer');
var config     = require('./flat_credentials.json');

/* Object to store stop date. */
var stopDate   = {
    day: config.end_date.substring(0,2),
    month: config.end_date.substring(3,5),
    year: config.end_date.substring(6,10)
}

/* nodemailer transport object. */
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.sender.email,
      pass: config.sender.password
    }
});

/* Set up receipient list (as string). */
var to_str = '';
for (var i=0; i < config.reminder_list.length; i++) {
    to_str += config.reminder_list[i] + ', '
}
to_str += config.sender.email

/* Create email  */
var email = {
    from: config.sender.email,
    to: to_str,
    subject: config.subject,
    text: config.message
};

/* Returns the number of days remaining in the provided month. */
function daysRemaining() {
    var d = new Date();
    var date = d.getDate();
    var mnth = d.getMonth() + 1;
    var year = d.getFullYear();
    var leapyear = (year/4 % 0);

    var days_left;
    // If February
    if (mnth == 2) {
        if (leapyear) {
            days_left = 29 - date;
        } else {
            days_left = 28 - date;
        }
    }
    // If 31 day month.
    else if ([1,3,5,7,8,10,12].indexOf(mnth) > -1) {
        days_left = 31 - date;
    } else {
        days_left = 30 - date;
    }
    // Update email message and return days left.
    email.text = config.message + '\nYou have ' + days_left + ' days left to pay your rent';
    return days_left;
}

/* Checks if its firing time. */
function checkDate(currDate) {
    // Send reminder between 9am and 10am of last 3 days of month.
    if ((daysRemaining() < 4) && (currDate.getHours() >= 9 && currDate.getHours() < 10)) {
        fire();
        console.log(dateStr() + ' :: FIRED');
        return;
    }
    console.log(dateStr() + ' :: Did not fire.');
}

/* Fires the configured email. */
function fire() {
    transporter.sendMail(email, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent:');
          console.log(email);
          console.log('Response: ' + info.response);
        }
      });
}

/* Execute every hour. */
var checkHourly = setInterval(() => {
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    // Check we are within date.
    if (year < stopDate.year) {
        checkDate(d);
    }
    else if ((year == stopDate.year) && (month <= stopDate.month)) {
        checkDate(d);
    }
    else if ((year == stopDate.year) && (month <= stopDate.month) && (date <= stopDate.day)) {
        checkDate(d);
    } else {
        // Passed stop date, clear the interval.
        clearInterval(checkHourly);
    }
}, 3600000);

console.log(dateStr() +  ' :: Started running');


/*************\
    Helpers
\*************/

function dateStr() {
    var d = new Date();

    var date = d.getDate();
    var mnth = d.getMonth() + 1;
    var year = d.getFullYear();

    var hour = d.getHours();
    var mins = d.getMinutes();
    var secs = d.getSeconds();

    return date + '/' + mnth + '/' + year + ' @ ' + hour + ':' + mins + ':' + secs;
}