/* 
    Return new key presses
    Adapted from 
*/

// Set up input - http://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin

var keyPresses  = [];

var stdin = process.stdin;

stdin.setRawMode( true );

stdin.resume();

stdin.setEncoding( 'utf8' );


// Listen for input 

stdin.on( 'data', function( key ){
  
  // Exit if ctrl-c

  if ( key === '\u0003' ) {
    process.exit();
  }

  keyPresses.push(key);
  console.log(keyPresses);

  // App functions to check impact of keyboard - won't eventually need to be here. 

    for (var i=0; i < solenoids.length; i++) {
        queueKeyPresses(solenoids[i]);
        checkIfShouldFire(solenoids[i]);
    };
 
});

console.log('la la la la');



var solenoids = [
    {
		"position" : "top",
		"pin" : 8,
		"key" : "i",
		"on" : false,
		"unactionedKeypress" : false
	},
	{
		"position" : "middle",
		"pin" : 9,
		"key" : "o",
		"on" : false,
		"unactionedKeypress" : false
	},
    {
		"position" : "bottom",
		"pin" : 10,
		"key" : "p",
		"on" : false,
		"unactionedKeypress" : false
	}];


function queueKeyPresses(solenoid) {
    
    // Reverse for loop so it works when elements are removed

    for(var i = keyPresses.length -1; i >= 0 ; i--) {
        if(keyPresses[i] === solenoid.key) {
            keyPresses.splice(i, 1);  
            solenoid.unactionedKeypress = true;
            console.log(solenoid.unactionedKeypress);

        };
    }}

function checkIfShouldFire(solenoid) {

    /* Is there an unactioned keypress? */

    if (solenoid.unactionedKeypress) {
        console.log ("Fire because there's an unactionedKeypress");
        solenoid.unactionedKeypress = false;
        fireSolenoid(solenoid);
    }

    /* Is there a sheep in the queue? */


}

function fireSolenoid(solenoid) {
    console.log("Firing" + solenoid.position + "solenoid");
    solenoid.on = true;
}