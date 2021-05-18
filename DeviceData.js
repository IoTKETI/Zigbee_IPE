let deconz = require("./deconzAPI.js");
let fs = require("fs");
let ipeConfig = JSON.parse(fs.readFileSync("./config/IPE_configuration.json","utf-8"));
let resourceConfig = JSON.parse(fs.readFileSync("./config/Resource_configuration.json", "utf-8"));
let zigbeeADN = require("./ZigbeeADN.js").mobius;
let KETIMobius = new zigbeeADN();
const GATEWAY_ADDRESS = ipeConfig.zigbeeGateway.ip;
const CSE_NAME = ipeConfig.hostingCSE.resourceName;
const IPE_RESOURCE_NAME = ipeConfig.ipe.resourceName;

const Last_battery_level = new Map();
const Last_door_state = new Map();
const Last_temperature_level = new Map();
const Last_switch_state = new Map();
const Last_faultDetection_state = new Map();
const Last_saturation_value = new Map();
const Last_brightness_value = new Map();
const Last_red_color_value = new Map();
const Last_green_color_value = new Map();
const Last_blue_color_value = new Map();
const Last_onoff_state = new Map();

// ==========================  device data ==========================
exports.device_data = function() {

    this.init_device_battery = function(){
        for (const [key, value] of Object.entries(resourceConfig)){
            for (let i = 0; i < value.length ; i++) {
                if (value[i].deconzResource.battery == true) {
                    let device_battery =  deconz.sensorbatt(GATEWAY_ADDRESS, value[i].deconzId);
                    Last_battery_level.set(value[i].oneM2MResource.deviceResourceName, device_battery);
                    let device_batt_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME + "/"+ value[i].oneM2MResource.deviceResourceName + "/battery";
                    let device_batt_resp = KETIMobius.put_fcnt(device_batt_path, key, "battery", device_battery); 
                    console.log(device_batt_resp);
                }
            }
        }
    }

    this.get_device_battery = function() {
        setInterval(function(){
            for (const [key, value] of Object.entries(resourceConfig)){
                for (let i = 0; i < value.length ; i++) {
                    if (value[i].deconzResource.battery == true) {
                        let device_battery =  deconz.sensorbatt(GATEWAY_ADDRESS, value[i].deconzId);
                        if (Last_battery_level.get(value[i].oneM2MResource.deviceResourceName) != device_battery) {
                            Last_battery_level.set(value[i].oneM2MResource.deviceResourceName, device_battery);
                            let device_batt_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME + "/"+ value[i].oneM2MResource.deviceResourceName + "/battery";
                            let device_batt_resp = KETIMobius.put_fcnt(device_batt_path, key, "battery", device_battery); 
                            console.log(device_batt_resp);
                        }
                    }
                }
            }
        },ipeConfig.zigbeeGateway.sensingInterval);
    }

    this.init_device_doorstate = function() {
        for (const [key, value] of Object.entries(resourceConfig)){
            for(let i = 0; i < value.length; i++){
                for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                    if(value[i].deconzResource.state[j] === "open") {
                        let door_state = deconz.sensordata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                        Last_door_state.set(value[i].oneM2MResource.deviceResourceName, door_state);
                        let device_door_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME + "/"+ value[i].oneM2MResource.deviceResourceName + "/doorlock";
                        let device_door_resp = KETIMobius.put_fcnt(device_door_path, key, "doorlock" ,door_state); 
                        console.log(device_door_resp);
                    }
                }
            }
        }
    }

    this.get_device_doorstate = function() {
        setInterval(function(){
            for (const [key, value] of Object.entries(resourceConfig)){
                for(let i = 0; i < value.length; i++){
                    for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                        if(value[i].deconzResource.state[j] === "open") {
                            let door_state = deconz.sensordata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                            if (Last_door_state.get(value[i].oneM2MResource.deviceResourceName) != door_state){
                                Last_door_state.set(value[i].oneM2MResource.deviceResourceName, door_state);
                                let device_door_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME + "/"+ value[i].oneM2MResource.deviceResourceName + "/doorlock";
                                let device_door_resp = KETIMobius.put_fcnt(device_door_path, key, "doorlock" ,door_state); 
                                console.log(device_door_resp);
                            }
                        }
                    }
                }
            }
        },ipeConfig.zigbeeGateway.sensingInterval);
    }

    this.init_device_temperature = function() {
        for (const [key, value] of Object.entries(resourceConfig)){
            for(let i = 0; i < value.length; i++){
                for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                    if(value[i].deconzResource.state[j] === "temperature") {
                        let temperature_value = deconz.sensordata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                        Last_temperature_level.set(value[i].oneM2MResource.deviceResourceName, temperature_value);
                        let device_temperature_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/temperature"
                        let device_temperature_value_resp = KETIMobius.put_fcnt(device_temperature_value_path, key, "temperature", temperature_value); 
                        console.log(device_temperature_value_resp);
                    }
                }
            }
        }
    }

    this.get_device_temperature = function() {
        setInterval(function(){
            for (const [key, value] of Object.entries(resourceConfig)){
                for(let i = 0; i < value.length; i++){
                    for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                        if(value[i].deconzResource.state[j] === "temperature") {
                            let temperature_value = deconz.sensordata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                            if (Last_temperature_level.get(value[i].oneM2MResource.deviceResourceName) != temperature_value){
                                Last_temperature_level.set(value[i].oneM2MResource.deviceResourceName, temperature_value);
                                let device_temperature_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/temperature"
                                let device_temperature_value_resp = KETIMobius.put_fcnt(device_temperature_value_path, key, "temperature", temperature_value); 
                                console.log(device_temperature_value_resp);
                            }
                        }
                    }
                }
            }
        },ipeConfig.zigbeeGateway.sensingInterval);
    }

    this.init_device_switch_state = function() {
        for (const [key, value] of Object.entries(resourceConfig)){
            for(let i = 0; i < value.length; i++){
                for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                    if(value[i].deconzResource.state[j] === "buttonevent") {
                        let switch_state = deconz.sensordata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                        Last_switch_state.set(value[i].oneM2MResource.deviceResourceName, switch_state);
                        let device_switch_state_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/binarySwitch"
                        let device_switch_state_resp = KETIMobius.put_fcnt(device_switch_state_path, key, "binarySwitch", switch_state); 
                        console.log(device_switch_state_resp);
                    }
                }
            }
        }
    }

    this.get_device_switch_state = function() {
        setInterval(function(){
            for (const [key, value] of Object.entries(resourceConfig)){
                for(let i = 0; i < value.length; i++){
                    for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                        if(value[i].deconzResource.state[j] === "buttonevent") {
                            let switch_state = deconz.sensordata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                            if (Last_switch_state.get(value[i].oneM2MResource.deviceResourceName) != switch_state){
                                Last_switch_state.set(value[i].oneM2MResource.deviceResourceName, switch_state);

                                if(switch_state == true){ // You can set commands according to the state of the switch.
                                    deconz.lighton(GATEWAY_ADDRESS, 2);
                                }
                                else if(switch_state == false){
                                    deconz.lightoff(GATEWAY_ADDRESS, 2);
                                }
                                let device_switch_state_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/binarySwitch"
                                let device_switch_state_resp = KETIMobius.put_fcnt(device_switch_state_path, key, "binarySwitch", switch_state); 
                                console.log(device_switch_state_resp);
                            }
                        }
                    }
                }
            }
        },ipeConfig.zigbeeGateway.sensingInterval);
    }

    this.init_bulb_faultDetection = function() {
        for (const [key, value] of Object.entries(resourceConfig)){
            for(let i = 0; i < value.length; i++){
                for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                    if(value[i].deconzResource.state[j] === "reachable") {
                        let bulb_faultDetection = deconz.lightdata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                        Last_faultDetection_state.set(value[i].oneM2MResource.deviceResourceName, bulb_faultDetection);
                        let bulb_faultDetection_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/faultDetection"
                        let bulb_faultDetection_value_resp = KETIMobius.put_fcnt(bulb_faultDetection_value_path, key, "faultDetection", bulb_faultDetection); 
                        console.log(bulb_faultDetection_value_resp);
                    }
                }
            }
        }
    }

    this.get_bulb_faultDetection = function() {
        setInterval(function(){
            for (const [key, value] of Object.entries(resourceConfig)){
                for(let i = 0; i < value.length; i++){
                    for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                        if(value[i].deconzResource.state[j] === "reachable") {
                            let bulb_faultDetection = deconz.lightdata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                            if (Last_faultDetection_state.get(value[i].oneM2MResource.deviceResourceName) != bulb_faultDetection){
                                Last_faultDetection_state.set(value[i].oneM2MResource.deviceResourceName, bulb_faultDetection);
                                let bulb_faultDetection_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/faultDetection"
                                let bulb_faultDetection_value_resp = KETIMobius.put_fcnt(bulb_faultDetection_value_path, key, "faultDetection", bulb_faultDetection); 
                                console.log(bulb_faultDetection_value_resp);
                            }
                        }
                    }
                }
            }
        },ipeConfig.zigbeeGateway.sensingInterval);
    }

    this.init_bulb_saturation = function() {
        for (const [key, value] of Object.entries(resourceConfig)){
            for(let i = 0; i < value.length; i++){
                for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                    if(value[i].deconzResource.state[j] === "sat") {
                        let bulb_saturation = deconz.lightdata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                        Last_saturation_value.set(value[i].oneM2MResource.deviceResourceName, bulb_saturation);
                        let bulb_saturation_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/colourSaturation"
                        let bulb_saturation_value_resp = KETIMobius.put_fcnt(bulb_saturation_value_path, key, "colourSaturation", bulb_saturation); 
                        console.log(bulb_saturation_value_resp);
                    }
                }
            }
        }
    }

    this.get_bulb_saturation = function() {
        setInterval(function(){
            for (const [key, value] of Object.entries(resourceConfig)){
                for(let i = 0; i < value.length; i++){
                    for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                        if(value[i].deconzResource.state[j] === "sat") {
                            let bulb_saturation = deconz.lightdata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                            if (Last_saturation_value.get(value[i].oneM2MResource.deviceResourceName) != bulb_saturation){
                                Last_saturation_value.set(value[i].oneM2MResource.deviceResourceName, bulb_saturation);
                                let bulb_saturation_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/colourSaturation"
                                let bulb_saturation_value_resp = KETIMobius.put_fcnt(bulb_saturation_value_path, key, "colourSaturation", bulb_saturation); 
                                console.log(bulb_saturation_value_resp);
                            }
                        }
                    }
                }
            }
        },ipeConfig.zigbeeGateway.sensingInterval);
    }

    this.init_bulb_brightness = function() {
        for (const [key, value] of Object.entries(resourceConfig)){
            for(let i = 0; i < value.length; i++){
                for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                    if(value[i].deconzResource.state[j] === "bri") {
                        let bulb_bri = deconz.lightdata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                        Last_brightness_value.set(value[i].oneM2MResource.deviceResourceName, bulb_bri);
                        let bulb_brightness_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/brightness"
                        let bulb_brightness_value_resp = KETIMobius.put_fcnt(bulb_brightness_value_path, key, "brightness", bulb_bri); 
                        console.log(bulb_brightness_value_resp);
                    }
                }
            }
        }
    }

    this.get_bulb_brightness = function() {
        setInterval(function(){
            for (const [key, value] of Object.entries(resourceConfig)){
                for(let i = 0; i < value.length; i++){
                    for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                        if(value[i].deconzResource.state[j] === "bri") {
                            let bulb_bri = deconz.lightdata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                            if (Last_brightness_value.get(value[i].oneM2MResource.deviceResourceName) != bulb_bri){
                                Last_brightness_value.set(value[i].oneM2MResource.deviceResourceName, bulb_bri);
                                let bulb_brightness_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/brightness"
                                let bulb_brightness_value_resp = KETIMobius.put_fcnt(bulb_brightness_value_path, key, "brightness", bulb_bri); 
                                console.log(bulb_brightness_value_resp);
                            }
                        }
                    }
                }
            }
        },ipeConfig.zigbeeGateway.sensingInterval);
    }

    this.init_bulb_rgbcolor = function() {
        for (const [key, value] of Object.entries(resourceConfig)){
            for(let i = 0; i < value.length; i++){
                for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                    if(value[i].deconzResource.state[j] === "xy") {
                        let red = deconz.xyTorgb("red", value[i].deconzId);
                        let green = deconz.xyTorgb("green", value[i].deconzId);
                        let blue = deconz.xyTorgb("blue", value[i].deconzId);
                        Last_red_color_value.set(value[i].oneM2MResource.deviceResourceName, red);
                        Last_green_color_value.set(value[i].oneM2MResource.deviceResourceName, green);
                        Last_blue_color_value.set(value[i].oneM2MResource.deviceResourceName, blue);
                        let bulb_color = [red, green, blue];
                        let bulb_color_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/colour"
                        let bulb_color_value_resp = KETIMobius.put_fcnt(bulb_color_value_path, key, "colour", bulb_color); 
                        console.log(bulb_color_value_resp);
                    }
                }
            }
        }
    }

    this.get_bulb_rgbcolor = function() {
        setInterval(function(){
            for (const [key, value] of Object.entries(resourceConfig)){
                for(let i = 0; i < value.length; i++){
                    for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                        if(value[i].deconzResource.state[j] === "xy") {
                            let red = deconz.xyTorgb("red", value[i].deconzId);
                            let green = deconz.xyTorgb("green", value[i].deconzId);
                            let blue = deconz.xyTorgb("blue", value[i].deconzId);
                            if (Last_red_color_value.get(value[i].oneM2MResource.deviceResourceName) != red || Last_green_color_value.get(value[i].oneM2MResource.deviceResourceName) != green || Last_blue_color_value.get(value[i].oneM2MResource.deviceResourceName) != blue){
                                Last_red_color_value.set(value[i].oneM2MResource.deviceResourceName, red);
                                Last_green_color_value.set(value[i].oneM2MResource.deviceResourceName, green);
                                Last_blue_color_value.set(value[i].oneM2MResource.deviceResourceName, blue);
                                let bulb_color = [red, green, blue];
                                let bulb_color_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/colour"
                                let bulb_color_value_resp = KETIMobius.put_fcnt(bulb_color_value_path, key, "colour", bulb_color); 
                                console.log(bulb_color_value_resp);
                            }
                        }
                    }
                }
            }
        },ipeConfig.zigbeeGateway.sensingInterval);
    }

    this.init_bulb_onstate = function() {
        for (const [key, value] of Object.entries(resourceConfig)){
            for(let i = 0; i < value.length; i++){
                for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                    if(value[i].deconzResource.state[j] === "on") {
                        let onstate = deconz.lightdata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                        Last_onoff_state.set(value[i].oneM2MResource.deviceResourceName, onstate);
                        let bulb_onstate_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/binarySwitch"
                        let bulb_onstate_value_resp = KETIMobius.put_fcnt(bulb_onstate_value_path, key, "on", onstate); 
                        console.log(bulb_onstate_value_resp);
                    }
                }
            }
        }
    }

    this.get_bulb_onstate = function() {
        setInterval(function(){
            for (const [key, value] of Object.entries(resourceConfig)){
                for(let i = 0; i < value.length; i++){
                    for(let j = 0; j < value[i].deconzResource.state.length; j++) {
                        if(value[i].deconzResource.state[j] === "on") {
                            let onstate = deconz.lightdata(GATEWAY_ADDRESS, value[i].deconzId, value[i].deconzResource.state[j]);
                            if (Last_onoff_state.get(value[i].oneM2MResource.deviceResourceName) != onstate){
                                Last_onoff_state.set(value[i].oneM2MResource.deviceResourceName, onstate);
                                let bulb_onstate_value_path = "/" + CSE_NAME + "/" + IPE_RESOURCE_NAME+"/" + value[i].oneM2MResource.deviceResourceName + "/binarySwitch"
                                let bulb_onstate_value_resp = KETIMobius.put_fcnt(bulb_onstate_value_path, key, "on", onstate); 
                                console.log(bulb_onstate_value_resp);
                            }
                        }
                    }
                }
            }
        },ipeConfig.zigbeeGateway.sensingInterval);
    }
}
//==========================================================================================================