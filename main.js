/*************************************************************
  ____    _                      _                         _ 
 / ___|  | |__     ___   _ __   | |__     ___   _ __    __| |
 \___ \  | '_ \   / _ \ | '_ \  | '_ \   / _ \ | '__|  / _` |
  ___) | | | | | |  __/ | |_) | | | | | |  __/ | |    | (_| |
 |____/  |_| |_|  \___| | .__/  |_| |_|  \___| |_|     \__,_|
                        |_|                                  
**************************************************************/


// Todo: make it possible to save the light thresholds and make them read from a file. 

/* Includes */

var five = require("johnny-five");
var fs = require('fs');

var Sensor = require('./sensor.js');
var Solenoid = require('./solenoid.js');
var Led = require('./Led.js');

/* Constants */ 

var GAME_INTERVAL = 50;
var SOLENOID_PRESS_TIME = 300;

/* Global Variables */ 

var keyPresses = [];
var gameRunning = false;

var jsonLogData = [];
var csvLogData = 'time, topLDR, middleLDR, bottomLDR, topSolenoid, middleSolenoid, bottomSolenoid';

var jsonFilePath = "log/log.json";
var csvFilePath = "log/log.csv";


/*Objects*/

function game() {


    // Check keyboard

    keyboard();

    // Connect to board

    var board = new five.Board();

    board.on("ready", function() {

        console.log('Press "s" to start');

        // Set up lanes

        var lanes = [
            {
                'name' : 'topLane',
                'lane' : new Lane('A2',1.02,400,5,'i',8,2,500),
            },
            {
                'name' : 'middleLane',
                'lane' : new Lane('A1',1.03,200,6,'o',9,3,500),
            },
            {
                'name' : 'bottomLane',
                'lane' : new Lane('A0',1.03,400,7,'p',10,4,550),
            }
        ];

        // Interval loop

        setInterval(function(){

            // For each lane

                for (var i = 0; i < lanes.length; i++) {
                    var currentLane = lanes[i].lane;
                    
                    // Take readings

                    currentLane.sensor.takeReading();

                    // Do checks if the game is running

                    if (gameRunning) {
                        currentLane.updateSheep();
                        currentLane.decideWhetherToFireSolenoid();

                        // Update log

                        var topReadings = lanes[0].lane.sensor.readings;
                        var middleReadings = lanes[1].lane.sensor.readings;
                        var bottomReadings = lanes[2].lane.sensor.readings;

                        var topReading = topReadings[topReadings.length-1].value;
                        var middleReading = middleReadings[middleReadings.length-1].value;
                        var bottomReading = bottomReadings[bottomReadings.length-1].value;

                        var topSolenoid = lanes[0].lane.solenoid.currentlyFiring;
                        var middleSolenoid = lanes[1].lane.solenoid.currentlyFiring;
                        var bottomSolenoid = lanes[2].lane.solenoid.currentlyFiring;

                        // JSON 

                        var jsonLogEntry = {
                            'time': currentTime(),
                            'topLDR': topReading,
                            'middleLDR' : middleReading ,
                            'bottomLDR' : bottomReading,
                            'topSolenoid' : topSolenoid,
                            'middleSolenoid' : middleSolenoid,
                            'bottomSolenoid' : bottomSolenoid
                        };

                        jsonLogData.push(jsonLogEntry);

                        // CSV

                        var csvRow = '\n' + currentTime() + ',' + topReading + ',' + middleReading + ',' + bottomReading + ',' + topSolenoid + ',' + middleSolenoid + ',' + bottomSolenoid;

                        csvLogData = csvLogData + csvRow;
                        fs.writeFile(csvFilePath, csvLogData);
                    }
                }

        }, GAME_INTERVAL);

    });
}

game();

function Lane(sensorPin, sensorThreshold, sensorDelay, solenoidPin, solenoidKey, ledPin, secondSolenoidPin, secondDelay) {

    this.sensor = new Sensor (sensorPin, sensorThreshold);
    this.solenoid = new Solenoid (solenoidPin);
    this.led = new Led (ledPin);
    this.alreadyActive = false; 
    this.solenoidKey = solenoidKey;
    this.sensorDelay = sensorDelay;
    this.solenoidPin = solenoidPin;
    this.secondSolenoid = new Solenoid (secondSolenoidPin);
    this.secondDelay = secondDelay;

    this.sheepQueue = [];

    this.activeSensor = function () {
        return this.sensor.isTriggered();
    }

    this.updateSheep = function () {

        //Todo: make this smarter so it works out the speed of the sheep. 

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

        // Set solenoids to off

        this.solenoid.turnOffSolenoid();
        this.secondSolenoid.turnOffSolenoid();

        // Check if keyboard pressed 

        for (var i=0; i < keyPresses.length; i++) {

            var timeKeyPressed = keyPresses[i].timePressed;

            if (keyPresses[i].key === this.solenoidKey && currentTime() < timeKeyPressed + SOLENOID_PRESS_TIME) {
                this.solenoid.fireSolenoid();
            }

        }
        
        // Check if sheep arrived

        for (var i=0; i < this.sheepQueue.length; i++) {

            var timeSpotted = this.sheepQueue[i].timeSpotted;

            // Todo: tidy up these calculations

            if (currentTime() < timeSpotted + this.sensorDelay + SOLENOID_PRESS_TIME && currentTime() > timeSpotted + this.sensorDelay) {
                this.solenoid.fireSolenoid();
            }

            if (currentTime() < timeSpotted + this.sensorDelay + this.secondDelay + SOLENOID_PRESS_TIME && currentTime() > timeSpotted + this.sensorDelay + this.secondDelay) {
                this.secondSolenoid.fireSolenoid();
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

        if ( key === 's') {
            gameRunning = !gameRunning;

            if(gameRunning) {
                console.log('Game started...');
            }
            else {
                console.log('Game stopped...');
            }
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




