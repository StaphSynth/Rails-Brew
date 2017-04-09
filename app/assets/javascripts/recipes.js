
function replaceAttr(elem, attr, toReplace, replaceVal) {
  var oldAttr;
  if(!(oldAttr = $(elem).attr(attr)))
    return;

  var newAttr = oldAttr.replace(toReplace, replaceVal);
  $(elem).attr(attr, newAttr);

  if($(elem).is('input') && !($(elem).attr('id').includes('_destroy')))
    $(elem).val('');
}

$(document).on('turbolinks:load', function() {

    $('.add-ingredient-btn').click(function() {
    var replaceExp = new RegExp(/[0-9]+/);
    var selector ='.' + $(this).data('type') + '-input';
    var $lastIngredient = $(selector).last();
    var $newIngredient = $($lastIngredient).clone(true);
    var uniqueVal = new Date().getTime();

    $($newIngredient).find('select, input, label').each(function(index, elem) {
      replaceAttr(elem, 'id', replaceExp, uniqueVal);
      replaceAttr(elem, 'name', replaceExp, uniqueVal);
      replaceAttr(elem, 'for', replaceExp, uniqueVal);
    });

    $($newIngredient).children('input').remove(); //remove the rails hidden input field
    $($newIngredient).hide();
    $($newIngredient).insertAfter($lastIngredient);
    $($newIngredient).slideDown();
  });


  $('.del-ingredient-btn').click(function() {
    var $itemToRemove = $(this).parent().parent();

    $($itemToRemove).find('.destroy').val(true);

    $($itemToRemove).slideUp();
  });
});
