

// Import test data

// var data = require('./log/log-1390162215609.json');
var data = require('./log/log-1390162215609.json');


function Reading(time, value) {
	    this.time = time;
	    this.value = value;
	}

var readings = [];

// Simulate the data coming in in real time

for (var i = 0; i < data.length; i++) {

 	// Simulate iterating through the sensors

	 for(var key in data[0]) {
        
    	if (key === 'topLDR' || 'bottomLDR' || 'middleLDR') {

    		var sensorReading = data[i][key];
			var readingTime = data[i].time;

			var reading = new Reading(readingTime,sensorReading);
			readings.push(reading);

			// Actual function we're testing

			var checkData = require('./checkData');
			checkData.checkForSheep(readings);

    	}
    }	
};

          

