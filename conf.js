let conf = {};
let cse = {};
let ae = {};
let zigbee = {};
let api_key = {};

//cse config
cse.host = "127.0.0.1";
cse.port = "7599"
cse.name = "wdc_base"
cse.id = "/wdc_base"
cse.mqttport = "1883";

//ae config
ae.name = "zigbee_smart";
ae.id = "S" + ae.name;
ae.parent = "/" + cse.name;
ae.appid = "zigbee"

zigbee.host = "192.168.0.6"
zigbee.api_key = "16C4BC05B6"

conf.cse = cse;
conf.ae = ae;
conf.zigbee = zigbee;
conf.api_key = api_key;

module.exports = conf;