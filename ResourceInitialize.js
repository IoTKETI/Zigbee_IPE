let fs = require("fs");
let ip = require("ip");
let zigbee_adn = require("./ZigbeeADN.js").mobius;
let KETIMobius = new zigbee_adn();
let ipeConfig = JSON.parse(fs.readFileSync("./config/IPE_configuration.json","utf-8"));
let resourceConfig = JSON.parse(fs.readFileSync("./config/Resource_configuration.json", "utf-8"));
const AE_ID = ipeConfig.ipe.id;
const CSE_ID = ipeConfig.hostingCSE.id;
const CSE_NAME = ipeConfig.hostingCSE.resourceName;
const IPE_NAME = ipeConfig.ipe.resourceName;
const NOTIFICATION_PORT = ipeConfig.ipe.notiPort;
const SUBSCRIBE_RESOURCE_NAME = "sub";

exports.init_resource = function() {
    let ae_resp = KETIMobius.create_ae(CSE_ID, IPE_NAME, AE_ID);
    console.log("ae_resp: " + JSON.stringify(ae_resp));
    if(ae_resp.code == 201 || ae_resp.code == 409){
        for (const [key, value] of Object.entries(resourceConfig)) {
            for (let i = 0; i < value.length; i++) {
                let deviceclass_path = "/" + CSE_NAME + "/" + IPE_NAME;
                let deviceclass_rn = value[i].oneM2MResource.deviceResourceName
                let deviceclass_cnd = value[i].oneM2MResource.deviceclass;
                let deviceclass_resp = KETIMobius.create_device_fcnt(deviceclass_path, deviceclass_rn, deviceclass_cnd);
                if (deviceclass_resp.code == 201 || deviceclass_resp.code == 409){
                    console.log(value[i].oneM2MResource.deviceResourceName + "_Create_Success!!");
                    if (value[i].oneM2MResource.moduleclass != undefined){
                        for (let j = 0; j < Object.keys(value[i].oneM2MResource.moduleclass).length; j++) {
                            let moduleclass_path = deviceclass_path +"/"+ deviceclass_rn;
                            let moduleclass_rn =  value[i].oneM2MResource.moduleclass[j];
                            let moduleclass_resp = KETIMobius.create_module_fcnt(moduleclass_path, moduleclass_rn);
                            console.log(moduleclass_resp);
                            if (moduleclass_resp.code == 201 || moduleclass_resp.code == 409){
                                console.log(value[i].oneM2MResource.moduleclass[j] + "_Create_Success!!");
                            }
                            else {
                                console.log(value[i].oneM2MResource.moduleclass[j] + "_moduleclass is not exist!");
                            }
                        }
                    }
                }
            }
        }

        for (const [key, value] of Object.entries(resourceConfig)){ // subscription create for notification
            for (let i = 0; i < value.length; i++) {
                if  (value[i].oneM2MResource.subscribed_moduleclass != undefined) {
                    for (let j = 0; j < value[i].oneM2MResource.subscribed_moduleclass.length; j++){
                        let sub_path = "/" + CSE_NAME + "/" + IPE_NAME + "/" + value[i].oneM2MResource.deviceResourceName +"/" +  value[i].oneM2MResource.subscribed_moduleclass[j];
                        let sub_body = { nu: ["http://" + ip.address() +":"+ NOTIFICATION_PORT + "/" + AE_ID + "?ct=json" ] };
                        let sub_obj = {
                            "m2m:sub": 
                            {
                                "rn" : SUBSCRIBE_RESOURCE_NAME,
                                "enc": {"net": [1]},
                                "nu" : sub_body.nu,
                                "nct": 1
                            }
                        };
                        let fcnt_subscription_path = sub_path + "/" + SUBSCRIBE_RESOURCE_NAME;
                        let fcnt_resp = KETIMobius.retrieve_sub(fcnt_subscription_path);
                        if (fcnt_resp.code == 200) {
                            fcnt_resp = KETIMobius.delete_res(fcnt_subscription_path);
                            if (fcnt_resp.code == 200) {
                                fcnt_resp = KETIMobius.create_sub(sub_path, sub_obj);
                                console.log(fcnt_resp);
                            }
                        } 
                        else if (fcnt_resp.code == 404) {
                            KETIMobius.create_sub(sub_path, sub_obj);
                        }
                    }
                }
            }
        }
    }
}