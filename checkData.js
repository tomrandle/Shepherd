
var data = require('./log/log-1390162215609.json');

var readings = [];
var latestReadings = [];

var setSize = 10;

for (var i = 0; i < data.length; i++) {
	readings.push(data[i].middleLDR);
}

for (var i = readings.length - setSize; i < readings.length; i++) {
	latestReadings.push(readings[i]);
}



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



console.log(readings);
console.log(latestReadings);

console.log(calculateAverage(readings));
console.log(calculateAverage(latestReadings));

