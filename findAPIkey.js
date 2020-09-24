var http = require("http");

// hosturl = '192.168.0.6'
var data = JSON.stringify(
  {
    "devicetype": "my applcation",
  }
)
var options = {
  hostname: '192.168.0.6',
  port: 80,
  path: '/api',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
}
var req = http.request(options, function(res) {
    console.log('Status: ' + res.statusCode);
    res.setEncoding('utf-8');
    res.on('data', function (body) {
      var str = body.split('[');
      var str = str[1].split(']');
      var obj = JSON.parse(str[0]);

      if(obj['success'] != undefined){
        obj = obj['success'];
        api_key = obj['username'];
        console.log(api_key);
        // return api_key;
      }
      else{
        console.log("link button not pressed");
      }
    });
  });  
req.on('error', (error) => {
  console.error(error)
})

req.write(data)
req.end() 
