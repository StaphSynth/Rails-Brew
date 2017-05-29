$(document).on('turbolinks:load', function() {
  $('.rating-btn').click(function(){
    var userRating = $('#user-rating').val();
    if(userRating) {
      gon.ratingData.rating.rating = userRating;

      if(gon.ratingData.action == 'update') {
        $.ajax(
          {
            type: 'POST',
            method: 'PUT',
            data: gon.ratingData,
            url: '/ratings/' + gon.ratingData.rating.id.toString(),
            success: function(response) {
              updateRatingData(response);
            }
          }
        );
      } else if(gon.ratingData.action == 'create') {
        $.ajax(
          {
            type: 'POST',
            method: 'POST',
            data: gon.ratingData,
            url: '/ratings/create',
            success: function(response) {
              updateRatingData(response);
              updateGonData(response);
            }
          }
        );
      }
    }
  });
});

function updateRatingData(data) {
  $('.aggregate-rating').html(data.aggregateRating);
  $('.user-rating').html(data.userRating);
}

function updateGonData(data) {
  gon.ratingData.action = 'update';
  gon.ratingData.rating.id = data.ratingId;
}
