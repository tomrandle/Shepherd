var stdin = process.stdin;

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

  if (key === 'a') {
  	console.log('hello!');
  }
  // write the key to stdout all normal like
  process.stdout.write(key);
});


// var keypress = require('keypress');

// // make `process.stdin` begin emitting "keypress" events
// keypress(process.stdin);

// // listen for the "keypress" event
// process.stdin.on('keypress', function (ch, key) {
//   console.log('got "keypress"', key);
//   if (key && key.ctrl && key.name == 'c') {
//     process.stdin.pause();
//   }
// });

// process.stdin.setRawMode(true);
// process.stdin.resume();