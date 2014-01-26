// Includes

var five = require("johnny-five");

// Constants

var SHORT_AVERAGE_LENGTH = 2;
var MEDIUM_AVERAGE_LENGTH = 10;

// Variables

var date = new Date();
var currentTime = date.getTime();


// Sensor Object

var Sensor =  function (pin, threshold) {

    this.pin = pin;
    this.threshold = threshold;
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
            return true;
        }
        else {
            return false;
        }
    }
}

// Reading object 

function Reading(time,value) {
    this.time = time;
    this.value = value;
}

// Export module

module.exports = Sensor;
