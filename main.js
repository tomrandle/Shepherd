/* Johnny Five */

var five = require("johnny-five");
var board = new five.Board();

/* Pins */

var sensors = [];


var sensorsNew = [
	{
		"position" : "front",
		"pin" : 'A0',
		"fivePin" : '',
		"lastReading" : '',
		"readings" :[]
	},
	{
		"position" : "top",
		"pin" : 'A1',
		"fivePin" : '',
		"lastReading" : '',
		"readings" :[]
	},
	{
		"position" : "top",
		"pin" : 'A2',
		"fivePin" : '',
		"lastReading" : '',
		"readings" :[]
	},
	{
		"position" : "top",
		"pin" : 'A3',
		"fivePin" : '',
		"lastReading" : '',
		"readings" :[]
	}
]

var solenoids = [
    {
		"position" : "top",
		"pin" : 8,
		"fivePin" : '',
		"key" : "i",
		"on" : false,
		"unactionedKeypress" : false
	},
	{
		"position" : "middle",
		"pin" : 9,
		"fivePin" : '',
		"key" : "o",
		"on" : false,
		"unactionedKeypress" : false
	},
    {
		"position" : "bottom",
		"fivePin" : '',
		"pin" : 10,
		"key" : "p",
		"on" : false,
		"unactionedKeypress" : false
	}];


/* Variables */

var readings = [];
var newReadings = [];



/* Initiate Pins */

function initiatePins() {

	for (var i=0; i < sensorsNew.length; i++) {
		sensorsNew[i].fivePin = new five.Pin(sensorsNew[i].pin);
	};

	for (var i=0; i < solenoids.length; i++) {
		solenoids[i].fivePin = new five.Pin(solenoids[i].pin);
	};
};


/* Read Pin */ 

function readPin(pin) {
	var reading = pin.value;
	return reading;
};

function updateAllReadings() {

	for (var i=0; i < sensorsNew.length; i++) {

		var reading = readPin(sensorsNew[i].fivePin);

		sensorsNew.lastReading = reading;
		sensorsNew[i].readings.push(reading);
		console.log(sensorsNew[i].readings);

	};
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

	var x = [];

	for (var i=0; i < sensorsNew.length; i++) {
		x[i] = sensorsNew[i].readings;
	}


	var csv = JSON.stringify(x);



	fs.writeFile("log.txt", csv, function(err) {
	    // if(err) {
	    //     console.log(err);
	    // } 
	    // else {
	    //     console.log("The file was saved!");
	    // }
	}); 
}


/********************/
/* Main application */
/********************/

board.on("ready", function() {

	console.log('Applicaton started');

	initiatePins();

/* Main loop */

setInterval(function(){
	updateAllReadings();
	
	writeReadingsToFile();

	fireSolenoid(solenoids[0].fivePin);

	// console.log(readings);

	},400);

	
  });


