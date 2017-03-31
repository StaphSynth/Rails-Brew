// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/

//forces display of only the appropriate form elements according to the
//ingredient type selected by the user
function showIngredientFields() {
  switch ($('#ingredient_type').val()) {

    case 'malt':
      $('.hop-input').hide();
      $('.yeast-input').hide();
      $('.malt-input').show();
      break;

    case 'hops':
      $('.yeast-input').hide();
      $('.malt-input').hide();
      $('.hop-input').show();
      break;

    case 'yeast':
      $('.malt-input').hide();
      $('.hop-input').hide();
      $('.yeast-input').show();
      break;
  }
}

$(document).ready(showIngredientFields);
$(document).on('change', '#ingredient_type', showIngredientFields);
