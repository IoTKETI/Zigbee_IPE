# Zigbee_IPE

## version 
v1.0.0

## Introduction
- The Zigbee IPE provides interworking between oneM2M system and Zigbee networks.
- The web tutorial is available at the oneM2M youtube channel: https://youtu.be/oq30NPDsMv8

## Installation
- Open the Zigbee_IPE source home directory
- Install the dependent libraries as below
```
 npm install
 
```
## Configuration
- Modify the 'conf.js' file to your personal preferences
```
 
let conf = {};
let cse = {};
let ae = {};
let zigbee = {};
let api_key = {};

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

zigbee.host = "192.168.0.122"
zigbee.api_key = "9BBE38D704"

conf.cse = cse;
conf.ae = ae;
conf.zigbee = zigbee;
conf.api_key = api_key;

module.exports = conf;

 
```
## Configuration your device
- Modify the 'app.js' and 'ZigbeeIPE.js' file with your personal device IDs
```
//app.js
function typetonum(sen){
    switch (sen){
    case 'temperature':
        return 2;
    case 'humidity':
        return 3;
    case 'pressure':
        return 4;
    case 'buttonevent':
        return 5;
    }
}

//ZigbeeIPE.js
function numtotype(sensorty) {
  switch (sensorty) {
    case 2:
      return 'temperature';
    case 3:
      return 'humidity';
    case 4:
      return 'pressure';
    case 5:
      return 'buttonevent';
  }
}

```
## Running
Run the 'app.js' file as below
```
node app.js
```
