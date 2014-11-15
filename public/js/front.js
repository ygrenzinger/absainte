'use strict';

$(document).ready(function () {
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
            $('.product .left img').attr('src', imageUrl);
        })
    });
});
