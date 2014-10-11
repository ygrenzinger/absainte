'use strict';

$(document).ready(function() {
  var menu = $('.centered-navigation-menu');
  var menuToggle = $('.centered-navigation-menu-button');

  $.get('/getLocale', function(response) {
    $('.flag').removeClass('selected');
    $( '.flag[data-locale="'+response.locale+'"]' ).addClass('selected');
  });

  $(menuToggle).on('click', function(e) {
    e.preventDefault();
    menu.slideToggle(function(){
      if(menu.is(':hidden')) {
        menu.removeAttr('style');
      }
    });
  });

  var sharePageUrl = function() {
    return encodeURIComponent(location.href);
  };

  $('.flag').on('click', function(e) {
    e.preventDefault();
    var locale = $(e.target).attr('data-locale');
    $.get( '/setLocale/'+locale, function() {
      location.reload();
    });
  });

  $('.share').on('click', function(e) {
    e.preventDefault();
    var shareUrl = $(e.target).attr('data-share-url');
      window.open(
        shareUrl+sharePageUrl(),
        'share-dialog',
        'width=626,height=436');
  });

  $('.product .thumbnails img').each(function() {
      var imageUrl = $(this).attr('data-url');
      $(this).click(function() {
          $('.product .left img').attr('src', imageUrl);
      })
  });
});
