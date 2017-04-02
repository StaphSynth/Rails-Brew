console.log('recipes.js');



$(document).on('turbolinks:load', function() {
  $('.add-ingredient-btn').click(function() {
    var replaceExp = new RegExp(/[0-9]+/);
    var $lastIngredient = $('.ingredient-selection').last();
    var $newIngredient = $($lastIngredient).clone();
    var totalIngredients = $('.ingredient-selection').length.toString();

    $($newIngredient).find('select, input').each(function(elem) {
      var oldId = $(this).attr('id');
      var newId = oldId.replace(replaceExp, totalIngredients);
      $(this).attr('id', newId);

      var oldName = $(this).attr('name');
      var newName = oldName.replace(replaceExp, totalIngredients);
      $(this).attr('name', newName);

      if($(this).is('input'))
        $(this).val('');
    });

    $($newIngredient).insertAfter($lastIngredient);
  });
});
