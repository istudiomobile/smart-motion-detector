"use strict" ;

var APP_NAME = "Home Smart Motion Detector" ;
console.log("\n\n\n\n\n\n") ;                       // poor man's clear console
console.log("Initializing " + APP_NAME) ;

const dotenv = require('dotenv');
dotenv.config();

clearInterval(intervalID) ;

var m = require("mraa");
var http = require('http');
var firebase = require('firebase');

// Initialize Firebase
var config = {
apiKey: 'process.env.fb_apiKey',
authDomain: 'process.env.fb_authDomain',
databaseURL: 'process.env.fb_databaseURL',
projectId: 'process.env.fb_projectId',
storageBucket: 'process.env.fb_storageBucket',
messagingSenderId: 'process.env.fb_messagingSenderId'
};
firebase.initializeApp(config);

var LED = new m.Gpio(5);
var RELAY = new m.Gpio(4);
var PIR_SENSOR = new m.Gpio(3);
RELAY.dir(m.DIR_OUT);
RELAY.write(1);
LED.dir(m.DIR_OUT);
LED.write(0);
PIR_SENSOR.dir(m.DIR_IN);
var instanceId   = 'process.env.wm_instanceId'; // TODO: Replace it with your gateway instance ID here
var clientId     = 'process.env.wm_clientId'; // TODO: Replace it with your Forever Green client ID here
var clientSecret = 'process.env.wm_clientSecret';  // TODO: Replace it with your Forever Green client secret here

var jsonPayload = JSON.stringify({
    //group_admin: '', // TODO: Specify the WhatsApp number of the group creator, including the country code
    number: 'process.env.wm_number',  // TODO: Specify the recipient's cel phone number here. NOT the gateway number
    // group_name: '',   // TODO:  Specify the name of the group    
    message: "ALARMA SILENCIOSA! Movimiento detectado. UTUME #202"
});

var options = {
    hostname: "api.whatsmate.net",
    port: 80,
    path: "/v3/whatsapp/single/text/message/" + instanceId,
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-WM-CLIENT-ID": clientId,
        "X-WM-CLIENT-SECRET": clientSecret,
        "Content-Length": Buffer.byteLength(jsonPayload)
    }
};

var request = new http.ClientRequest(options);

request.on('response', function (response) {
    console.log('Heard back from the WhatsMate WA Gateway:\n');
    console.log('Status code: ' + response.statusCode);
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
        console.log(chunk);
    });
});

function isMotionDetected(){
    if(PIR_SENSOR.read()){
        return true;
    } else {
        return false;
    }
}

var periodicActivity = function() {
    if(isMotionDetected()){
        LED.write(1);
        // request = new http.ClientRequest(options);
        request.end(jsonPayload);
        RELAY.write(0);
        setSirenState(true);
    } else {
        LED.write(0);
        RELAY.write(1);
        setSirenState(false);
    }
};
var intervalID = setInterval(periodicActivity, 5000) ;  // start the periodic write

function setSirenState(state) {
  firebase.database().ref('Utume_202/motion_detectors/sensor_1').set({
    siren: state,
    state: state
  });
}

// TODO: Fire siren timely based, not just on/off.