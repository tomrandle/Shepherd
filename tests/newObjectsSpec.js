describe("calculatesAverage", function() {
    it("calculatesAverage", function() {


        var x = new Sensor(1, 2,3);


        var testArray = 
            [{'time':'', 'value':2},
            {'time':'', 'value':1},
            {'time':'', 'value':10},
            {'time':'', 'value':5},
            {'time':'', 'value':15},
            ]
        
        expect(x.calculateRollingAverage(testArray,3)).toEqual(10);
        // expect(calculateRollingAverage(testArray,2)).toEqual(10);

    });

});

describe("Hello world", function() {
    it("says hello", function() {

        var x = new Sensor(1, 2,3);

        expect(x.helloWorld()).toEqual("Hello wowrld!");
        expect(x.bah).toEqual("bha");

    });
});