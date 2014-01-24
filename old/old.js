/********************/
/* Global Variables */
/********************/

/* Constants */

var TIME_INTERVAL = 100;
var KEY_DURATION = 400;

/* Global variables */

var date = new Date()
var timeGameStarted = date.getTime();

var currentGameTime = 0;
var keyPresses  = [];

function keyPress(key, timePressed) {
    this.key = key;
    this.timePressed = timePressed;
}

var sensors = [
    {
        "position" : "front",
        "pin" : 'A3',
        "fivePin" : '',
        "lastReading" : '',
        "readings" :[], 
    },
    {
        "position" : "top",
        "pin" : 'A0',
        "fivePin" : '',
        "lastReading" : '',
        "readings" :[]
    },
    {
        "position" : "middle",
        "pin" : 'A1',
        "fivePin" : '',
        "lastReading" : '',
        "readings" :[]
    },
    {
        "position" : "bottom",
        "pin" : 'A2',
        "fivePin" : '',
        "lastReading" : '',
        "readings" :[]
    }
];

var solenoids = [
    {
        "position" : "top",
        "pin" : 10,
        "fivePin" : '',
        "key" : "i",
        "on" : false,
        "activeKeypress" : false
    },
    {
        "position" : "middle",
        "pin" : 9,
        "fivePin" : '',
        "key" : "o",
        "on" : false,
        "activeKeypress" : false
    },
    {
        "position" : "bottom",
        "fivePin" : '',
        "pin" : 8,
        "key" : "p",
        "on" : false,
        "activeKeypress" : false
    }
];


var logHistory = [];

function logItem(time, frontLDR, topLDR, middleLDR, bottomLDR, topSolenoid, middleSolenoid, bottomSolenoid) {
    this.time = time;
    this.frontLDR = frontLDR;
    this.topLDR = topLDR;
    this.middleLDR = middleLDR;
    this.bottomLDR = bottomLDR;
    this.topSolenoid = topSolenoid;
    this.middleSolenoid = middleSolenoid;
    this.bottomSolenoid = bottomSolenoid;
}

function reading(time, value) {
    this.time = time;
    this.value = value;
}

/* Initiate Pins */

function initiatePins() {

    for (var i=0; i < sensors.length; i++) {
        sensors[i].fivePin = new five.Pin(sensors[i].pin);
    }

    for (var i=0; i < solenoids.length; i++) {
        solenoids[i].fivePin = new five.Pin(solenoids[i].pin);
    }
}

/* Read Pin */

function readPin(pin) {
    var reading = pin.value;
    return reading;
}

function updateAllReadings() {

    for (var i=0; i < sensors.length; i++) {

        var latestReading = new reading(currentGameTime, readPin(sensors[i].fivePin))

        sensors[i].lastReading = latestReading.value;
        sensors[i].readings.push(latestReading);
    }
}

/* Check keyboard input */

function queueKeyPresses() {
   
    for (var i = 0; i < solenoids.length; i++) {

        var x = i;
        solenoids[x].activeKeypress = false;

        for(var j = 0; j < keyPresses.length; j++) {

            // Todo: Remove old presses
            // Check if key matches

            if (keyPresses[j].key === solenoids[x].key && keyPresses[j].timePressed + KEY_DURATION > currentGameTime )
            {      
                solenoids[x].activeKeypress = true;
            }
        }
    }

}

/* Solenoid firing*/

function fireSolenoid(solenoid) {
    solenoids[solenoid].fivePin.high();
    solenoids[solenoid].on  = true;
}

function turnOffSolenoid(solenoid) {
    solenoids[solenoid].fivePin.low();
    solenoids[solenoid].on  = false;
}

function checkSolenoids() {

    for (var i = 0; i < solenoids.length; i++) {

    /* Read current state */

        if (solenoids[i].activeKeypress === true) {
            fireSolenoid(i);
        }

        else {
            turnOffSolenoid(i);
        }
    }
}


/* Update log file */

function updateLog() {

    var latestLog = new logItem(
        currentGameTime,
        sensors[0].lastReading,
        sensors[1].lastReading,
        sensors[2].lastReading,
        sensors[3].lastReading,
        solenoids[0].on,
        solenoids[1].on,
        solenoids[2].on
    );

    logHistory.push(latestLog);

}

var fs = require('fs');

function writeReadingsToFile() {

    // JSON File

    var filePath = "log/log-" + timeGameStarted + ".json";
    fs.writeFile(filePath, JSON.stringify(logHistory));

    // CSV File

    var csvHeadings = ''; 
    var csvValues = '';

    for(var key in logHistory[0]) {
        csvHeadings = csvHeadings + key + ",";
    }

    for (var i = 0; i < logHistory.length; i++) {
        var valueRow = '';
        var j = i;
            for(var key in logHistory[j]) {

                var value = logHistory[j][key];

                // Swap solenoid states to numbers to make analysis easier. 
                if (value === true) {
                    value = 1024;
                }

                if (value === false) {
                    value = 0;
                }

                valueRow = valueRow + value + ",";
            }   

            csvValues = csvValues + "\n" + valueRow;
    }

    var csvContent = "\n" + csvHeadings + csvValues;

    var filePath = "log/log-" + timeGameStarted + ".csv";
    fs.writeFile(filePath, csvContent);

}

function alertTerminal(){
  console.log("\007");
}

function checkData() {

}

/********************/
/* Main application */
/********************/


/* Set up keyboard listening */

var stdin = process.stdin;

stdin.setRawMode( true );
stdin.resume();
stdin.setEncoding( 'utf8' );

/* Listen for input */

stdin.on( 'data', function( key ) {

  // Exit if ctrl-c
    if ( key === '\u0003' ) {
        process.exit();
    }

    lastKeyPress = new keyPress(key, currentGameTime);
    keyPresses.push(lastKeyPress);

});



/* Set up Johnny Five */

var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

    ('Applicaton started');

    initiatePins();



/* Main loop */

setInterval(function(){
    
    updateAllReadings();
    writeReadingsToFile();

    checkData();

    checkSolenoids();
    
    // console.log(sensors[0].readings);

    queueKeyPresses();

    updateLog();

    currentGameTime += TIME_INTERVAL;

    },TIME_INTERVAL);
    
  });


