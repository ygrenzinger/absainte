'use strict';

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-39370198-1']);
_gaq.push(['_trackPageview']);

$(document).ready(function () {

    //Fallback
    if (typeof jQuery == 'undefined') {
        document.write('<script src="/components/jquery/jquery.min.js"><\/script>');
    }
    if (typeof $().validate == 'undefined') {
        document.write('<script src="/components/jquery-validation/jquery.validate.min.js"><\/script>');
    }

    //Google Analytics
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

    //Footer
    (function() {
        var elmt = document.getElementById('copyright');
        elmt.innerHTML = '&copy; Absainte.';
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

    $('.thumbnails').slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
        dots: true,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    infinite: true,
                    dots: true,
                    speed: 300,
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
        ]
    });

    $('.homepage').slick({
        infinite: true,
        lazyLoad: 'progressive',
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 4,
        centerMode: true,
        variableWidth: true,
        accessibility: false,
        arrows: false
    });

});
