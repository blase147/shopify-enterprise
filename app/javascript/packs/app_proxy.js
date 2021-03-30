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

  $(document).on('click', '.logout-btn', function () {
    window.top.location.href = 'account/logout';
  });

  $(document).on('click', 'button.minus-quantity', function () {
    let val = $(this).next().val() * 1;
    let prevQuantity = $(this).parents('.quantity-field ').find('input.prev-quantity').val() * 1;
    if (val > 1) {
      val -= 1;
    }
    $(this).next().val(val);

    if (val == prevQuantity) {
      $(this).parents('.quantity-field').find('.update-quantity').removeClass('active');
    } else {
      $(this).parents('.quantity-field').find('.update-quantity').addClass('active');
    }

  });

  $(document).on('click', 'button.plus-quantity', function () {
    let val = $(this).prev().val() * 1;
    let prevQuantity = $(this).parents('.quantity-field ').find('input.prev-quantity').val() * 1;
    if (val >= 1) {
      val += 1;
    }
    $(this).prev().val(val);

    if (val == prevQuantity) {
      $(this).parents('.quantity-field').find('.update-quantity').removeClass('active');
    } else {
      $(this).parents('.quantity-field').find('.update-quantity').addClass('active');
    }
  });

  $(document).on('input', 'input.quatity-val', function () {
    console.log('active');
    $(this).parents('.quantity-field').find('.update-quantity').addClass('active');
  });

  $(document).on('click', '.chevron', function () {
    $(this).toggleClass('active');
    $(this).parents('.subscription-contract-products').find('.slide-down').slideToggle();

  });
});
