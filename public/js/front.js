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

    $('.flag').on('click', function (e) {
        e.preventDefault();
        var lang = $(e.target).attr('data-lang');
        var pathname = window.location.pathname;
        var pathlang = '';
        var langRegex = /^\/(fr|en)\//g;
        var langUrl = langRegex.exec(pathname);
        if (langUrl !== null) {
            if (langUrl[1] === lang) {
                return;
            } else {
                pathname = window.location.pathname.slice(3);
            }
        } else {
            if (lang === 'en') {
                return;
            } else {
                pathlang = '/' + lang;
            }
        }
        window.location = window.location.origin + pathlang + pathname;
    });

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
