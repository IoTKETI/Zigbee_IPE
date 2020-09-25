var conf = {};
var cse = {};
var ae = {};

//cse config
cse.host = "127.0.0.1";
cse.port = "7599"
cse.name = "wdc_base"
cse.id = "wdc_base"
cse.mqttport = "1883";

//ae config
ae.name = "zigbee_smarthome";
ae.id = "S" + ae.name;
ae.parent = "/" + cse.name;
ae.appid = "zigbee"

conf.cse = cse;
conf.ae = ae;

module.exports = conf;