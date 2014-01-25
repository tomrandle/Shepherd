// Todo: make it possible to save the light thresholds and make them read from a file. 


/* Includes */

var five = require("johnny-five");
var Sensor = require('./sensor.js');
var Solenoid = require('./solenoid.js');
var Led = require('./Led.js');


/* Constants */ 

var GAME_INTERVAL = 100;
var SOLENOID_PRESS_TIME = 300;

/* Global Variables */ 

var keyPresses = [];
var gameRunning = true;

/*Objects*/

function game() {

    // Check keyboard

    keyboard();

    // Connect to board

    var board = new five.Board();

    board.on("ready", function() {

        // Set up lanes

        var lanes = [
            {
                'name' : 'topLane',
                'lane' : new Lane('A0',1.02,500,10,'i',3),
                'differenceToFrontSensorRequiredForGameToStart' : 1.05
            },
            {
                'name' : 'middleLane',
                'lane' : new Lane('A1',1.02,500,9,'o',4),
                'differenceToFrontSensorRequiredForGameToStart' : 1.05
            },
            {
                'name' : 'bottomLane',
                'lane' : new Lane('A2',1.02,500,8,'p',5),
                'differenceToFrontSensorRequiredForGameToStart' : 0.90
            }
        ];

        // Set up extra sensor

        var gameOnSensor = new Sensor('A3', 1.05);

        // Interval loop

        setInterval(function(){

            // Read front sensor

            gameOnSensor.takeReading();
            var gameSensorValue = gameOnSensor.mediumAverage();

            // For each lane

                for (var i = 0; i < lanes.length; i++) {
                    var currentLane = lanes[i].lane;
                    
                    // Take readings

                    currentLane.sensor.takeReading();

                    // Do checks if the game is running

                    if (gameRunning) {
                        currentLane.updateSheep();
                        currentLane.decideWhetherToFireSolenoid();
                    }
                }

            // Check if game running 


            var testValues = [
                lanes[0].lane.sensor.mediumAverage() * lanes[0].differenceToFrontSensorRequiredForGameToStart,
                lanes[1].lane.sensor.mediumAverage() * lanes[1].differenceToFrontSensorRequiredForGameToStart,
                lanes[2].lane.sensor.mediumAverage() * lanes[2].differenceToFrontSensorRequiredForGameToStart
            ]



            // if (gameSensorValue > testValues[0] && gameSensorValue > testValues[1] && testValues[2])
            // {
            //     gameRunning = true;
            // }

            // else {
            //     gameRunning = false;
            //     console.log(gameSensorValue, testValues[0], testValues[1],testValues[2]);

            // }

        }, GAME_INTERVAL);

    });
}

game();

function Lane(sensorPin, sensorThreshold, sensorDelay, solenoidPin, solenoidKey, ledPin) {
    
    this.sensor = new Sensor (sensorPin, sensorThreshold);
    this.solenoid = new Solenoid (solenoidPin);
    this.led = new Led (ledPin);
    this.alreadyActive = false; 
    this.sheepQueue = [];

    this.activeSensor = function () {
        return this.sensor.isTriggered();
    }

    this.updateSheep = function () {
        if (this.activeSensor() === true && this.alreadyActive === false)
        {
            this.alreadyActive = true;
            this.led.turnLedOn();
            var newSheep = new Sheep(currentTime());

            beep();
            this.sheepQueue.push(newSheep); 
        }
            
        else if (this.activeSensor() === false) {
            this.alreadyActive = false;
            this.led.turnLedOff();
        }
    }

    this.decideWhetherToFireSolenoid = function () {

        // Check if keyboard pressed 

        this.solenoid.turnOffSolenoid();

        for (var i=0; i < keyPresses.length; i++) {

            var timeKeyPressed = keyPresses[i].timePressed;

            if (keyPresses[i].key === solenoidKey && currentTime() < timeKeyPressed + SOLENOID_PRESS_TIME) {

                this.solenoid.fireSolenoid();
            }

        }
        
        // Check if sheep arrived

        for (var i=0; i < this.sheepQueue.length; i++) {

            var timeSpotted = this.sheepQueue[i].timeSpotted;

            if (currentTime() < timeSpotted + sensorDelay + SOLENOID_PRESS_TIME && currentTime() > timeSpotted + sensorDelay) {
                this.solenoid.fireSolenoid();
            }
        }

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

function beep(){
  console.log("\007");
}

// Objects

function keyPress(key, timePressed) {
    this.key = key;
    this.timePressed = timePressed;
}

var Sheep = function(timeSpotted) {
    this.timeSpotted = timeSpotted;
    this.timePassed = '';
}



