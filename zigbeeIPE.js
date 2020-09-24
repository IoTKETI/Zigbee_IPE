var http = require("http");
var request = require("sync-request");
var api_key = '16C4BC05B6'

exports.findlight = function(zigbeehost, lightNUM, findval){
  var data = null;
  try {
      var url = 'http://' + zigbeehost + '/api/'+api_key+'/lights/'+lightNUM;
      // console.log('GET -> ' + url);
      var resp = request('GET', url);
      // var status_code = resp.statusCode;
      try {
          data = String(resp.getBody());
      } catch (err) {
          adata = String(err.body);
          console.error(err);
      }
      // console.log(status_code);
      var obj = JSON.parse(data);
      obj = obj['state']
      if (findval == 'bri'){
        obj = obj['bri']
        return obj
      }
      else if (findval == 'reachable'){
        obj = obj['reachable']
        return obj
      }
      else if (findval == 'sat'){
        obj = obj['sat']
        return obj
      }
      else if (findval == 'xy'){
        obj = obj['xy']
        return obj
      }
  } catch (exp) {
      console.error(exp);
  }
  return obj;
};

exports.getsensorbatt = function(zigbeehost, sensorNUM){
  var data = null;
    try {
        var url = 'http://'+zigbeehost+'/api/'+api_key+'/sensors/'+sensorNUM;
        // console.log('GET -> ' + url);
        var resp = request('GET', url);
        // var status_code = resp.statusCode;
        try {
            data = String(resp.getBody());
        } catch (err) {
            adata = String(err.body);
            console.error(err);
        }
        // console.log(status_code);
        var obj = JSON.parse(data);
        obj = obj['config']
        obj = obj['battery']
    } catch (exp) {
        console.error(exp);
    }
    return obj;
}

exports.getsensorstate = function(zigbeehost, sensorNUM){
  var data = null;
    try {
        var url = 'http://'+zigbeehost+'/api/'+api_key+'/sensors/'+sensorNUM;
        // console.log('GET -> ' + url);
        var resp = request('GET', url, {});
        // var status_code = resp.statusCode;
        try {
            data = String(resp.getBody());
        } catch (err) {
            adata = String(err.body);
            console.error(err);
        }
        // console.log(status_code);
        var obj = JSON.parse(data);
        obj = obj['state']
        if (numtosensortype(sensorNUM) == 'temperature'){
          obj = obj['temperature']
          return obj
        }
        else if (numtosensortype(sensorNUM) == 'humidity'){
          obj = obj['humidity']
          return obj
        }
        else if (numtosensortype(sensorNUM) == 'pressure'){
          obj = obj['pressure']
          return obj
        }
        else if (numtosensortype(sensorNUM) == 'lux'){
          obj = obj['lux']
          return obj
        }
        else if (numtosensortype(sensorNUM) == 'presence'){
          obj = obj['presence']
          return obj
        }
        else if (numtosensortype(sensorNUM) == 'open'){
          obj = obj['open']
          return obj
        }
        else if (numtosensortype(sensorNUM) == 'buttonevent'){
          obj = obj['buttonevent']
          if (obj == 1002)
            return true
          else if(obj == 1004)
            return false
        }
    } catch (exp) {
        console.error(exp);
    }
    return obj;
}

exports.lighton = function(zigbeehost, lightNUM){
  var data = null;
  let control ={
    "on" : true
  }
    try {
        var url = 'http://'+zigbeehost+'/api/'+api_key+'/lights/'+lightNUM+'/state';
        // console.log('PUT -> ' + url);
        var resp = request('PUT', url,{
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
    return obj;
}
exports.lightoff = function(zigbeehost, lightNUM){
  var data = null;
  let control ={
    "on" : false
  }
    try {
        var url = 'http://'+zigbeehost+'/api/'+api_key+'/lights/'+lightNUM+'/state';
        // console.log('PUT -> ' + url);
        var resp = request('PUT', url,{
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
    return obj;
}

exports.changelightcolor = function(zigbeehost, lightNUM, xvalue, yvalue){
  const data = JSON.stringify(
    { 
      "on": true,
      "bri": 255,
      "xy": [xvalue,yvalue]
      }
  )
  const options = {
    hostname: zigbeehost,
    port: 80,
    path: '/api/'+api_key+'/lights/'+lightNUM+'/state',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  }
  
  var req = http.request(options, function(res) {
    res.setEncoding('utf-8');
      // console.log('Status: ' + res.statusCode);
      res.on('data', function (body) {
        // console.log('Body: ' + body);
        return body
      });
    });
  
  req.on('error', (error) => {
    console.error(error)
  })
  
  req.write(data)
  req.end()
}

exports.emergencyalert = function(zigbeehost, lightNUM){
  const data = JSON.stringify(
    { 
      "on": true,
      "bri": 255,
      "xy": [1,0],
      "alert": "select"
    }
  )
  const options = {
    hostname: zigbeehost,
    port: 80,
    path: '/api/'+api_key+'/lights/'+lightNUM+'/state',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  }
  
  var req = http.request(options, function(res) {
    res.setEncoding('utf-8');
      // console.log('Status: ' + res.statusCode);
      res.on('data', function (body) {
        // console.log('Body: ' + body);
        return body
      });
    });
  
  req.on('error', (error) => {
    console.error(error)
  })
  
  req.write(data)
  req.end()
};

function numtosensortype(sensorty) {
  switch (sensorty) {
    case 2:
      return 'temperature';
    case 3:
      return 'humidity';
    case 4:
      return 'pressure';
    case 5:
      return 'lux';
    case 6:
      return 'presence';
    case 7:
      return 'open';
    case 8:
      return 'buttonevent';
  }
}