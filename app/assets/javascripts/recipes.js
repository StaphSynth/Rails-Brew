console.log('recipes.js');

$(document).on('turbolinks:load', function() {
  $('.add-ingredient-btn').click(function() {
    var replaceExp = new RegExp(/[0-9]+/);
    var selector ='.' + $(this).data('type') + '-selection';
    console.log('selector ', selector);

    var $lastIngredient = $(selector).last();
    var $newIngredient = $($lastIngredient).clone();
    var totalIngredients = $(selector).length.toString();

    $($newIngredient).find('select, input').each(function() {
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
