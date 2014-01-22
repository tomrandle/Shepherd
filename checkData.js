// Constants

var SHORT_LENGTH = 2;
var MEDIUM_LENGTH = 20;
var TRIGGER_THRESHOLD = 1.05;


// Global variables

var numberOfSheep = 0;
var expectedNumberofSheep = 3;

var activeSheep = false;


// Functions

function Reading(time, value) {
	    this.time = time;
	    this.value = value;
	}


function calculateAverage(array) {

	var total = 0;
	var length = array.length;

	// console.log(length);

	for (var i=0; i < length; i++)
	{
		// console.log(array);
		total = total + array[i].value;
	}	

	var average = total / length;
	var time = array[length - 1].time;
	return new Reading(time,average);
}


function createArray(array, size) {

		var newArray = [];

		// If not enough data yet 
		if (array.length < size) {
			size = array.length
		}

		for (var i = array.length - size; i < array.length; i++) {
			newArray.push(array[i]);
		}

		return newArray;
	}


function checkThresholds(value1, value2, threshold) {

	var div = value1.value / value2.value;
		if (div > TRIGGER_THRESHOLD) {

			if (activeSheep === false) {
				activeSheep = true;
				console.log('Spotted a sheep @ ' + value1.time + ' with a ratio of : ' + div);
				numberOfSheep++;
			}
		}

			else {
				// console.log('No sheep');
				activeSheep = false;
			}
	}


exports.checkForSheep = function (data, activeSheep) {

	var readings = data;

	var shortReadings = [];
	var mediumReadings = [];

	var shortAverage = [];
	var mediumAverage = [];

	// Populate latest array

	var shortReadings = createArray(readings, SHORT_LENGTH);
	var mediumReadings = createArray(readings, MEDIUM_LENGTH);

	// Calculate averages 

	var mediumAverage = calculateAverage(mediumReadings);
	var shortAverage = calculateAverage(shortReadings);

	// Check trigger 

	checkThresholds(shortAverage,mediumAverage, TRIGGER_THRESHOLD);
		 
}

var sheepList = [];

function sheep(timeSpotted, lane, speed, expectedArrivalTime) {
    this.timeSpotted = timeSpotted;
    this.lane = lane;
    this.speed = speed;
    this.expectedArrivalTime;f
}







