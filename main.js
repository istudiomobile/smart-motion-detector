"use strict" ;

var APP_NAME = "WhatsApp Notifier" ;
console.log("\n\n\n\n\n\n") ;                       // poor man's clear console
console.log("Initializing " + APP_NAME) ;

clearInterval(intervalID) ;

var m = require("mraa");
var http = require('http');
var firebase = require('firebase');

// Initialize Firebase
var config = {
apiKey: "AIzaSyBpg1EG8DguPxm40zJRQh-BPBuLm0B_OGQ",
authDomain: "securitymotiondetector.firebaseapp.com",
databaseURL: "https://securitymotiondetector.firebaseio.com",
projectId: "securitymotiondetector",
storageBucket: "securitymotiondetector.appspot.com",
messagingSenderId: "1071026438794"
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
var instanceId   = "3"; // TODO: Replace it with your gateway instance ID here
var clientId     = "istudiomobile-IT@istudiomobileapplab.com";     // TODO: Replace it with your Forever Green client ID here
var clientSecret = "90508e8e628f4155b591e0d9bf711203";  // TODO: Replace it with your Forever Green client secret here

var jsonPayload = JSON.stringify({
    //group_admin: "5214433301716", // TODO: Specify the WhatsApp number of the group creator, including the country code
    number: "5214432177605",  // TODO: Specify the recipient's number here. NOT the gateway number
    //group_name: "EMERGENCIAS Vista Bella",   // TODO:  Specify the name of the group    
    message: "Movimiento detectado. Saltillo #129"
});

var options = {
    hostname: "api.whatsmate.net",
    port: 80,
    path: "/v2/whatsapp/single/message/" + instanceId,
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
        request = new http.ClientRequest(options);
        request.end(jsonPayload);
        RELAY.write(0);
        setSirenState(true);
    } else {
        LED.write(0);
        RELAY.write(1);
        setSirenState(false);
    }
};
var intervalID = setInterval(periodicActivity, 1000) ;  // start the periodic write

function setSirenState(state) {
  firebase.database().ref('Utume_202/motion_detectors/sensor_1').set({
    siren: state,
    state: state
  });
}

// TODO: Fire siren timely based, not just on/off.