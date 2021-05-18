let request = require('sync-request');
let uuid = require('uuidv1');
let http = require('http');
let fs = require("fs");
let ipeConfig = JSON.parse(fs.readFileSync("./config/IPE_configuration.json","utf-8"));
const HOSTING_CSE_IP = ipeConfig.hostingCSE.ip;
const HOSTING_CSE_PORT = ipeConfig.hostingCSE.port;
const AE_ID = ipeConfig.ipe.id;

exports.mobius = function () {

    let mobius_ip = HOSTING_CSE_IP;
    let mobius_port = HOSTING_CSE_PORT;
    let ae_id = AE_ID;

    this.create_ae = function (path, rn, api, rr) {
        let ae ={};
        let url = 'http://' + mobius_ip + ':' + mobius_port + path;

        ae["m2m:ae"] = {};
        ae["m2m:ae"].api = api;
        ae["m2m:ae"].rn = rn;
        ae["m2m:ae"].rr = true;

        console.log('create ae: POST -> ' + url);

        let resp = request('POST', url, {
            'headers': {
                'Accept': 'application/json',
                'X-M2M-RI': uuid(),
                'X-M2M-Origin': ae_id,
                'Content-Type': 'application/json;ty=2;'
            },
            'body': JSON.stringify(ae)
        });

        let status_code = resp.statusCode;
        let str = '';
        try {
            str = String(resp.getBody());
        } catch (err) {
            str = String(err.body);
            //console.error(err);
        }
        let data = {'code': status_code, 'body': str};

        console.log('create ae: ' + status_code + ' <- ' + str);

        return data;
    };

    //----------------flex container---------------------------
    this.create_device_fcnt = function (path, rn, cnd) {
        let fcnt ={};
        let url = 'http://' + mobius_ip + ':' + mobius_port + path;

        console.log('create fcnt: POST -> ' + url);

        let dev_clscnd =  "org.onem2m.home.device." + cnd;
        fcnt["m2m:fcnt"] = {};
        fcnt["m2m:fcnt"].rn = rn;
        fcnt["m2m:fcnt"].cnd = dev_clscnd;

        let resp = request('POST', url, {
            'headers': {
                'Accept': 'application/json',
                'X-M2M-RI': uuid(),
                'X-M2M-Origin': ae_id,
                'Content-Type': 'application/json;ty=28;'
            },
            'body': JSON.stringify(fcnt)
        });

        let status_code = resp.statusCode;
        let str = '';
        try {
            str = String(resp.getBody());
        } catch (err) {
            str = String(err.body);
            //console.error(err);
        }
        let data = {'code': status_code, 'body': str};

        console.log('create cnt: ' + status_code + ' <- ' + str);

        return data;
    };

    this.create_module_fcnt = function (path, rn) {
        let fcnt_mod ={};
        let head = "";
        let mod_clscnd = "";
        let url = 'http://' + mobius_ip + ':' + mobius_port + path;

        console.log('create fcnt: POST -> ' + url);

        mod_clscnd =  "org.onem2m.home.moduleclass." + rn;
        if(rn === "battery"){
            fcnt_mod["hd:bat"] = {};
            fcnt_mod["hd:bat"].rn = rn;
            fcnt_mod["hd:bat"].cnd = mod_clscnd;
            fcnt_mod["hd:bat"].lvl = 100; 
        }
        else if(rn === "temperature"){
            fcnt_mod["hd:tempe"] = {};
            fcnt_mod["hd:tempe"].rn = rn;
            fcnt_mod["hd:tempe"].cnd = mod_clscnd;
            fcnt_mod["hd:tempe"].curT0 = 3870; 
        }
        else if(rn === "doorlock"){
            fcnt_mod["hd:dooLk"] = {};
            fcnt_mod["hd:dooLk"].rn = rn;
            fcnt_mod["hd:dooLk"].cnd = mod_clscnd;
            fcnt_mod["hd:dooLk"].lock = true; 
        }
        else if(rn === "binarySwitch"){
            fcnt_mod["hd:binSh"] = {};
            fcnt_mod["hd:binSh"].rn = rn;
            fcnt_mod["hd:binSh"].cnd = mod_clscnd;
            fcnt_mod["hd:binSh"].powerSe = true; 
        }
        else if(rn === "faultDetection"){
            fcnt_mod["hd:fauDn"] = {};
            fcnt_mod["hd:fauDn"].rn = rn;
            fcnt_mod["hd:fauDn"].cnd = mod_clscnd;
            fcnt_mod["hd:fauDn"].sus = true; 
        }
        else if(rn === "colourSaturation"){
            fcnt_mod["hd:colSn"] = {};
            fcnt_mod["hd:colSn"].rn = rn;
            fcnt_mod["hd:colSn"].cnd = mod_clscnd;
            fcnt_mod["hd:colSn"].colSn = 0; 
        }
        else if(rn === "colour"){
            fcnt_mod["hd:color"] = {};
            fcnt_mod["hd:color"].rn = rn;
            fcnt_mod["hd:color"].cnd = mod_clscnd;
            fcnt_mod["hd:color"].red = 0; 
            fcnt_mod["hd:color"].green = 0; 
            fcnt_mod["hd:color"].blue = 0;
        }
        else if(rn === "brightness"){
            fcnt_mod["hd:brigs"] = {};
            fcnt_mod["hd:brigs"].rn = rn;
            fcnt_mod["hd:brigs"].cnd = mod_clscnd;
            fcnt_mod["hd:brigs"].brigs = 100; 
        }
        else{
            console.log("MODULE CLASS is not exist");
        }

        let resp = request('POST', url, {
            'headers': {
                'Accept': 'application/json',
                'X-M2M-RI': uuid(),
                'X-M2M-Origin': ae_id,
                'Content-Type': 'application/json;ty=28;'
            },
            'body': JSON.stringify(fcnt_mod)
        });

        let status_code = resp.statusCode;
        let str = '';
        try {
            str = String(resp.getBody());
        } catch (err) {
            str = String(err.body);
            //console.error(err);
        }
        let data = {'code': status_code, 'body': str};

        console.log('create cnt: ' + status_code + ' <- ' + str);

        return data;
    };

    this.put_fcnt = function (path, dev_kinds, rn, value) {
        let fcnt_mod ={};
        let url = 'http://' + mobius_ip + ':' + mobius_port + path;

        console.log('create cin: PUT -> ' + url);
        if(dev_kinds === "device"){
            if(rn === "battery"){
                fcnt_mod["hd:bat"] = {};
                fcnt_mod["hd:bat"].lvl = value; 
            }
            else if(rn === "temperature"){
                fcnt_mod["hd:tempe"] = {};
                fcnt_mod["hd:tempe"].curT0 = value; 
            }
            else if(rn === "doorlock"){
                fcnt_mod["hd:dooLk"] = {};
                fcnt_mod["hd:dooLk"].lock = value; 
            }
            else if(rn === "binarySwitch"){
                fcnt_mod["hd:binSh"] = {};
                fcnt_mod["hd:binSh"].powerSe = value; 
            }
            else{
                console.log("MODULE CLASS is not exist");
            }
        }
        else{
            if(rn === "faultDetection"){
                fcnt_mod["hd:fauDn"] = {};
                fcnt_mod["hd:fauDn"].sus = value; 
            }
            else if(rn === "colourSaturation"){
                fcnt_mod["hd:colSn"] = {};
                fcnt_mod["hd:colSn"].colSn = value; 
            }
            else if(rn === "colour"){
                fcnt_mod["hd:color"] = {};
                fcnt_mod["hd:color"].red = value[0]; 
                fcnt_mod["hd:color"].green = value[1]; 
                fcnt_mod["hd:color"].blue = value[2];
            }
            else if(rn === "brightness"){
                fcnt_mod["hd:brigs"] = {};
                fcnt_mod["hd:brigs"].brigs = value; 
            }
            else if(rn === "on"){
                fcnt_mod["hd:binSh"] = {};
                fcnt_mod["hd:binSh"].powerSe = value; 
            }
            else{
                console.log("MODULE CLASS is not exist");
            }
        }

        let resp = request('PUT', url, {
            'headers': {
                'Accept': 'application/json',
                'X-M2M-RI': uuid(),
                'X-M2M-Origin': ae_id,
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(fcnt_mod)
        });

        let status_code = resp.statusCode;
        let str = '';
        try {
            str = String(resp.getBody());
        } catch (err) {
            str = String(err.body);
            //console.error(err);
        }
        let data = {'code': status_code, 'body': str};

        console.log('create cin: ' + status_code + ' <- ' + str);

        return data;
    };
    //------------------------------------------------------------------

    this.retrieve_sub = function (path) {

        let url = 'http://' + mobius_ip + ':' + mobius_port + path;

        console.log('retrieve sub: GET -> ' + url);

        let resp = request('GET', url, {
            'headers': {
                'Accept': 'application/json',
                'X-M2M-RI': uuid(),
                'X-M2M-Origin': ae_id
            }
        });

        let status_code = resp.statusCode;
        let str = '';
        try {
            str = String(resp.getBody());
        } catch (err) {
            str = String(err.body);
            //console.error(err);
        }
        let data = {'code': status_code, 'body': str};

        console.log('retrieve sub: ' + status_code + ' <- ' + str);

        return data;
    };

    this.create_sub = function (path, sub) {

        let url = 'http://' + mobius_ip + ':' + mobius_port + path;

        console.log('create sub: POST -> ' + url);

        let resp = request('POST', url, {
            'headers': {
                'Accept': 'application/json',
                'X-M2M-RI': uuid(),
                'X-M2M-Origin': ae_id,
                'Content-Type': 'application/json;ty=23;'
            },
            'body': JSON.stringify(sub)
        });

        let status_code = resp.statusCode;
        let str = '';
        try {
            str = String(resp.getBody());
        } catch (err) {
            str = String(err.body);
            //console.error(err);
        }
        let data = {'code': status_code, 'body': str};

        console.log('create sub: ' + status_code + ' <- ' + str);

        return data;
    };

    this.delete_res = function (path) {

        let url = 'http://' + mobius_ip + ':' + mobius_port + path;

        console.log('delete resc: DELETE -> ' + url);

        let resp = request('DELETE', url, {
            'headers': {
                'Accept': 'application/json',
                'X-M2M-RI': uuid(),
                'X-M2M-Origin': ae_id
            }
        });

        let status_code = resp.statusCode;
        let str = '';
        try {
            str = String(resp.getBody());
        } catch (err) {
            str = String(err.body);
            //console.error(err);
        }
        let data = {'code': status_code, 'body': str};

        console.log('delete resc: ' + status_code + ' <- ' + str);

        return data;
    };
};