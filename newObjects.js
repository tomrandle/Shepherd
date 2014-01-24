
/* Includes */

var five = require("johnny-five");
var Sensor = require('./sensor.js');
var Solenoid = require('./solenoid.js');

/* Constants */ 

var GAME_INTERVAL = 100;
var SOLENOID_PRESS_TIME = 300;

/* Global Variables */ 

var keyPresses = [];

/*Objects*/

function game() {

    // Check keyboard

    keyboard();

    // Connect to board

    var board = new five.Board();

    board.on("ready", function() {

        // Set up lanes

        var topLane = new Lane('A0',1.05,1,10,'i');
        var middleLane = new Lane('A1',1.05,1,9,'o');
        var bottomLane = new Lane('A2',1.05,1,8,'p');

        // Set up extra sensor

        // Interval loop

        setInterval(function(){

            // Do all the checks

            topLane.sensor.takeReading();
            console.log(topLane.sensor.ratioOfAverages());
            topLane.updateSheep();

            topLane.decideWhetherToFireSolenoid();
            

         }, GAME_INTERVAL);

    });
}

game();

function Lane(sensorPin, sensorThreshold, sensorDelay, solenoidPin, solenoidKey) {
    
    this.sensor = new Sensor (sensorPin, sensorThreshold);
    this.solenoid = new Solenoid (solenoidPin);
    this.alreadyActive = false; 
    this.sheepQueue = [];

    this.activeSensor = function () {
        return this.sensor.isTriggered();
    }

    this.updateSheep = function () {
        if (this.activeSensor() === true && this.alreadyActive === false)
        {
            console.log('new sheep');
            this.alreadyActive = true;
        }

        else if (this.activeSensor() === false) {
            this.alreadyActive = false;
        }
   
    }

    this.decideWhetherToFireSolenoid = function () {

        // Check if keyboard pressed 

        this.solenoid.turnOffSolenoid();


        for (var i=0; i < keyPresses.length; i++) {


            var timeKeyPressed = keyPresses[i].timePressed;

            if (keyPresses[i].key === solenoidKey && currentTime() < timeKeyPressed + SOLENOID_PRESS_TIME) {

                console.log(timeKeyPressed, currentTime())

                this.solenoid.fireSolenoid();
            }

        }
        
        // Check if sheep arrived
    }
}


// Functions

function keyboard() {
    var stdin = process.stdin;
    stdin.setRawMode( true );
    stdin.resume();
    stdin.setEncoding( 'utf8' );

    stdin.on( 'data', function( key ) {

      // Exit if ctrl-c
        if ( key === '\u0003' ) {
            process.exit();
        }

        lastKeyPress = new keyPress(key, currentTime());
        keyPresses.push(lastKeyPress);

    });
}

function currentTime() {
    var date = new Date();
    return date.getTime();
}

// Objects

function Sheep (timeSpotted) {
    this.timeSpotted = timeSpotted;
    this.activeSheep = false;
}

function keyPress(key, timePressed) {
    this.key = key;
    this.timePressed = timePressed;
}



