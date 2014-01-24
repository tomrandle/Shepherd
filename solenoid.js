// Includes

var five = require("johnny-five");

// Solenoid 

var Solenoid = function (pin) {
    this.pin = pin;
    this.fivePin = new five.Pin(pin);
    this.currentlyFiring = false;

    this.fireSolenoid = function() {
        this.fivePin.high();
        this.currentlyFiring = true;
    }

    this.turnOffSolenoid = function() {
        this.fivePin.low();
        this.currentlyFiring = false;
    }
}

// Export module

module.exports = Solenoid;