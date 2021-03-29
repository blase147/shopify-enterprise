// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
require("jquery")
require('webpack-jquery-ui');
require('webpack-jquery-ui/css');

require("app_proxy")
require("app_proxy/custom")
require("app_proxy/settings")

require('owl.carousel');
import 'owl.carousel/dist/assets/owl.carousel.css';

$(document).ready(function () {
  $('.owl-carousel').owlCarousel(
    {
      dots: true,
      margin: 30
    }
  );

  $(document).on('click', '.btn-variant', function () {
    let this_ = $(this);
    $('.variants-wrapper').slideUp();
    $('button[type="submit"]').hide();
    $('.btn-variant').show();
    this_.parents('.btn-wrapper').prev().slideDown();
    this_.hide();
    this_.parents('.btn-wrapper').next().find('button[type="submit"]').show();
  });

  $(document).on('click', 'button[type="submit"]', function () {
    $(this).parents('.preview-item').find('.spinner').css('display', 'flex');
  });
});
