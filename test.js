
/* Johnny Five */

var five = require("johnny-five");
var board = new five.Board();

var sensorPins = ['A0','A1','A2','A3'];
var sensors = [];

/* Initiate sensorPins */

function initiatePins() {

	for (var i=0; i < sensorPins.length; i++) {
		sensors.push(new five.Pin(sensorPins[i]));
	};
};


/* Read Pin */ 

function readPin(pin) {
	var reading = pin.value;
	return reading;
};

function updateAllReadings() {
	for (var i=0; i < sensors.length; i++) {
		var reading = readPin(sensors[i]);
		console.log("Pin:", i, reading);
	};
};


/* Main application */

board.on("ready", function() {

	console.log('Applicaton started');

	initiatePins();

/* Main loop */

setInterval(function(){
	updateAllReadings();
	},400);

  });


