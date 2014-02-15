
/* Set iframe heights in responsive layout */

var WIDTH_TO_HEIGHT_RATIO = 16/9;

$( window ).resize(function() {
    var frameWidth = $( ".wrapper" ).width();
    $('figure iframe').height(frameWidth / WIDTH_TO_HEIGHT_RATIO);
});