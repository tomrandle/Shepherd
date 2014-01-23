


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


/* Constants */ 

var SHORT_AVERAGE_LENGTH = 2;
var MEDIUM_AVERAGE_LENGTH = 10;


/* Global Variables */ 

var currentTime = 0;

function Sensor(postion, pin, threshold) {
    this.postion = postion;
    this.pin = pin;

    // this.fivePin = new five.Pin(pin);

    readings = [];

    // this.takeReading = function () {
    //     var sensorReading = this.fivePin.value;
    //     var fullReading = new Reading(currentTime,sensorReading)
    //     this.readings.push(fullReading); 

    // };
    
    this.helloWorld = function() {return 'Hello world!';}

    this.calculateRollingAverage = function(array, averageLength) {
        var subArray =  array.splice(array.length - averageLength, averageLength);
        var sumOfArrayValues = 0;

        for (var i=0; i < subArray.length; i++)
        {
            sumOfArrayValues = sumOfArrayValues + subArray[i].value;
        }

        return sumOfArrayValues / subArray.length;
    };

    
    this.shortAverage = this.calculateRollingAverage(readings,SHORT_AVERAGE_LENGTH);
    this.mediumAverage = this.calculateRollingAverage(readings,MEDIUM_AVERAGE_LENGTH);

}


function Reading(time,value) {
    this.time = time;
    this.value = value;
}




