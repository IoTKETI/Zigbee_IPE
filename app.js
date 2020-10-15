const conf = require('./conf');
var zigbee = require('./zigbeeIPE');

global.conf = require('./conf.js');
var ipe_ip = require('ip');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var mobius = require('./MobiusConnector').mobius;
var keti_mobius = new mobius();
keti_mobius.set_mobius_info(conf.cse.host, conf.cse.port);

var lightNUM = 5;
var ipe_port = 4000;

let doorstate
let doorbatlvl
let temperval
let temperbatt
let swstate
let light_fault
let light_sat
let red
let green
let blue
let light_bri

function typetonum(sen){
    switch (sen){
    case 'temperature':
        return 12;
    case 'humidity':
        return 13;
    case 'pressure':
        return 14;
    case 'open':
        return 15;
    case 'buttonevent':
        return 16;
    }
}

function xyBriToRgb(cle){
    light_col = zigbee.findlight(conf.zigbee.host,lightNUM,'xy')
    x = light_col[0]
    y = light_col[1]
    bri = zigbee.findlight(conf.zigbee.host,lightNUM,'bri')
    z = 1.0 - x - y;

    Y = bri / 255.0; // Brightness of lamp
    X = (Y / y) * x;
    Z = (Y / y) * z;
    r = X * 1.612 - Y * 0.203 - Z * 0.302;
    g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    b = X * 0.026 - Y * 0.072 + Z * 0.962;
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    maxValue = Math.max(r,g,b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;

    r = r * 255;   if (r < 0) { r = 255 };
    g = g * 255;   if (g < 0) { g = 255 };
    b = b * 255;   if (b < 0) { b = 255 };

    if (cle = 'red'){
        return r
    }
    else if (cle = 'green'){
        return g
    }
    else if (cle = 'blue'){
        return b
    }
    console.log("11111 "+r,g,b)          
}

var ladoorstate = '';
function fdoorstate() {
    setInterval(function(){
        doorstate = zigbee.getsensorstate(conf.zigbee.host, typetonum('open'));
        if (ladoorstate != doorstate){
            ladoorstate = doorstate;
            if(doorstate == true){
                zigbee.lighton(conf.zigbee.host, lightNUM);
                zigbee.changebuttonstate(conf.zigbee.host,typetonum('buttonevent'), true)
            }
            if(doorstate == false){
                zigbee.lightoff(conf.zigbee.host, lightNUM);
                zigbee.changebuttonstate(conf.zigbee.host,typetonum('buttonevent'), false)
            }
            let cin_path = conf.ae.parent+'/zigbee_smarthome/deviceDoorLock/doorlock';
            let cin_obj = {
                "hd:dooLk": {
                    "lock": doorstate
                }
            }
            var resp = keti_mobius.create_fcin(cin_path, cin_obj);
            console.log(resp)
        }
    },1000);
}
var ladoorbatlvl = '';
function fdoorbat() {
    setInterval(() => {
        doorbatlvl = zigbee.getsensorbatt(conf.zigbee.host, typetonum('open'));
        if (ladoorbatlvl != doorbatlvl){
            ladoorbatlvl = doorbatlvl;
            let cin_path = conf.ae.parent+'/zigbee_smarthome/deviceDoorLock/battery';
            let cin_obj = {
                "hd:bat": {
                    "lvl": doorbatlvl
                }
            }
            var resp = keti_mobius.create_fcin(cin_path, cin_obj);
            console.log(resp)
        }
        
    },1000);
}
var latemperval = '';
function ftempval(){
    setInterval(function(){
        temperval = zigbee.getsensorstate(conf.zigbee.host, typetonum('temperature'));
        if (latemperval != temperval){
            latemperval = temperval;
            let cin_path = conf.ae.parent+'/zigbee_smarthome/deviceThermometer/temperature';
            let cin_obj = {
                "hd:tempe": {
                    "curT0": temperval
                }
            }
            var resp = keti_mobius.create_fcin(cin_path, cin_obj);
            console.log(resp)
        }
    },1000);
}
var latemperbatt = '';
function ftempbatt(){
    setInterval(function(){
        temperbatt = zigbee.getsensorbatt(conf.zigbee.host, typetonum('temperature'));
        if (latemperbatt != temperbatt){
            latemperbatt = temperbatt;
            let cin_path = conf.ae.parent+'/zigbee_smarthome/deviceThermometer/battery';
            let cin_obj = {
                "hd:bat": {
                    "lvl": temperbatt
                }
            }
            var resp = keti_mobius.create_fcin(cin_path, cin_obj);
            console.log(resp)
        }
    },1000);
}
var laswstate='';
function fswstate() {
    setInterval(function(){
        swstate = zigbee.getsensorstate(conf.zigbee.host, typetonum('buttonevent'));
        if (laswstate != swstate){
            laswstate = swstate;
            if(swstate == true){
                zigbee.lighton(conf.zigbee.host, lightNUM, true);
            }
            if(swstate == false){
                zigbee.lightoff(conf.zigbee.host, lightNUM, false);
            }
            let cin_path = conf.ae.parent+'/zigbee_smarthome/deviceLight/binarySwitch';
            let cin_obj = {
                'hd:binSh':{
                    'powerSe': swstate
                }
            }
            var resp = keti_mobius.create_fcin(cin_path, cin_obj);
            console.log(resp)
        }
    },1000);
}
var lalight_fault='';
function flight_fault() {
    setInterval(function(){
        light_fault = zigbee.findlight(conf.zigbee.host, lightNUM, 'reachable');
        if (lalight_fault != light_fault){
            lalight_fault = light_fault;
            let cin_path = conf.ae.parent+'/zigbee_smarthome/deviceLight/faultDetection';
            let cin_obj = {
                'hd:fauDn':{
                    'sus': light_fault
                }
            }
            var resp = keti_mobius.create_fcin(cin_path, cin_obj);
            console.log(resp)
        }
    },1000);
}
var lalight_sat='';
function flight_sat() {
    setInterval(function(){
        light_sat =  zigbee.findlight(conf.zigbee.host, lightNUM, 'sat');
        if (lalight_sat != light_sat){
            lalight_sat = light_sat;
            let cin_path = conf.ae.parent+'/zigbee_smarthome/deviceLight/colourSaturation';
            let cin_obj = {
                'hd:colSn':{
                    'colSn': light_sat
                }
            }
            var resp = keti_mobius.create_fcin(cin_path, cin_obj);
            console.log(resp)
        }
    },1000);
}
var lared='';
        var lagreen='';
        var lablue='';
function flight_rgb() {
    setInterval(function(){
        red = xyBriToRgb('red');
        green = xyBriToRgb('green');
        blue = xyBriToRgb('blue');
        if (lared != red || lagreen != green || lablue != blue){
            lared = red;
            lagreen = green;
            lablue = blue;
            let cin_path = conf.ae.parent+'/zigbee_smarthome/deviceLight/colour';
            let cin_obj = {
                'hd:color':{
                    'red': red,
                    'green': green,
                    'blue': blue
                }
            }
            var resp = keti_mobius.create_fcin(cin_path, cin_obj);
            console.log(resp)
        }
    },1000);
}
var lalight_bri='';
function flight_bri() {
    setInterval(function(){
        light_bri = zigbee.findlight(conf.zigbee.host, lightNUM, 'bri')
        if (lalight_bri != light_bri){
            lalight_bri = light_bri;
            let cin_path = conf.ae.parent+'/zigbee_smarthome/deviceLight/colourSaturation';
            let cin_obj = {
                'hd:brigs':{
                    'brigs': light_bri
                    }
            }
            var resp = keti_mobius.create_fcin(cin_path, cin_obj);
            console.log(resp)
        }
    },1000);
}



function init_resource(){
    var ae_obj ={
        'm2m:ae':{
            'api': conf.ae.id,
            'rr': true,
            'rn': conf.ae.name
        }
    };

    var ae_resp = keti_mobius.create_ae(conf.ae.parent, ae_obj);
    console.log("ae_resp: " + ae_resp);
    if(ae_resp.code == 201 || ae_resp.code == 409){
        var cnt_parent_path = conf.ae.parent + '/' + conf.ae.name;
        var deviceDoorLock = {
            'm2m:fcnt':{
                'rn': 'deviceDoorLock',
                "cnd": 'org.onem2m.home.device.deviceDoorLock'
            }
        };
        var cnt_resp = keti_mobius.create_fcnt(cnt_parent_path, deviceDoorLock);
        if (cnt_resp.code == 201 || cnt_resp.code == 409){
            var cnt2_parent_path = cnt_parent_path +'/'+ 'deviceDoorLock';
            let doorlock = {
                'hd:dooLk':{
                    'rn': 'doorlock',
                    'cnd': 'org.onem2m.home.moduleclass.doorlock',
                    'lock': doorstate
                }
            };
            let battery = {
                'hd:bat':{
                    'rn' : 'battery',
                    'cnd': 'org.onem2m.home.moduleclass.battery',
                    'lvl': doorbatlvl
                }
            };
            cnt_resp = keti_mobius.create_fcnt(cnt2_parent_path, doorlock);

            if( cnt_resp.code == 201 || cnt_resp.code == 409){
                cnt_resp = keti_mobius.create_fcnt(cnt2_parent_path, battery);
                if( cnt_resp.code == 201 || cnt_resp.code == 409 ){
                    console.log('deviceDoorLock' + " CNT_Complete!!");
                }
            }
        }
        var deviceThermometer = {
            'm2m:fcnt':{
                'rn': 'deviceThermometer',
                "cnd": 'org.onem2m.home.device.deviceThermometer'
            }
        };
        var cnt_resp = keti_mobius.create_fcnt(cnt_parent_path, deviceThermometer);
        if (cnt_resp.code == 201 || cnt_resp.code == 409){
            var cnt2_parent_path = cnt_parent_path +'/'+ 'deviceThermometer';
            var temperature = {
                'hd:tempe':{
                    'rn': 'temperature',
                    'cnd': "org.onem2m.home.moduleclass.temperature",
                    'curT0': temperval
                }
            };
            let battery = {
                'hd:bat':{
                    'rn' : 'battery',
                    'cnd': 'org.onem2m.home.moduleclass.battery',
                    'lvl': temperbatt
                }
            };
            cnt_resp = keti_mobius.create_fcnt(cnt2_parent_path, temperature);

            if( cnt_resp.code == 201 || cnt_resp.code == 409){
                cnt_resp = keti_mobius.create_fcnt(cnt2_parent_path, battery);
                if( cnt_resp.code == 201 || cnt_resp.code == 409 ){
                    console.log('deviceThermometer' + " CNT_Complete!!");
                }
            }
        }
        var deviceThermometer = {
            'm2m:fcnt':{
                'rn': 'deviceLight',
                'cnd': 'org.onem2m.home.device.deviceLight'
            }
        };
        var cnt_resp = keti_mobius.create_fcnt(cnt_parent_path, deviceThermometer);
        if (cnt_resp.code == 201 || cnt_resp.code == 409){
            var cnt2_parent_path = cnt_parent_path +'/'+ 'deviceLight';
            var binarySwitch = {
                'hd:binSh':{
                    'rn': "binarySwitch",
                    'cnd': "org.onem2m.home.moduleclass.binarySwitch",
                    'powerSe': swstate
                }
            };
            var faultDetection = {
                'hd:fauDn':{
                    'rn': "faultDetection",
                    'cnd': "org.onem2m.home.moduleclass.faultDetection",
                    'sus': light_fault
                }
            };
            var colourSaturation = {
                'hd:colSn':{
                    'rn': "colourSaturation",
                    'cnd': "org.onem2m.home.moduleclass.colourSaturation",
                    'colSn': light_sat
                }
            };
            var colour = {
                'hd:color':{
                    'rn': "colour",
                    'cnd': "org.onem2m.home.moduleclass.colour",
                    'red': xyBriToRgb('red'),
                    'green': xyBriToRgb('green'),
                    'blue': xyBriToRgb('blue')
                }
            };
            var brightness = {
                'hd:brigs':{
                'rn' : "brightness",
                'cnd': "org.onem2m.home.moduleclass.brightness",
                'brigs': light_bri
                }
            };
            cnt_resp = keti_mobius.create_fcnt(cnt2_parent_path, binarySwitch);
            if( cnt_resp.code == 201 || cnt_resp.code == 409){
                cnt_resp = keti_mobius.create_fcnt(cnt2_parent_path, faultDetection);
                if( cnt_resp.code == 201 || cnt_resp.code == 409 ){
                    cnt_resp = keti_mobius.create_fcnt(cnt2_parent_path, colourSaturation);
                    if( cnt_resp.code == 201 || cnt_resp.code == 409 ){
                        cnt_resp = keti_mobius.create_fcnt(cnt2_parent_path, colour);
                        if( cnt_resp.code == 201 || cnt_resp.code == 409 ){
                            cnt_resp = keti_mobius.create_fcnt(cnt2_parent_path, brightness);
                            if( cnt_resp.code == 201 || cnt_resp.code == 409 ){
                                console.log('deviceLight' + " CNT_Complete!!");
                            }
                        }
                    }
                }
            }
        }
        
        var sub_fcnt_path = conf.ae.parent + '/' + conf.ae.name + '/deviceLight';
        var sub_body = {nu:['http://' + ipe_ip.address() +':'+ ipe_port + '/' + conf.ae.id + '?ct=json']};
        var sub_obj = {
            'm2m:sub':
            {
                'rn' : "sub",
                'enc': {'net': [1]},
                'nu' : sub_body.nu,
                'nct': 2
            }
        };
        var sub_path = sub_fcnt_path+'/'+'sub';
        var resp_sub = keti_mobius.retrieve_sub(sub_path);
        if (resp_sub.code == 200) {
            resp_sub = keti_mobius.delete_res(sub_path);
            if (resp_sub.code == 200) {
                resp_sub = keti_mobius.create_sub(sub_fcnt_path, sub_obj);
            }
        } 
        else if (resp_sub.code == 404) {
            keti_mobius.create_sub(sub_fcnt_path, sub_obj);
        }
    }

    fdoorstate();
    fswstate();
    fdoorbat();
    ftempval();
    ftempbatt();
    flight_fault();
    flight_sat();
    flight_rgb();
    flight_bri();
}

setTimeout(init_resource,100);

app.use(bodyParser.json());
app.listen(ipe_port, function () {
    console.log("AE Notification listening on: " + ipe_ip.address() +':'+ ipe_port);
});

app.post("/"+conf.ae.id, function (req, res) {
    console.log(req.body);
    var req_body = req.body["m2m:sgn"].nev.rep["hd:binSh"].powerSe;
    console.log("======================="+req_body)
    if(req_body == true) {
        zigbee.lighton(conf.zigbee.host, lightNUM, true);
    }
    else if(req_body == false) {
        zigbee.lightoff(conf.zigbee.host, lightNUM, false);
    }
    res.sendStatus(200);
});