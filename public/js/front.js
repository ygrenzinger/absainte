'use strict';

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-39370198-1']);
_gaq.push(['_trackPageview']);

$(document).ready(function () {

    if (typeof jQuery == 'undefined') {
        document.write('<script src="/components/jquery/jquery.min.js"><\/script>');
    }

    if (typeof $().validate == 'undefined') {
        document.write('<script src="/components/jquery-validation/jquery.validate.min.js"><\/script>');
    }

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

    (function() {
        var elmt = document.getElementById('copyright');
        elmt.innerHTML = '&copy; 2013-' + new Date().getFullYear() + ', Absainte.';
    })();

    var menu = $('.centered-navigation-menu');
    var menuToggle = $('.centered-navigation-menu-button');

    $(menuToggle).on('click', function (e) {
        e.preventDefault();
        menu.slideToggle(function () {
            if (menu.is(':hidden')) {
                menu.removeAttr('style');
            }
        });
    });

    var sharePageUrl = function () {
        return encodeURIComponent(window.location.href);
    };

    $('.share').on('click', function (e) {
        e.preventDefault();
        var shareUrl = $(e.target).attr('data-share-url');
        window.open(
            shareUrl + sharePageUrl(),
            'share-dialog',
            'width=626,height=436');
    });

    $('.product .thumbnails img').each(function () {
        var imageUrl = $(this).attr('data-url');
        $(this).click(function () {
            $('.product-left .main-img').attr('src', imageUrl);
        })
    });

    $('#buy-test').click(function (e) {
        e.preventDefault();
        $.post("buy", $("#buy-form").serialize()).done(function (data) {
            $('#buy-success').show();
        }).fail(function () {
            $('#buy-error').show();
        });
    });

    var bLazy = new Blazy({
        offset: 300, // Loads images 100px before they're visible
        container: '#homepage' // Default is window
    });


    $("#contact-form").validate({
        errorElement: "span"
    });

});
