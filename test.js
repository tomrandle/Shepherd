
/* Johnny Five */

var five = require("johnny-five");
var board = new five.Board();

var ldr, strobe;
/* Initiate pins */

function initiatePins() {
	strobe = new five.Pin(13);
  	ldr = new five.Pin('A0');
}


/* Read Pin */ 

function readPin(pin) {
	var reading = pin.value;
	console.log(reading);
}


/* Main application */

board.on("ready", function() {

	console.log('Applicaton started');

	initiatePins();

/* Main loop */

setInterval(function(){readPin(ldr)},400);

  });


