/* Constants */ 

var SHORT_AVERAGE_LENGTH = 2;
var MEDIUM_AVERAGE_LENGTH = 10;

var GAME_INTERVAL = 100;

/* Global Variables */ 

var currentTime = 0;


// game
    //sensor
    // lanes

    // lane
        // sensor
            //readings
        // sheep
        // solenoid
// Sensor
    // Readings



/*Objects*/




function game() {

    // Connect to board

    var five = require("johnny-five");
    var board = new five.Board();

    // Set up keyboard

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
            // Update time 

            console.log(currentTime);


            currentTime = currentTime + GAME_INTERVAL;

         }, GAME_INTERVAL);

    });
}


game();



function Lane(sensorPin, sensorThreshold, sensorDelay, solenoidPin, solenoidKey) {
    this.sensorPin = sensorPin;
    this.sensorThreshold = sensorThreshold;
    this.sensorDelay = sensorDelay;
    this.solenoidPin = solenoidPin;
    this.solenoidKey = solenoidKey;
    this.sensor = new Sensor (sensorPin, sensorThreshold);

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



}

function Sensor(pin, threshold) {

    // Is there anything clever i can do to make sure i always update the readings before the first method is called?

    this.pin = pin;
    this.threshold = threshold;

    var five = require("johnny-five"); // Do i really need to require this again?

    this.fivePin = new five.Pin(pin);

    this.readings = [];

    this.takeReading = function () {
        var sensorReading = this.fivePin.value;
        var fullReading = new Reading(currentTime,sensorReading)
        this.readings.push(fullReading);
    };
    
    this.calculateRollingAverage = function(array, averageLength) {

        var tempArray = array.slice(0); // Otherwise just acts as a pointer and messes up readings[]
        var subArray =  tempArray.splice(tempArray.length - averageLength, averageLength);
        var sumOfArrayValues = 0;

        for (var i=0; i < subArray.length; i++)
        {
            sumOfArrayValues = sumOfArrayValues + subArray[i].value;
        }

        return sumOfArrayValues / subArray.length;
    };

    this.shortAverage = function() {
        return this.calculateRollingAverage(this.readings,SHORT_AVERAGE_LENGTH);
    }

    this.mediumAverage = function() {
        return this.calculateRollingAverage(this.readings,MEDIUM_AVERAGE_LENGTH);
    }

    this.ratioOfAverages = function () {
        return (this.shortAverage() / this.mediumAverage());
    }

    this.isTriggered = function () {
        if (this.ratioOfAverages() > this.threshold) {
            console.log('Triggered')
            return true;
        }
        else {
            return false;
        }
    }
}

function Sheep (timeSpotted) {
    this.timeSpotted = timeSpotted;
    this.activeSheep = false;
}


function Reading(time,value) {
    this.time = time;
    this.value = value;
}




