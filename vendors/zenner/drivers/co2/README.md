# zenner-co2-js-driver

## To develop
All functions are implemented in the index.js file
You also need to add tests samples in
 - examples folder
 - errors folder

## To just manually test a payload

Create a test.js file containing
```
//import the driver module
let driver=require("./index.js")

let rawUplink="d100ffce010000db010000ed010000ec01"
let ret=driver.decodeUplink({ bytes : Buffer.from(rawUplink,"hex") })
console.log(ret)
```

You can now run the code
```
[root@cups-dev zenner-co2-js-driver]# node test.js
{
  data: {
    firstQuarter: 462,
    secondQuarter: 475,
    thirdQuarter: 493,
    currentValue: 492
  }
}
```

You can also encode downlink, decode downlink
```
...
let clearDownlink={ setAlarmThreshold: { upper: 900, lower : 400 } }
ret=driver.encodeDownlink(clearDownlink)
console.log(Buffer.from(ret.bytes,'hex').toString('hex'))

rawDownlink="3602400090018403ffffffffffff2bce"
ret=driver.decodeDownlink({ bytes : Buffer.from(rawDownlink,"hex") })
console.log(ret)
```
## To build and test

- ```npm test```. This command runs the test suite
- ```npm pack```. This command build the zenner driver tgz file, you must delete the old tgz file previously.

## To test, downlink sample (based on TAO configured with an MQTT broker broker.emqx.io)
```
//set system time
mosquitto_pub -h broker.emqx.io -t "/downlink-topic-zenner" -m \
 '{"DevEUI_downlink":{"DevEUI":"04B648F330000043","FPort":"1","Confirmed":"1","DriverCfg":{"app":{"pId":"zenner","mId":"co2-ind-ID-A","ver":"1"}},"payload":{"setSystemTime": {"year":2022,"month":1,"day":7,"hour":17,"min":0,"sec":0,"tz":4}}  }}'

//get system time
mosquitto_pub -h broker.emqx.io -t "/downlink-topic-zenner" -m \
 '{"DevEUI_downlink":{"DevEUI":"04B648F330000043","FPort":"1","Confirmed":"1","DriverCfg":{"app":{"pId":"zenner","mId":"co2-ind-ID-A","ver":"1"}},"payload":{"getSystemTime": 1}  }}'

//set timeshift
mosquitto_pub -h broker.emqx.io -t "/downlink-topic-zenner" -m \
 '{"DevEUI_downlink":{"DevEUI":"04B648F330000043","FPort":"1","Confirmed":"1","DriverCfg":{"app":{"pId":"zenner","mId":"co2-ind-ID-A","ver":"1"}},"payload":{"timeshift": -5000}  }}'

//set alarm threshold
mosquitto_pub -h broker.emqx.io -t "/downlink-topic-zenner" -m \
 '{"DevEUI_downlink":{"DevEUI":"04B648F330000043","FPort":"1","Confirmed":"1","DriverCfg":{"app":{"pId":"zenner","mId":"co2-ind-ID-A","ver":"1"}},"payload":{"setAlarmThreshold": {"lower": 400, "upper" : 900}}  }}'

//get alarm threshold
mosquitto_pub -h broker.emqx.io -t "/downlink-topic-zenner" -m \
 '{"DevEUI_downlink":{"DevEUI":"04B648F330000043","FPort":"1","Confirmed":"1","DriverCfg":{"app":{"pId":"zenner","mId":"co2-ind-ID-A","ver":"1"}},"payload":{"getAlarmThreshold": 1}  }}'


//a configuration batch
mosquitto_pub -h broker.emqx.io -t "/downlink-topic-zenner" -m  '{"DevEUI_downlink":{"DevEUI":"04B648F330000043","FPort":"1","Confirmed":"1","DriverCfg":{"app":{"pId":"zenner","mId":"co2-ind-ID-A","ver":"1"}},"payload":{"setAlarmThreshold": {"lower": 700, "upper" : 900}}  }}'
mosquitto_pub -h broker.emqx.io -t "/downlink-topic-zenner" -m  '{"DevEUI_downlink":{"DevEUI":"04B648F330000043","FPort":"1","Confirmed":"1","DriverCfg":{"app":{"pId":"zenner","mId":"co2-ind-ID-A","ver":"1"}},"payload":{"getAlarmThreshold": 1}  }}'
mosquitto_pub -h broker.emqx.io -t "/downlink-topic-zenner" -m  '{"DevEUI_downlink":{"DevEUI":"04B648F330000043","FPort":"1","Confirmed":"1","DriverCfg":{"app":{"pId":"zenner","mId":"co2-ind-ID-A","ver":"1"}},"payload":{"setSystemTime": {"year":2022,"month":1,"day":11,"hour":8,"min":10,"sec":0,"tz":4}}  }}'
mosquitto_pub -h broker.emqx.io -t "/downlink-topic-zenner" -m  '{"DevEUI_downlink":{"DevEUI":"04B648F330000043","FPort":"1","Confirmed":"1","DriverCfg":{"app":{"pId":"zenner","mId":"co2-ind-ID-A","ver":"1"}},"payload":{"getSystemTime": 1}  }}'
```


## To understand the driver format
see ./examples/ folder, it contains all kind of uplink/downlink

## Guide to develop ThingPark X IoT Flow Driver
[IoT Flow JavaScript driver developer guide](https://github.com/actility/iot-flow-js-driver)
