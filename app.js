let zigbee_device_data = require("./DeviceData.js").device_data;
let DeviceData = new zigbee_device_data();
let oneM2M_resource_init = require("./ResourceInitialize.js");

// resource initial creation
oneM2M_resource_init.init_resource();

// device data initialization
DeviceData.init_device_battery();
DeviceData.init_device_doorstate();
DeviceData.init_device_temperature();
DeviceData.init_device_switch_state();
DeviceData.init_bulb_faultDetection();
DeviceData.init_bulb_saturation();
DeviceData.init_bulb_brightness();
DeviceData.init_bulb_rgbcolor();
DeviceData.init_bulb_onstate();

// get device data
DeviceData.get_device_battery();
DeviceData.get_device_doorstate();
DeviceData.get_device_temperature();
DeviceData.get_device_switch_state();
DeviceData.get_bulb_faultDetection();
DeviceData.get_bulb_saturation();
DeviceData.get_bulb_brightness();
DeviceData.get_bulb_rgbcolor();
DeviceData.get_bulb_onstate();

// notification handler
require("./Notification.js");