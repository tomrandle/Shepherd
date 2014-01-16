/* Johnny Five */

var five = require("johnny-five");
var board = new five.Board();

/* Pins */

var sensorPins = ['A0','A1','A2','A3'];
var sensors = [];

var solenoidPins = [8,9,10];
var solenoids = [];

/* Variables */

var readings = [];
var newReadings = [];



/* Initiate Pins */

function initiatePins() {

	for (var i=0; i < sensorPins.length; i++) {
		sensors.push(new five.Pin(sensorPins[i]));
	};

	for (var i=0; i < solenoidPins.length; i++) {
		solenoids.push(new five.Pin(solenoidPins[i]));
	};
};


/* Read Pin */ 

function readPin(pin) {
	var reading = pin.value;
	return reading;
};

function updateAllReadings() {

	newReadings = [];

	for (var i=0; i < sensors.length; i++) {
		var reading = readPin(sensors[i]);

		newReadings[i] = reading;

		// console.log("Pin:", i, reading);

	};

	readings.push(newReadings);
};

/* Fire solenoid */ 

var solenoidStates = [0,0,0];

function fireSolenoid(pin) {
	pin.high();
}

function turnOffSolenoid(pin) {
	pin.low();
}



/* Write log file */

var fs = require('fs');

function writeReadingsToFile() {

	var csv = "LDR1, LDR2, LDR3, LDR4, Solenoid1, Solenoid2, Solenoid3 \n" + readings.join(";") + solenoidStates.join("\n");

	fs.writeFile("log.txt", csv, function(err) {
	    // if(err) {
	    //     console.log(err);
	    // } 
	    // else {
	    //     console.log("The file was saved!");
	    // }
	}); 
}




/* Main application */

board.on("ready", function() {

	console.log('Applicaton started');

	initiatePins();

/* Main loop */

setInterval(function(){
	updateAllReadings();
	
	writeReadingsToFile();

	fireSolenoid(solenoids[0]);

	// console.log(readings);

	},400);

	
  });


