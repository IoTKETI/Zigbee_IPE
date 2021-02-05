var http = require("http");
var request = require("sync-request");
var zigbee = require('./DeviceStateRetrive');
global.conf = require("./conf.js");

exports.sensorbatt = function (zigbeehost, sensorNUM) {
  var data = null;
  try {
    var url = "http://" + zigbeehost + "/api/" + conf.zigbee.api_key + "/sensors/" + sensorNUM;
    // console.log("GET -> " + url);
    var resp = request("GET", url);
    // var status_code = resp.statusCode;
    if (resp.statusCode === 200) {
      data = String(resp.getBody());
      var obj = JSON.parse(data);
      obj = obj['config']
      obj = obj['battery']
    } else {
      // console.log("response code: ", resp.statusCode);
    }
  } catch (exp) {
    console.error(exp);
  }
  return obj;
};

exports.sensordata = function (zigbeehost, sensorNUM, attribute) {
  var data = null;
  try {
    var url = "http://" + zigbeehost + "/api/" + conf.zigbee.api_key + "/sensors/" + sensorNUM;
    // console.log("GET -> " + url);
    var resp = request("GET", url);
    // var status_code = resp.statusCode;
    if (resp.statusCode === 200) {
      data = String(resp.getBody());
      var obj = JSON.parse(data);
      obj = obj['state']
      obj = obj[attribute]
      if(obj === 1004) {
        obj = false;
      } else if (obj === 1002) {
        obj = true;
      }
    } else {
      // console.log("response code: ", resp.statusCode);
    }
  } catch (exp) {
    console.error(exp);
  }
  return obj;
};

exports.sensortype = function ( attribute ) {
  var data = null;
  try {
    var url = "http://" + zigbeehost + "/api/" + conf.zigbee.api_key + "/sensors/" + sensorNUM;
    // console.log("GET -> " + url);
    var resp = request("GET", url);
    // var status_code = resp.statusCode;
    if (resp.statusCode === 200) {
      data = String(resp.getBody());
      var obj = JSON.parse(data);
      obj = obj['state']
      obj = obj[attribute]
    } else {
      // console.log("response code: ", resp.statusCode);
    }
  } catch (exp) {
    console.error(exp);
  }
  return obj;
};

exports.lightdata = function (zigbeehost, lightNUM, findval) {
  var data = null;
  try {
    var url = "http://" + zigbeehost + "/api/" + conf.zigbee.api_key + "/lights/" + lightNUM;
    // console.log("GET -> " + url);
    var resp = request("GET", url);
    // var status_code = resp.statusCode;
    try {
      data = String(resp.getBody());
    } catch (err) {
      data = String(err.body);
      console.error(err);
    }
    // console.log(status_code);
    var obj = JSON.parse(data);
    obj = obj['state']
    if (findval == "bri") {
      obj = obj['bri']
      return obj
    }
    else if (findval == "reachable") {
      obj = obj['reachable']
      return obj
    }
    else if (findval == "sat") {
      obj = obj['sat']
      return obj
    }
    else if (findval == "xy") {
      obj = obj['xy']
      return obj
    }
  } catch (exp) {
    console.error(exp);
  }
  return obj;
};

exports.xyBriToRgb = function (cle, lightID) {
  let light_col = zigbee.lightdata(conf.zigbee.host, lightID, "xy");
  let x = light_col[0];
  let y = light_col[1];
  let bri = zigbee.lightdata(conf.zigbee.host, lightID, "bri");
  let z = 1.0 - x - y;

  let Y_val = bri / 255.0; // Brightness of lamp
  let X_val = (Y_val / y) * x;
  let Z_val = (Y_val / y) * z;
  let r = X_val * 1.612 - Y_val * 0.203 - Z_val * 0.302;
  let g = -X_val * 0.509 + Y_val * 1.412 + Z_val * 0.066;
  let b = X_val * 0.026 - Y_val * 0.072 + Z_val * 0.962;
  r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
  g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
  b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
  let maxValue = Math.max(r, g, b);
  r /= maxValue;
  g /= maxValue;
  b /= maxValue;

  r = r * 255; if (r < 0) { r = 255 };
  g = g * 255; if (g < 0) { g = 255 };
  b = b * 255; if (b < 0) { b = 255 };
  if (cle = "red") {
    return r
  }
  else if (cle = "green") {
    return g
  }
  else if (cle = "blue") {
    return b
  }
};

exports.lighton = function (zigbeehost, lightNUM) {
  var data = null;
  let control = {
    "on": true
  }

  try {
    var url = 'http://' + zigbeehost + '/api/' + conf.zigbee.api_key + '/lights/' + lightNUM + '/state';
    const body = { 'body': JSON.stringify(control) };
    console.log('\nRequest to the G/W\nPUT ' + url);
    console.log(body);
    var resp = request('PUT', url, body);
    if (resp.statusCode === 200) {
      console.log("\nResponse from the G/W:");
      console.log(resp.statusCode);
      console.log(JSON.parse(resp.body.toString()));
    }
  } catch (exp) {
    console.error(exp);
  }
  return;
};

exports.lightoff = function (zigbeehost, lightNUM) {
  var data = null;
  let control = {
    "on": false
  }
  try {
    var url = 'http://' + zigbeehost + '/api/' + conf.zigbee.api_key + '/lights/' + lightNUM + '/state';
    console.log('PUT -> ' + url);
    var resp = request('PUT', url, {
      'body': JSON.stringify(control)
    });
    var status_code = resp.statusCode;
    try {
      data = String(resp.getBody());
    } catch (err) {
      adata = String(err.body);
      console.error(err);
    }
    console.log(status_code);
    var obj = JSON.parse(data);
  } catch (exp) {
    console.error(exp);
  }
  return;
};