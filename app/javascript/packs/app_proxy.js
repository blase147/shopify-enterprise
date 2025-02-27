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
require("app_proxy/settings");
const images = require.context('../images', true)
const imagePath = (name) => images(name, true)
import TinyDatePicker from 'app_proxy/datepicker';

require('owl.carousel');
import 'owl.carousel/dist/assets/owl.carousel.css';

$(document).ready(function () {

  $(document).on('click', 'a#logout-btn', function () {
    window.top.location = '/account/logout';
  });

  // $('.owl-carousel').owlCarousel(
  //   {
  //     dots: true,
  //     margin: 30
  //   }
  // );

  $('.owl-carousel').owlCarousel({
    loop: false,
    margin: 10,
    nav: true,
    infinite: false,
    dot: false,
    navText: ['<div class="crousel_prev_button"><svg focusable="false" width="17" height="14" class="icon icon--nav-arrow-left  icon--direction-aware " viewBox="0 0 17 14"><path d="M17 7H2M8 1L2 7l6 6" stroke ="currentColor" stroke-width="2" fill = "none" ></path ></svg ></div>', "<div class='crousel_next_button'><svg focusable='false' width='17' height='14' class='icon icon--nav-arrow-right  icon--direction-aware ' viewBox='0 0 17 14'><path d='M0 7h15M9 1l6 6-6 6' stroke='currentColor' stroke-width='2' fill='none'></path></svg></div>"],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 4,
      },
      1000: {
        items: 4,
      }
    }
  })

  $(document).on('click', 'a.btn-discount', function () {
    if ($('.btn-discount').data().redirect_url != 'undefined' || $('.btn-discount').data().redirect_url != '') {
      window.top.location.href = $('.btn-discount').data().redirect_url;
    } else {
      window.top.location.href = '/pages/contact-us';
    }
  });

  $(document).on('click', 'button.open-dp', function () {
    $(this).hide();
    let this_ = $(this).parent();
    this_.next().click();
    this_.parents('.Polaris-Modal__Body').find('.options-btn-wrapper').hide();
    this_.parents('.Polaris-Modal__Body').find('.append-dp').show();
  });

  $(document).on('click', 'button.back-dp', function () {
    $(this).parents('.append-dp').hide();
    $(this).parents('form').next().show();
    $(this).parents('form').find('.btn-wrapper > .open-dp').show();
  });

  $(document).on('click', 'div.close-modal', function () {
    $(this).parents('.Polaris-Modal__Body').find('.open-dp').show();
    $(this).parents('.Polaris-Modal__Body').find('.append-dp').hide();
    $(this).parents('.Polaris-Modal__Body').find('.options-btn-wrapper').show();
  });

  $(document).on('click', 'input.datepicker-delay', function () {
    let id = $(this).attr('id');
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if ($('.dp-permanent').length <= 0) {
      let dp = TinyDatePicker(document.getElementById(id), {
        mode: 'dp-permanent',
        close: 'Ahsan',
        min: tomorrow,
        onChangeDate: () => console.log("here"),
      });
      dp.open();
    }
  });

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
    $(this).parents('.quantity-wrapper').next('.slide-down').slideToggle();

  });
  $(document).on('click', '#collapsible_nav', function () {
    $(this).toggleClass('active');
    $('#nav_tab').slideToggle();

  });

  $(document).on('click', 'div#AppFrameNav .sm-nav-trigger', function () {
    $(this).parents('#AppFrameNav').toggleClass('active');
    $(this).find('.icon-chevron').toggleClass('active');
    $(this).next().toggle();
  });
});
