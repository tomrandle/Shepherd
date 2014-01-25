// Includes

var five = require("johnny-five");

// Led 

var Led = function (pin) {
    this.pin = pin;
    this.fivePin = new five.Pin(pin);

    this.turnLedOn = function() {
        this.fivePin.high();
    }

    this.turnLedOff = function() {
        this.fivePin.low();
    }
}

// Export module

module.exports = Led;