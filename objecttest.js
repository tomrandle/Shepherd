// Define reading

var reading = { 
	"time": "", 
	    "ldrReadings": {
	        "left": "", 
	        "top": "", 
	        "middle": "", 
	        "bottom": "",
	    },
	    "solenoidStates": {
	        "top": "", 
	        "middle": "", 
	        "bottom": "",
	    }
	};

// Define sheep 

var sheep = { 
		"timeSpotted" : "",
		"lane" :"",
		"speed" : "",
		"expectedArrivalTime" : "",
	};


// Assign values

reading.time = "122";
reading.ldrReadings.left = "1";
reading.ldrReadings.top = "1";
reading.ldrReadings.middle = "1";
reading.ldrReadings.bottom = "1";

reading.solenoidStates.top = "1";
reading.solenoidStates.middle = "1";
reading.solenoidStates.bottom = "1";



// 


var allreadings = [reading];
var allSheep = [sheep];


reading.time = "234";

allreadings.push(reading);
console.log (allreadings);




console.log (allreadings[0].event);
