var device_body = require("./Device_body.js");

exports.DeviceBody = function (devicetype, deviceval) {
    if (devicetype == "temperature") {
        let device_obj = {
            "hd:tempe": {
                "curT0": deviceval
            }
        }
        return device_obj
    } else if (devicetype == "doorlock") {
        let device_obj = {
            "hd:dooLk": {
                "lock": deviceval
            }
        }
        return device_obj
    } else if (devicetype == "binarySwitch") {
        let device_obj = {
            "hd:binSh":{
                "powerSe": deviceval
            }
        }
        return device_obj
    } else if (devicetype == "faultDetection") {
        let device_obj = {
            "hd:fauDn":{
                "sus": deviceval
            }
        }
        return device_obj
    } else if (devicetype == "colourSaturation") {
        let device_obj = {
            "hd:colSn":{
                "colSn": deviceval
            }
        }
        return device_obj
    } else if (devicetype == "brightness") {
        let device_obj = {
            "hd:brigs":{
                "brigs": deviceval
            }
        }
        return device_obj
    } 
}