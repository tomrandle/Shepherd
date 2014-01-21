
// var data = require('./log/log-1390162215609.json');
var data = require('./log/log-1390162215609.json');


function Reading(time, value) {
	    this.time = time;
	    this.value = value;
	}


exports.checkForSheep = function () {

	// Constants

	var SHORT_LENGTH = 2;
	var MEDIUM_LENGTH = 20;
	var TRIGGER_THRESHOLD = 1.05;

	// Readings to replace with main object;

	var readings = [];


	var shortReadings = [];
	var mediumReadings = [];

	var shortAverage = [];
	var mediumAverage = [];


	var numberOfSheep = 0;
	var expectedNumberofSheep = 3;

	var activeSheep = false;



	// Functions

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
				activeSheep = false;
			}
	}






	// Main loop

	for (var i = 0; i < data.length; i++) {

		// 'Get' readings

		var sensorReading = data[i].bottomLDR;
		var readingTime = data[i].time;


		var reading = new Reading(readingTime,sensorReading);
		readings.push(reading);



		// Populate latest array

		var shortReadings = createArray(readings, SHORT_LENGTH);
		var mediumReadings = createArray(readings, MEDIUM_LENGTH);



		// // Calculate averages 

		calculateAverage(readings);
		var mediumAverage = calculateAverage(mediumReadings);
		var shortAverage = calculateAverage(shortReadings);

		// // Check trigger 

		checkThresholds(shortAverage,mediumAverage, TRIGGER_THRESHOLD);
		 
	}


};





