var fs = require("fs");
var zigbee = require('./DeviceStateRetrive.js');

let devicelist = JSON.parse(fs.readFileSync('./Device_config.json', 'utf-8'));

// console.log(flexcontainerlist);
for (const [key, value] of Object.entries(devicelist)){
    // console.log(value.use);
    if (value.use === true) {
        let devicebatt = zigbee.sensorbatt(conf.zigbee.host, devicelist.hasOwnProperty(value.use));
        console.log("\n...\n" + JSON.stringify(devicelist[key]));
        console.log("\n~~~~~~~\n" + devicebatt);
    }
}