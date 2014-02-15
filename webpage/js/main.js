var WIDTH_TO_HEIGHT_RATIO = 16/9;

$( document ).ready(function() {

    sizeVideos();

    $( window ).resize(function() {
       sizeVideos();
    });

    /* Set iframe heights in responsive layout */

    function sizeVideos() {
        var frameWidth = $( ".wrapper" ).width();
        var frameHeight = frameWidth / WIDTH_TO_HEIGHT_RATIO;
        var cssHeight = frameHeight + 'px';

        $('figure iframe').height(cssHeight);
    }

});

