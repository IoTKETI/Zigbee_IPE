let http = require("http");
let request = require("sync-request");
let zigbee = require('./deconzAPI');
let ipeConfig = require("./config/IPE_configuration.json");


exports.getlightlist= function (zigbeehost){
  let data = "";
  let obj = "";
  try {
    let url = 'http://'+zigbeehost+'/api/'+ipeConfig.zigbeeGateway.apiKey+'/lights';
    // console.log('GET -> ' + url);
    let resp = request('GET', url);
    // let status_code = resp.statusCode;
    try {
      data = String(resp.getBody());
    } catch (err) {
      data = String(err.body);
      console.error(err);
    }
    // console.log(status_code);
    obj = JSON.parse(data);
  } catch (exp) {
    console.error(exp);
  }
  return obj;
}

exports.getsensorlist = function (zigbeehost) {
  let data = "";
  let obj = "";
  try {
    let url = 'http://'+ zigbeehost +"/api/"+ ipeConfig.zigbeeGateway.apiKey + "/sensors";
    // console.log('GET -> ' + url);
    let resp = request('GET', url);
    // let status_code = resp.statusCode;
    try {
      data = String(resp.getBody());
    } catch (err) {
      data = String(err.body);
      console.error(err);
    }
    // console.log(status_code);
    obj = JSON.parse(data);
  } catch (exp) {
    console.error(exp);
  }
  return obj;
}


exports.sensorbatt = function (zigbeehost, sensorID) {
  let data = "";
  let obj = "";
  try {
    let url = "http://" + zigbeehost + "/api/" + ipeConfig.zigbeeGateway.apiKey + "/sensors/" + sensorID;
    // console.log("GET -> " + url);
    let resp = request("GET", url);
    // let status_code = resp.statusCode;
    if (resp.statusCode === 200) {
      data = String(resp.getBody());
      obj = JSON.parse(data);
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

exports.sensordata = function (zigbeehost, sensorID, attribute) {
  let data = "";
  let obj = "";
  try {
    let url = "http://" + zigbeehost + "/api/" + ipeConfig.zigbeeGateway.apiKey + "/sensors/" + sensorID;
    // console.log("GET -> " + url);
    let resp = request("GET", url);
    // let status_code = resp.statusCode;
    if (resp.statusCode === 200) {
      data = String(resp.getBody());
      obj = JSON.parse(data);
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
  let data = "";
  let obj = "";
  try {
    let url = "http://" + zigbeehost + "/api/" + ipeConfig.zigbeeGateway.apiKey + "/sensors/" + sensorID;
    // console.log("GET -> " + url);
    let resp = request("GET", url);
    // let status_code = resp.statusCode;
    if (resp.statusCode === 200) {
      data = String(resp.getBody());
      obj = JSON.parse(data);
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
  let data = "";
  let obj = "";
  try {
    let url = "http://" + zigbeehost + "/api/" + ipeConfig.zigbeeGateway.apiKey + "/lights/" + lightNUM;
    // console.log("GET -> " + url);
    let resp = request("GET", url);
    // let status_code = resp.statusCode;
    try {
      data = String(resp.getBody());
    } catch (err) {
      data = String(err.body);
      console.error(err);
    }
    // console.log(status_code);
    obj = JSON.parse(data);
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
    else if (findval == "on") {
      obj = obj['on']
      return obj
    }
  } catch (exp) {
    console.error(exp);
  }
  return obj;
};

exports.xyTorgb = function (cle, lightID) {
  // console.log(lightID+"11111111111111111");
  let light_col = zigbee.lightdata(ipeConfig.zigbeeGateway.ip, lightID, "xy");
  let x = light_col[0];
  let y = light_col[1];
  let bri = zigbee.lightdata(ipeConfig.zigbeeGateway.ip, lightID, "bri");
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


  if (cle == "red") {
    return r
  }
  else if (cle == "green") {
    return g
  }
  else if (cle == "blue") {
    return b
  }
};

exports.lighton = function (zigbeehost, lightNUM) {
  let data = null;
  let control = {
    "on": true
  }

  try {
    let url = 'http://' + zigbeehost + '/api/' + ipeConfig.zigbeeGateway.apiKey + '/lights/' + lightNUM + '/state';
    const body = { 'body': JSON.stringify(control) };
    console.log('\nRequest to the G/W\nPUT ' + url);
    console.log(body);
    let resp = request('PUT', url, body);
    if (resp.statusCode === 200) {
      console.log("\nResponse from the G/W:");
      console.log(resp.statusCode);
      console.log(JSON.parse(resp.body.toString()));
    }
  } catch (exp) {
    console.error(exp);
  }
  return 0;
};

exports.lightoff = function (zigbeehost, lightNUM) {
  let data = "";
  let obj = "";
  let control = {
    "on": false
  }
  try {
    let url = 'http://' + zigbeehost + '/api/' + ipeConfig.zigbeeGateway.apiKey + '/lights/' + lightNUM + '/state';
    console.log('PUT -> ' + url);
    let resp = request('PUT', url, {
      'body': JSON.stringify(control)
    });
    let status_code = resp.statusCode;
    try {
      data = String(resp.getBody());
    } catch (err) {
      adata = String(err.body);
      console.error(err);
    }
    console.log(status_code);
    obj = JSON.parse(data);
  } catch (exp) {
    console.error(exp);
  }
  return 0;
};