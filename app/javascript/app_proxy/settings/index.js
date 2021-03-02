$( document ).on('turbolinks:load', function() {
  initSettings();
})

function initSettings(){
  $('.Polaris-Select select').on('change', function(e){
    var selected = $(this).find('option:selected');
    var selected_ext = selected.html();
    var selected_val = selected.val();
    $(this).closest('.Polaris-Select').find('.Polaris-Select__SelectedOption').html(selected_ext);
  }).trigger('change');
}