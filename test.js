
/* Johnny Five */

var five = require("johnny-five");
var board = new five.Board();

var sensorPins = ['A0','A1','A2','A3'];
var sensors = [];

var readings = [];
var newReadings = [];


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

	newReadings = [];

	for (var i=0; i < sensors.length; i++) {
		var reading = readPin(sensors[i]);

		newReadings[i] = reading;

		// console.log("Pin:", i, reading);

	};

	readings.push(newReadings);
};


/* Write readings to file */

var fs = require('fs');

function writeReadingsToFile() {

	var csv = "LDR1, LDR2, LDR3, LDR4 \n" + readings.join("\n");

	fs.writeFile("log.txt", csv, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
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

	// console.log(readings);

	},400);

	
  });


