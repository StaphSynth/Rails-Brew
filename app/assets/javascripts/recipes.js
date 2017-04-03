
function replaceNameId(elem, replaceExp, value) {
  var oldId = $(elem).attr('id');
  var newId = oldId.replace(replaceExp, value);
  $(elem).attr('id', newId);

  var oldName = $(elem).attr('name');
  var newName = oldName.replace(replaceExp, value);
  $(elem).attr('name', newName);

  if($(elem).is('input'))
    $(elem).val('');
}

$(document).on('turbolinks:load', function() {

  var replaceExp = new RegExp(/[0-9]+/);

  $('.ingredient-selection').find('select').each(function(index, elem) {
    replaceNameId(elem, replaceExp, index);
  });

  $('.ingredient-selection').find('input').each(function(index, elem) {
    replaceNameId(elem, replaceExp, index);
  });

  $('.add-ingredient-btn').click(function() {
    var selector ='.' + $(this).data('type') + '-selection';
    var $lastIngredient = $(selector).last();
    var $newIngredient = $($lastIngredient).clone();
    var totalIngredients = $('.ingredient-selection').length.toString();

    $($newIngredient).find('select, input').each(function(index, elem) {
      replaceNameId(elem, replaceExp, totalIngredients);
    });

    $($newIngredient).insertAfter($lastIngredient);
  });
});
