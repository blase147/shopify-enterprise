// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
require("jquery")

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
require("shopify_app_js")
require("custom")

// #########################
// Global
function showToast(type, message) {
  var Toast = window['app-bridge'].actions.Toast;

  if (type == 'notice') {
    Toast.create(app, {
      message: message,
      duration: 5000,
    }).dispatch(Toast.Action.SHOW);
  }

  if (type == 'error') {
    Toast.create(app, {
      message: message,
      duration: 5000,
      isError: true,
    }).dispatch(Toast.Action.SHOW);
  }
}
window.showToast = showToast;

window.hideModal = function(reload) {
  var modal = $('.Polaris-Modal')
  modal.removeClass('shown');
  hideLoading()

  if(reload) { window.location.reload() }
}

window.hideLoading = function() {
  var modal = $('.Polaris-Modal')
  modal.find('[type=submit]').removeClass('Polaris-Button--loading')
  modal.find('.Polaris-Button__Spinner').addClass('hide')
}