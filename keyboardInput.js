/* Return new key presses - Adapted from http://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
 */

var stdin = process.stdin;
var keyPresses  = [];


// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );

// on any data into stdin
stdin.on( 'data', function( key ){
  // ctrl-c ( end of text )

  if ( key === '\u0003' ) {
    process.exit();
  }

  keyPresses.push(key);

  console.log(keyPresses);
});




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


function checkIfShouldFire(solenoid) {
    if (!solenoid.on) {
        console.log('Solenoid not on');
    }
}

checkIfShouldFire(solenoids[0]);

