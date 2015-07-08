
var rest = require('restler');

// Fill your credentials here
var username = "";
var password = "";

// Parameters
var previous_ip = "";
var timeout_in_ms = 10000;
var updated = true;
var interval_time_in_ms = 1000*60*2 // Sync every 4 minutes

var check_and_update_ip = function() {
    rest.get('https://api.ipify.org?format=json',{timeout: 10000}).on('timeout', function(ms){
      console.log('IP check did not finish within '+ms+' ms');
    }).on('complete',function(data,response){
        if ((data.ip && data.ip !== previous_ip) || !updated) {
            previous_ip = data.ip;
            updated = false;
            console.log("A change in IP has been detected -> "+data.ip);
            rest.get('https://api.unblock-us.com/login?'+username+':'+password,{timeout: 10000}).on('timeout', function(ms){
                console.log('IP update did not finish within '+ms+' ms');
            }).on('complete', function(data) {
                if (data === "active") {
                    updated = true;
                    console.log("Your IP has been changed on Unblock-US.");
                };
            });
        } else {
            console.log("No IP change was detected.");
        }
    });
};

// Call once initially.
check_and_update_ip();
// Call in regular intervals after
setInterval(check_and_update_ip, interval_time_in_ms);