$(document).on('turbolinks:load', function() {

  $('.c-rating').each(function() {
    rating(this, parseInt($(this).attr('data-rating')), 5, gon.ratingData.dispOnly, setRatingAjax);
  });
});

function setRatingAjax(value) {
  if(value === undefined || value < 0 || value > 5)
    return;

  gon.ratingData.rating.rating = value;

  if(gon.ratingData.action == 'update') {
    $.ajax(
      {
        type: 'POST',
        method: 'PUT',
        data: gon.ratingData,
        url: '/ratings/' + gon.ratingData.rating.id.toString(),
        success: function(response) {
          updateRatingData(response);
          message(response);
        },
        error: function(response) {
          message(response);
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
          message(response);
        },
        error: function(response) {
          message(response);
        }
      }
    );
  }
}

function updateRatingData(data) {
  $('.user-rating').html(data.userRating);
}

function updateGonData(data) {
  gon.ratingData.action = 'update';
  gon.ratingData.rating.id = data.ratingId;
}

function message(data) {
  var msg = $('.ajax-msg').html(data.notice);
  msg.css('display', 'block');
}
