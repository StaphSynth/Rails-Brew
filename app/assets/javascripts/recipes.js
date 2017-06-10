
function replaceAttr(elem, attr, toBeReplaced, replaceVal) {
  var oldAttr = $(elem).attr(attr);

  if(!oldAttr)
    return;

  var newAttr = oldAttr.replace(toBeReplaced, replaceVal);
  $(elem).attr(attr, newAttr);
}

function updateStyleProperties(data) {
  $('.min-og').html(data.stats.og.low);
  $('.max-og').html(data.stats.og.high);
  $('.min-ibus').html(data.stats.ibu.low);
  $('.max-ibus').html(data.stats.ibu.high);
  $('.min-fg').html(data.stats.fg.low);
  $('.max-fg').html(data.stats.fg.high);
}

$(document).on('turbolinks:load', function() {

  $('.add-ingredient-btn').click(function() {
    var replaceExp = new RegExp(/[0-9]+/);
    var ingredientSelector ='.' + $(this).data('type') + '-input';
    var $ingredientsParent = $(ingredientSelector).parent();
    var $newIngredient = $($(ingredientSelector).last()).clone(true);
    var uniqueVal = new Date().getTime();

    $($newIngredient).find('select, input, label').each(function(index, elem) {
      replaceAttr(elem, 'id', replaceExp, uniqueVal);
      replaceAttr(elem, 'name', replaceExp, uniqueVal);
      replaceAttr(elem, 'for', replaceExp, uniqueVal);

      if($(elem).is('input'))
        $(elem).val('');
    });

    $($newIngredient).hide();
    $($newIngredient).appendTo($ingredientsParent);
    $($newIngredient).slideDown('fast');
  });


  $('.del-ingredient-btn').click(function() {
    var $itemToRemove = $(this).parent().parent();

    $($itemToRemove).find('.destroy').val(true);

    $($itemToRemove).slideUp('fast');
  });


  /* Recipe style AJAX */
  //ajax req for recipe style parameters upon user selection of recipe style
  $('select#recipe_style').change(function() {
    var value = $(this).val();

    if(value == '') { //if value is empty, user has selected the prompt
      $('.style-display').hide();
    } else {
      $.ajax(
        {
          type: 'GET',
          data: {style_id: value},
          url: '/recipes/styles',
          success: function(response) {
            updateStyleProperties(response);
            $('.style-display').show();
          },
          error: function(response) {
            console.log('AJAX error retrieving recipe style params\nStatus: ', response.status);
            console.log(response);
            $('.style-display').hide();
          }
        }
      );
    }
  });

}); //document load
