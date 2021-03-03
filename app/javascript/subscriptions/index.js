$( document ).on('turbolinks:load', function() {
  if($('.page-subscriptions').length) {
    initFilter();
  }
})

function initFilter(){
  // $('#filter-form input').on('keydown', function(e) {
  //   if (event.keyCode === 13) {
  //     event.preventDefault();
  //     alert("yes it works,I'm happy ");
  //   }
  // })
}