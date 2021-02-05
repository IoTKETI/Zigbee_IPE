const conf = require("./conf");
var zigbee = require("./DeviceStateRetrive.js");
var request = require("sync-request");
global.conf = require("./conf.js");
var ipe_ip = require("ip");
var express = require("express");
var bodyParser = require("body-parser");
var device_body = require("./Device_body.js");
const { JSONPath } = require("jsonpath-plus");
var app = express();
var fs = require("fs");

var mobius = require("./MobiusConnector.js").mobius;
var keti_mobius = new mobius();
keti_mobius.set_mobius_info(conf.cse.host, conf.cse.port, conf.ae.id);

var ipe_port = 4000;

// ========================== JSON read ==========================
let deviceClasslist = JSON.parse(fs.readFileSync("./Resource_config.json", "utf-8"));
let flexcontainer_deviceClass_List = JSON.parse(fs.readFileSync("./Flexcontainer_deviceClass.json", "utf-8"));
let flexcontainer_moduleClass_List = JSON.parse(fs.readFileSync("./Flexcontainer_moduleClass.json", "utf-8"));
let deviceList = JSON.parse(fs.readFileSync("./Device_config.json", "utf-8"));
let bulbList = JSON.parse(fs.readFileSync("./Bulb_config.json", "utf-8"));

// ========================== device data ==========================
let last_device_battery = 100;
let last_door_state = true;
let last_temperature = 2000;
let last_switch_state = false;
let last_faultDetection = true;
let last_saturation = 250;
let last_brightness = 250;
let last_redcolor = 250;
let last_greencolor = 250;
let last_bluecolor = 250;

function devicebattery(){
    setInterval(function(){
        for (const [key, value] of Object.entries(deviceList)){
            let device_battery =  zigbee.sensorbatt(conf.zigbee.host, key);
            if (last_device_battery != device_battery){
                last_device_battery = device_battery;
                let device_batt_path = conf.ae.parent + "/" + conf.ae.name + "/"+  value.linked + "/battery";
                let device_batt_obj = {
                    "hd:bat": {
                        "lvl": device_battery
                    }
                }
                let device_batt_resp = keti_mobius.put_fcnt(device_batt_path, device_batt_obj);
                console.log(device_batt_resp);
            }
        }
    },conf.sensor_interval);
}


function fdoorstate() {
    setInterval(function(){
        for (const [key, value] of Object.entries(deviceList)){
            for(let i = 0; i < value.state.length; i++){
                if(value.state[i] === "open") {
                    var door_state = zigbee.sensordata(conf.zigbee.host, key, value.state[i]);
                    if (last_door_state != door_state){
                        last_door_state = door_state;
                        if(door_state == true){
                            zigbee.lighton(conf.zigbee.host, 2);
                        }
                        if(door_state == false){
                            zigbee.lightoff(conf.zigbee.host, 2);
                        }
                        let cin_path = conf.ae.parent + "/" + conf.ae.name+"/" + value.linked + "/doorlock";
                        let cin_obj = {
                            "hd:dooLk": {
                                "lock": door_state
                            }
                        }
                        var resp = keti_mobius.put_fcnt(cin_path, cin_obj);
                        console.log(resp);
                    }
                }
            }
        }
    },conf.sensor_interval);
}

function ftempval() {
    setInterval(function(){
        for (const [key, value] of Object.entries(deviceList)){
            for(let i = 0; i < value.state.length; i++){
                if(value.state[i] === "temperature") {
                    var temperature_value = zigbee.sensordata(conf.zigbee.host, key, value.state[i]);
                    if (last_temperature != temperature_value){
                        last_temperature = temperature_value;
                        let cin_path = conf.ae.parent + "/" + conf.ae.name+"/" + value.linked + "/temperature";
                        let cin_obj = {
                            "hd:tempe": {
                                "curT0": temperature_value
                            }
                        }
                        var resp = keti_mobius.put_fcnt(cin_path, cin_obj);
                        console.log(resp);
                    }
                }
            }
        }
    },conf.sensor_interval);
}

function fswstate() {
    setInterval(function(){
        for (const [key, value] of Object.entries(deviceList)){
            for(let i = 0; i < value.state.length; i++){
                if(value.state[i] === "buttonevent") {
                    var switch_state = zigbee.sensordata(conf.zigbee.host, key, value.state[i]);
                    if (last_switch_state != switch_state){
                        last_switch_state = switch_state;
                        let cin_path = conf.ae.parent + "/" + conf.ae.name+"/" + value.linked + "/binarySwitch";
                        let cin_obj = {
                            "hd:binSh":{
                                "powerSe": switch_state
                            }
                        }
                        var resp = keti_mobius.put_fcnt(cin_path, cin_obj);
                        console.log(resp);
                    }
                }
            }
        }
    },conf.sensor_interval);
}

