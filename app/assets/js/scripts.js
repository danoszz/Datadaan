/*!
 * Datadaan
 * Datavisualisation
 * https://datadaan.nl
 * @author Daan van der Zwaag
 * @version 1.0.5
 * Copyright 2017. MIT licensed.
 */
(function($, window, document, undefined) {

  'use strict';

  $(function() {
    // Show icon on bottom page
    $(window).on("scroll touchmove", function() {
      $('.arrow__down').removeClass('active');
       if($(window).scrollTop() + $(window).height() > ($(document).height() - 100) ) {
           $('.arrow__down').addClass('active');
       }
    });
    // Scroll to anchor

    $('a[href*=#]').on('click', function(event){
        event.preventDefault();
        $('.body.loaded').animate({scrollTop:$(this.hash).offset().top}, 500);
    });
  });

})(jQuery, window, document);
