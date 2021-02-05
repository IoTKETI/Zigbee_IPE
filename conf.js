let conf = {};
let cse = {};
let ae = {};
let zigbee = {};
let api_key = {};
let sensor_interval = 1000;

//cse config
cse.host = "127.0.0.1";
cse.port = "7579"
cse.name = "Mobius"
cse.id = "/Mobius.js"
cse.mqttport = "1883";

//ae config
ae.name = "zigbee_smarthome";
ae.id = "S" + ae.name;
ae.parent = "/" + cse.name;
ae.appid = "zigbee"

// zigbee.host = "192.168.0.47"
// zigbee.api_key = "1908604E65"
zigbee.host = "192.168.0.122"
zigbee.api_key = "9BBE38D704"

conf.cse = cse;
conf.ae = ae;
conf.zigbee = zigbee;
conf.api_key = api_key;
conf.sensor_interval = sensor_interval;

module.exports = conf;