function flight_faultDetection() {
    setInterval(function(){
        for (const [key, value] of Object.entries(bulbList)){
            for(let i = 0; i < value.state.length; i++){
                if(value.state[i] === "reachable") {
                    var light_faultDetection = zigbee.lightdata(conf.zigbee.host, key, value.state[i]);
                    if (last_faultDetection != light_faultDetection){
                        last_faultDetection = light_faultDetection;
                        let cin_path = conf.ae.parent + "/" + conf.ae.name+"/" + value.linked + "/faultDetection";
                        let cin_obj = {
                            "hd:fauDn":{
                                "sus": light_faultDetection
                            }
                        }
                        var resp = keti_mobius.put_fcnt(cin_path, cin_obj);
                        console.log(resp);
                    }
                }
            }
        }
    },conf.sensor_interval);
}

function flight_saturation() {
    setInterval(function(){
        for (const [key, value] of Object.entries(bulbList)){
            for(let i = 0; i < value.state.length; i++){
                if(value.state[i] === "sat") {
                    var light_saturation = zigbee.lightdata(conf.zigbee.host, key, value.state[i]);
                    if (last_saturation != light_saturation){
                        last_saturation = light_saturation;
                        let cin_path = conf.ae.parent + "/" + conf.ae.name+"/" + value.linked + "/colourSaturation";
                        let cin_obj = {
                            "hd:colSn":{
                                "colSn": light_saturation
                            }
                        }
                        var resp = keti_mobius.put_fcnt(cin_path, cin_obj);
                        console.log(resp);
                    }
                }
            }
        }
    },conf.sensor_interval);
}

function flight_brightness() {
    setInterval(function(){
        for (const [key, value] of Object.entries(bulbList)){
            for(let i = 0; i < value.state.length; i++){
                if(value.state[i] === "bri") {
                    var light_bri = zigbee.lightdata(conf.zigbee.host, key, value.state[i]);
                    if (last_brightness != light_bri){
                        last_brightness = light_bri;
                        let cin_path = conf.ae.parent + "/" + conf.ae.name+"/" + value.linked + "/brightness";
                        let cin_obj = {
                            "hd:colSn":{
                                "colSn": light_bri
                            }
                        }
                        var resp = keti_mobius.put_fcnt(cin_path, cin_obj);
                        console.log(resp);
                    }
                }
            }
        }
    },conf.sensor_interval);
}

function flight_rgbcolor() {
    setInterval(function(){
        for (const [key, value] of Object.entries(bulbList)){
            for(let i = 0; i < value.state.length; i++){
                if(value.state[i] === "xy") {
                    let red = zigbee.xyBriToRgb("red", key);
                    let green = zigbee.xyBriToRgb("green", key);
                    let blue = zigbee.xyBriToRgb("blue", key);
                    if (last_redcolor != red || last_greencolor != green || last_bluecolor != blue){
                        last_redcolor = red;
                        last_greencolor = green;
                        last_bluecolor = blue;
                        let cin_path = conf.ae.parent + "/" + conf.ae.name+"/" + value.linked + "/colour";
                        let cin_obj = {
                            "hd:color":{
                                "red": red,
                                "green": green,
                                "blue": blue
                            }
                        }
                        var resp = keti_mobius.put_fcnt(cin_path, cin_obj);
                        console.log(resp);
                    }
                }
            }
        }
    },conf.sensor_interval);
}

