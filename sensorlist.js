var request = require("sync-request");
var zigbeehost = '192.168.0.6'
var api_key = '16C4BC05B6'

function getsensorlist (){
  try {
    var url = 'http://'+zigbeehost+'/api/'+api_key+'/sensors';
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
} catch (exp) {
    console.error(exp);
}
return obj;
}

console.log(getsensorlist())
