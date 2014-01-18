/* Constants */

var TIME_INTERVAL = 400;

var currentGameTime = 0;

var keyPresses  = [];

/* Johnny Five */

var five = require("johnny-five");
var board = new five.Board();

/* Pins */

var sensors = [
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
		"position" : "middle",
		"pin" : 'A2',
		"fivePin" : '',
		"lastReading" : '',
		"readings" :[]
	},
	{
		"position" : "bottom",
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


/* Sheep */

var sheepList = [];

var sheep = { 
        "timeSpotted" : "",
        "lane" :"",
        "speed" : "",
        "expectedArrivalTime" : "",
    };

/* Log */

var logHistory = [];

var logItem = {
	'time' : 0,
	'frontLDR' : '',
	'topLDR' : '',
	'middleLDR' :'',
	'bottomLDR' :'',
	'topSolenoid' : '',
	'middleSolenoid' :'',
	'bottomSolenoid' : ''
};

/* Variables */

var readings = [];
var newReadings = [];



/* Initiate Pins */

function initiatePins() {

	for (var i=0; i < sensors.length; i++) {
		sensors[i].fivePin = new five.Pin(sensors[i].pin);
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

	for (var i=0; i < sensors.length; i++) {

		var reading = readPin(sensors[i].fivePin);

		sensors[i].lastReading = reading;
		sensors[i].readings.push(reading);

	};
};

/* Check keyboard input and */

function queueKeyPresses() {
    
	for (var i = 0; i < solenoids.length; i++) {

		var x = i;
		console.log(keyPresses);

		for(var j = keyPresses.length -1; j >= 0 ; j--) {
			if (keyPresses[j] == solenoids[x].key)
			{
				keyPresses.splice(j, 1);  
				solenoids[x].unactionedKeypress = true;
			}
		};
	}

};



/* Fire solenoid */ 

function fireSolenoid(pin) {
	pin.high();
}

function turnOffSolenoid(pin) {
	pin.low();
}


function checkSolenoids() {
	for (var i = 0; i < solenoids.length; i++) {

		if (solenoids[i].unactionedKeypress === true) {
			fireSolenoid(solenoids[i].fivePin);
		};
	};
}


/* Upadte log file */

function updateLog() {
	logItem.time = currentGameTime;
	logItem.frontLDR = sensors[0].lastReading;
	logItem.topLDR = sensors[1].lastReading;
	logItem.middleLDR = sensors[2].lastReading;
	logItem.bottomLDR = sensors[3].lastReading;
	logItem.topSolenoid = solenoids[0].on;
	logItem.middleSolenoid = solenoids[1].on;
	logItem.bottomSolenoid = solenoids[2].on;

	logHistory.push(logItem);

	var fs = require('fs');
}


function writeReadingsToFile() {
	fs.writeFile("log.txt", JSON.stringify(logHistory)); 
}


/********************/
/* Main application */
/********************/


/* Keyboard listening */


var stdin = process.stdin;

stdin.setRawMode( true );

stdin.resume();

stdin.setEncoding( 'utf8' );


// Listen for input 

stdin.on( 'data', function( key ){
  
  // Exit if ctrl-c

  if ( key === '\u0003' ) {
    process.exit();
  }

  keyPresses.push(key);

});


/* Set up board */

board.on("ready", function() {

	('Applicaton started');

	initiatePins();

/* Main loop */

setInterval(function(){
	
	updateAllReadings();
	writeReadingsToFile();

	checkSolenoids();
	// console.log(readings);


	console.log(keyPresses);
	queueKeyPresses();

	updateLog();

	currentGameTime += TIME_INTERVAL;

	},TIME_INTERVAL);
	
  });


