
var data = require('./log/log-1390162215609.json');

var readings = [];
var shortReadings = [];
var mediumReadings = [];
var shortLength = 2;
var mediumLength = 20;

var shortAverage = [];
var mediumAverage = [];

var triggerThreshold = 1.05;

var numberOfSheep = 0;
var expectedNumberofSheep = 3;

var activeSheep = false;



// Functions

function calculateAverage(array) {

	var total = 0;
	var length = array.length;

	for (var i=0; i < length; i++)
	{
		total = total + array[i];
	}

	var average = total / length;
	return average;
}

function createArray(array, size) {

	var newArray = [];

	for (var i = array.length - size; i < array.length; i++) {
		newArray.push(array[i]);
	}

	return newArray;
}

function checkThresholds(array1, array2, threshold) {

	// console.log (array2 / array1);

	var div = array2 / array1;
	if (div > triggerThreshold) {

		if (activeSheep === false) {
			activeSheep = true;
			console.log('Spotted!' + div);
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
	readings.push(data[i].bottomLDR);


	// Populate latest array

	var shortReadings = createArray(readings, shortLength);
	var mediumReadings = createArray(readings, mediumLength);

	// Calculate averages 

	calculateAverage(readings);
	var mediumAverage = calculateAverage(mediumReadings);
	var shortAverage = calculateAverage(shortReadings);

	// Check trigger 

	checkThresholds(shortAverage,mediumAverage, triggerThreshold);
	 
}




