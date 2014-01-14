/**
 * Sample script to blink LED 13
	PORT = '/dev/tty.usbmodem1421' #RHS
	#PORT = '/dev/tty.usbmodem1411' #LHS
	https://github.com/jgautier/firmata
 */


console.log('blink start ...');

var ledPin = 13;

var firmata = require('/usr/local/lib/node_modules/firmata');
var board = new firmata.Board('/dev/tty.usbmodem1411', function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('connected');

    console.log('Firmware: ' + board.firmware.name + '-' + board.firmware.version.major + '.' + board.firmware.version.minor);

    var ledOn = true;
    board.pinMode(ledPin, board.MODES.OUTPUT);

    setInterval(function(){

        if (ledOn) {
        console.log('+');
        board.digitalWrite(ledPin, board.HIGH);
        }
        else {
        console.log('-');
        board.digitalWrite(ledPin, board.LOW);
        }

        ledOn = !ledOn;

    },500);

});