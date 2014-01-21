
// var data = require('./log/log-1390162215609.json');
var data = require('./log/log-1390162215609.json');
var checkData = require('./checkData');

function Reading(time, value) {
	    this.time = time;
	    this.value = value;
	}

	var readings = [];

	for (var i = 0; i < data.length; i++) {

		// 'Get' readings

		var sensorReading = data[i].bottomLDR;
		var readingTime = data[i].time;


		var reading = new Reading(readingTime,sensorReading);
		readings.push(reading);

		checkData.checkForSheep(readings);
	};


