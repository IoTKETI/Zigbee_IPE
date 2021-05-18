const { json } = require("express");
const { JSONPath } = require("jsonpath-plus");
let ip = require("ip");
let express = require("express");
let bodyParser = require("body-parser");
let notification = express();
let fs = require("fs");
let deconz = require("./deconzAPI.js");
let ipeConfig = JSON.parse(fs.readFileSync("./config/IPE_configuration.json","utf-8"));
const NOTIFICATION_PORT = ipeConfig.ipe.notiPort;
const AE_ID = ipeConfig.ipe.id;
const GATEWAY_IP = ipeConfig.zigbeeGateway.ip;

notification.use(bodyParser.json());
notification.listen(NOTIFICATION_PORT, function () {
    console.log("AE Notification listening on: " + ip.address() +":"+ NOTIFICATION_PORT);
});

notification.post("/" + AE_ID, function (req, res) {
    console.log("$..req.body: \n" + JSON.stringify(req.body, null, 2));
    let req_body = req.body;
    let str = JSONPath("$..sur", req_body);
    let sub_deviceResourceName = str[0].split("/");
    let command = JSONPath("$..powerSe", req_body)[0]; // Attribute value you need to find (Ex. binarySwitch -> powerSe)
    console.log("=======================\n" + "User command: " + command);

    if (sub_deviceResourceName[2] == "Bulb1") { // Target device you want to control      
        if(command == true) {  // The actions when you get notification
            deconz.lighton(GATEWAY_IP, 2);
            res.sendStatus(200);
        }
        else if(command == false) {
            deconz.lightoff(GATEWAY_IP, 2);
            res.sendStatus(200);
        }
    }
});