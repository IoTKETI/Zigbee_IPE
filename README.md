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
- Modify the 'IPE_configuration.json' file to your personal preferences
- This is sample
```
{
    "hostingCSE": {
        "ip": "127.0.0.1",
        "port": 7579,
        "resourceName": "Mobius",
        "id": "/Mobius",
        "mqttPort": 1883
    },
    "ipe": {
        "resourceName": "zigbee_smarthome",
        "id": "Szigbee_smarthome",
        "appid": "zigbee",
        "notiPort": 4000
    },
    "zigbeeGateway": {
        "ip": "192.168.0.122",
        "apiKey": "9BBE38D704",
        "sensingInterval": 1000
    }
}
```
- Modify the 'Resource_configuration.json' file to your personal device compose
- This is sample
```
{
    "device": [
        {
            "deconzId": "2",
            "deconzResource": {
                "type": "ZHATemperature",
                "battery": true,
                "state": [
                    "temperature"
                ]
            },
            "oneM2MResource": {
                "deviceclass": "deviceThermometer",
                "deviceResourceName": "Thermometer",
                "moduleclass": [
                    "temperature",
                    "battery"
                ]
            }
        },
        {
            "deconzId": "5",
            "deconzResource": {
                "type": "ZHASwitch",
                "battery": false,
                "state": [
                    "buttonevent"
                ]
            },
            "oneM2MResource": {
                "deviceclass": "deviceSwitch",
                "deviceResourceName": "LightSwitch",
                "moduleclass": [
                    "binarySwitch"
                ]
            }
        },
        {
            "deconzId": "7",
            "deconzResource": {
                "type": "ZHAOpenClose",
                "battery": true,
                "state": [
                    "open"
                ]
            },
            "oneM2MResource": {
                "deviceclass": "deviceDoorlock",
                "deviceResourceName": "doorlock",
                "moduleclass": [
                    "doorlock",
                    "battery"
                ]
            }
        }
    ],
    "bulb": [
        {
            "deconzId": "2",
            "deconzResource": {
                "state": [
                    "bri",
                    "sat",
                    "reachable",
                    "on",
                    "xy"
                ]
            },
            "oneM2MResource": {
                "deviceclass": "deviceLight",
                "deviceResourceName": "Bulb1",
                "moduleclass": [
                    "binarySwitch",
                    "faultDetection",
                    "colourSaturation",
                    "colour",
                    "brightness"
                ],
                "subscribed_moduleclass": [
                    "binarySwitch"
                ]
            }
        }
    ]
}
```
## Configuration your device
- Modify the 'Notification.js' file with your personal notification setting
```
notification.post("/" + AE_ID, function (req, res) {
    console.log("$..req.body: \n" + JSON.stringify(req.body, null, 2));
    let req_body = req.body;
    let str = JSONPath("$..sur", req_body);
    let sub_deviceResourceName = str[0].split("/");
    let command = JSONPath("$..powerSe", req_body)[0]; // Attribute value you need to find (Ex. binarySwitch -> powerSe)
    console.log("=======================\n" + "User command: " + command);

    if (sub_deviceResourceName[2] == "Bulb1") { // Target device you want to control      
        if(command == true) {  // The actions when you get notification
            deconz.lighton(GATEWAY_IP, 2);
            res.sendStatus(200);
        }
        else if(command == false) {
            deconz.lightoff(GATEWAY_IP, 2);
            res.sendStatus(200);
        }
    }
});
```
## Running
Run the 'app.js' file as below
```
node app.js
```