//============================= resource init =============================
function init_resource(){
    var ae_obj ={
        "m2m:ae":{
            "api": conf.ae.id,
            "rr": true,
            "rn": conf.ae.name
        }
    };

    let ae_resp = keti_mobius.create_ae(conf.ae.parent, ae_obj);
    console.log("ae_resp: " + JSON.stringify(ae_resp));
    if(ae_resp.code == 201 || ae_resp.code == 409){
        for (const [key, value] of Object.entries(deviceClasslist)) {
            // let deviceClass_path = conf.ae.parent + "/" + conf.ae.name;
            // let deviceClass = flexcontainer_deviceClass_List[value.deviceClass]
            console.log("============================\n" + JSON.stringify(deviceClass));
            let deviceClass = {
                "m2m:fcnt":{
                    "rn": value.resourcename,
                    "cnd": value.devicecnd
                }
            };
            let deviceClass_resp = keti_mobius.create_fcnt(deviceClass_path, deviceClass);
            if (deviceClass_resp.code == 201 || deviceClass_resp.code == 409){
                console.log(value.resourcename + "_Create_Success!!");
                for (let i = 0; i < value.moduleClass.length; i++) {
                    let moduleClass_path = deviceClass_path +"/"+value.resourcename;
                    if (flexcontainer_moduleClass_List.hasOwnProperty(value.moduleClass[i])) {
                        let moduleClass = flexcontainer_moduleClass_List[value.moduleClass[i]];
                        // console.log("\n~~~~~~~~\n" + JSON.stringify(moduleClass));
                        moduleClass_resp = keti_mobius.create_fcnt(moduleClass_path, moduleClass);
                        if( moduleClass_resp.code == 201 || moduleClass_resp.code == 409){
                            console.log(value.resourcename + "/" + value.moduleClass[i] + "_Create_Success!!");
                        }
                    }
                    else
                        console.log(value.moduleClass[i] + "_moduleClass is not exist!");
                }
            }
        }

        for (const [key, value] of Object.entries(deviceList)) {
            if (value.subscription === ture) {
                let sub_path = conf.ae.parent + "/" + conf.ae.name + "/" + value.linked +"/binarySwitch";
                let sub_body = {nu:["http://" + ipe_ip.address() +":"+ ipe_port + "/" + conf.ae.id + "?ct=json"]};
                let sub_obj = {
                    "m2m:sub":
                    {
                        "rn" : "sub",
                        "enc": {"net": [1]},
                        "nu" : sub_body.nu,
                        "nct": 1
                    }
                };
                let sub_fcnt_path = sub_path+"/sub";
                let fcnt_resp = keti_mobius.retrieve_sub(sub_path);
                if (fcnt_resp.code == 200) {
                    fcnt_resp = keti_mobius.delete_res(sub_path);
                    if (fcnt_resp.code == 200) {
                        fcnt_resp = keti_mobius.create_sub(sub_fcnt_path, sub_obj);
                    }
                } 
                else if (fcnt_resp.code == 404) {
                    keti_mobius.create_sub(sub_fcnt_path, sub_obj);
                }
            }
        }

        // var sub_fcnt_path = conf.ae.parent + "/" + conf.ae.name + "/deviceLight/binarySwitch";
        // var sub_body = {nu:["http://" + ipe_ip.address() +":"+ ipe_port + "/" + conf.ae.id + "?ct=json"]};
        // // var sub_body = {nu:["http://" + "192.168.0.122:"+ ipe_port + "/" + conf.ae.id + "?ct=json"]};
        // var sub_obj = {
        //     "m2m:sub":
        //     {
        //         "rn" : "sub",
        //         "enc": {"net": [1]},
        //         "nu" : sub_body.nu,
        //         "nct": 1
        //     }
        // };
        // var sub_path = sub_fcnt_path+"/"+"sub";
        // var resp_sub = keti_mobius.retrieve_sub(sub_path);
        // if (resp_sub.code == 200) {
        //     resp_sub = keti_mobius.delete_res(sub_path);
        //     if (resp_sub.code == 200) {
        //         resp_sub = keti_mobius.create_sub(sub_fcnt_path, sub_obj);
        //     }
        // } 
        // else if (resp_sub.code == 404) {
        //     keti_mobius.create_sub(sub_fcnt_path, sub_obj);
        // }
    }
    devicebattery();
    fdoorstate();
    fswstate();
    ftempval();
    flight_faultDetection();
    flight_saturation();
    flight_rgbcolor();
    flight_brightness();
}
setTimeout(init_resource,1000);

app.use(bodyParser.json());
app.listen(ipe_port, function () {
    console.log("AE Notification listening on: " + ipe_ip.address() +":"+ ipe_port);
});

app.post("/"+conf.ae.id, function (req, res) {
    console.log("$..req.body: " + JSON.stringify(req.body, null, 2));
    var req_body = req.body;
    var bulbNUM = JSONPath("$..sur", req_body);
    console.log("//////////////////////////////////////"+bulbNUM)

    var command = JSONPath("$..powerSe", req_body)[0];
    console.log("\n=======================\n" + "User command: " + command);
    if(command == true) {
        zigbee.lighton(conf.zigbee.host, 2);
    }
    else if(command == false) {
        zigbee.lightoff(conf.zigbee.host, 2);
    }
    res.sendStatus(200);
});