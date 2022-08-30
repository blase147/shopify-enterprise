$( document ).on('turbolinks:load', function() {
  initAppProxy();
  document.querySelectorAll("button[data-target][data-toggle]").forEach(btn => {
    btn.addEventListener('click', (e) =>{
      const btn = e.target;
      document.querySelector(btn.dataset.target).classList.remove('hidden');
    })
  })
  document.querySelectorAll('[data-action="close"]').forEach(btn => {
    btn.addEventListener('click', (e) =>{
      const btn = e.target;
      btn.closest('.Polaris-Modal').classList.add('hidden')
    })
  })
})
function initAppProxy(){
  $('button[data-url]').click(function(){
    var r = confirm("Are you sure?");
    if (r == true) {
      callAjax($(this).data('url'), $(this));
    }
  })
  $(".datepicker").datepicker({dateFormat: "yy-mm-dd"});
}

function callAjax(url, button){
  var spinner = button.find('.Polaris-Button__Spinner');

  $.ajax({
    url: url,
    type: 'post',
    dataType: 'json',

    beforeSend: function(){
      button.addClass('Polaris-Button--loading');
      spinner.removeClass('hide');
    },
    success: function(response){
      if(response.error) {
        alert(response.error)
      } else {
        if(response.show_notification){
          $("#notification").removeClass('hide');
        }
        else{
          window.location.reload()
        }
      }
    },

    complete:function(data){
      button.removeClass('Polaris-Button--loading');
      spinner.addClass('hide');
    }
  });
}

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

window.hideFormLoading = function() {
  var form = $('form')
  form.find('[type=submit]').removeClass('Polaris-Button--loading')
  form.find('.Polaris-Button__Spinner').addClass('hide')
}
