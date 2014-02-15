
$( document ).ready(function() {

    /* Set iframe heights in responsive layout */

    var WIDTH_TO_HEIGHT_RATIO = 16/9;

    $( window ).resize(function() {
        var frameWidth = $( ".wrapper" ).width();
        var frameHeight = frameWidth / WIDTH_TO_HEIGHT_RATIO;
        var cssHeight = frameHeight + 'px';

        $('figure iframe').height(cssHeight);

    });

});

