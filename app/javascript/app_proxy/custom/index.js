$(document).on('turbolinks:load', function () {
  initMain();
})

function initMain() {
  $('[data-toggle=modal]').click(function () {
    target = $(this).data('target');
    $(target).toggleClass('shown');
  })

  $('[data-action=close]').click(function () {
    target = $(this).closest('.Polaris-Modal')
    $(target).toggleClass('shown');
  })

  $('form[data-remote]').submit(function () {
    var button = $(this).find('[type=submit]')
    button.addClass('Polaris-Button--loading')
    button.find('.Polaris-Button__Spinner').removeClass('hide')
  })
}