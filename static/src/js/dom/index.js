
var $ = require('jQuery');

$(function() {
    $('#side-menu').metisMenu();
});


$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100;
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });


    var url = window.location.hash;
    $('[href="'+ url +'"]').parent().parent().parent().addClass('active');
    $('[href="'+ url +'"]').parent().parent().addClass('in').attr('aria-expanded', true);
    $('[href="'+ url +'"]').focus();
    $('#side-menu a').removeClass('active');
    $('[href="'+ url +'"]').addClass('active');
}); 
