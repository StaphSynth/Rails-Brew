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

  $('.ingredient-select').change(function() {
    var type = $(this).attr('data');
    var ingredient = $(this).val();
    var ingredientId = formatCallerId($(this).attr('id'));
    var quantity = $(this).parent().parent().find('.ingredient-qty').val();

    //check the value of the select elem. if it has one, then proceed to fetch ingredient data and update gon
    //if not, the user has selected the prompt, so delete any existing gon ingredients with this id.
    if(ingredient) {
      if(quantity) {//if the related quantity field has a value in it, then pass it through and it will be updated as well.
        fetchIngredientData(type, ingredient, ingredientId, parseFloat(quantity));
      } else {
        fetchIngredientData(type, ingredient, ingredientId);
      }
    } else {
      deleteGonIngredient(type, ingredientId);
    }
  });

  $('.ingredient-qty').change(function() {
    var callerId = formatCallerId($(this).attr('id'));
    var quantity = parseFloat($(this).val());
    var type = $(this).attr('data');

    //if the ingredient is present in gon.INGREDIENT, then update the qty, else don't.
    if(gon[type][callerId] != undefined)
      setIngredientQty(type, callerId, quantity);
  });

  $('.del-ingredient-btn').click(function() {
    //cannot remove elem from DOM as Rails needs to know it's being destroyed.
    //So, set destroy to true and hide element from view.
    var itemToRemove = $(this).parent().parent();
    $(itemToRemove).find('.destroy').val(true);
    $(itemToRemove).slideUp('fast');

    //Then, remove its value from the gon.INGREDIENT global so it doesn't affect predictions
    //traverse to the select elem, get its id and data attr and use them to delete gon.INGR_TYPE.INGREDIENT_ID
    var ingredientSelect = $(itemToRemove).find('.ingredient-select');
    var ingredientId = formatCallerId($(ingredientSelect).attr('id'));
    var ingredientType = $(ingredientSelect).attr('data');

    deleteGonIngredient(ingredientType, ingredientId);
  });

  //set current recipe style data if the data exists
  if(!(gon.styleData == undefined || $.isEmptyObject(gon.styleData))) {
    setStyleInfo('.style-stats-container');
    $('.style-stats-container').show();
  }

  //when a user clicks on recipe style text,
  //this function will toggle the appearance of a
  //div containing additional style info
  $('.get-style-info').click(function() {
    var styleId = $(this).parent().attr('data-style-id');
    var index = $(this).parent().attr('data-index');
    var container = '.info-' + index;

    //if already visible, hide
    if($(container).is(':visible')) {
      displayStyleInfo(false, container);

      //if not visible, but correct data already in gon object, display
    } else if(styleId == gon.styleData.id) {
      displayStyleInfo(true, container);

      //if the style data isn't already there, make ajax req for it, then display
    } else {
      getStyleAjax(styleId, function() {
      setStyleInfo(container);
      displayStyleInfo(true, container);
      });
    }
  });


  //when creating a recipe, this function will update the displayed recipe style parameters
  //when the user makes a recipe style selection from the select#recipe_style element
  $('select#recipe_style').change(function() {
    var selectedValue = $(this).val();

    //if value is empty, user has selected the prompt, hide the params
    if(selectedValue == '') {
      $('.style-stats-container').hide();

    //if not, then ajax for the style data and display
    } else {
      getStyleAjax(selectedValue, function(response) {
        setStyleInfo('.style-stats-container');
        $('.style-stats-container').show();
      }, function(response) {
        $('.style-stats-container').hide();
      });
    }
  });

}); //document load


function deleteGonIngredient(type, ingredientId) {
  delete gon[type][ingredientId];
}

function setIngredientQty(type, ingredientId, quantity) {
  gon[type][ingredientId]['quantity'] = quantity;
}

//sets ingredient data in the gon.malts or gon.hops global objects.
function setIngredientData(type, ingredientData, key) {
  gon[type][key] = ingredientData;
}

//removes the last '_PIECE' off the ID tag of the calling element
function formatCallerId(callerId) {
  callerId = callerId.split('_');
  callerId.pop();
  return callerId.join('_');
}

//uses ajax to fetch data on malt and hop ingredients needed for ABV, OG, IBU, colour, etc calc predictions
//takes two args: type (string), either 'hops' or 'malts' which allows the server to figure out what to return,
//and ingredient_id, which allows the server to fetch the data. callerId is the CSS id selector of the element
//causing the function to be called, is required for storage of the returned data in gon.malts.CALLERID
function fetchIngredientData(type, ingredientId, callerId, quantity = null) {
  $.ajax(
    {
      type: 'GET',
      data: { ingredient_type: type, ingredient_id: ingredientId },
      url: '/recipes/ingredient_data',
      success: function(response) {
        setIngredientData(type, response, callerId);
        if(quantity) //if the related quantity field has a value, then set that as well
          setIngredientQty(type, callerId, quantity);
      },
      error: function(response) {
        failSilent(response);
      }
    }
  );
}

function replaceAttr(elem, attr, toBeReplaced, replaceVal) {
  var oldAttr = $(elem).attr(attr);

  if(!oldAttr)
    return;

  var newAttr = oldAttr.replace(toBeReplaced, replaceVal);
  $(elem).attr(attr, newAttr);
}

//for showing/hiding the recipe style info container
//pass action (boolean) TRUE to show, FALSE to hide.
//Pass container id/class (string) selector for which
//container to show/hide
function displayStyleInfo(action, container) {
  var caret = $(container).parent().find('.style-info-caret');

  if(action) {
    $(container).slideDown('fast');
    $(caret).toggleClass('fa-flip-vertical');
    $(caret).attr('style', 'display: inline-block;');
  } else {
    $(container).slideUp('fast');
    $(caret).toggleClass('fa-flip-vertical');
    $(caret).removeAttr('style');
  }
}

//updates the html values of the style and style stat properties (OG, FG, etc) of the beer style
//accepts a string "container" that gives the class or id handle of the stat container to be updated
function setStyleInfo(container) {

  if(!container)
    throw new Error('empty container selector string passed to setStyleInfo');

  //set the style info data
  $(container).find('.style-appearance').html(gon.styleData.appearance);
  $(container).find('.style-aroma').html(gon.styleData.aroma);
  $(container).find('.style-flavor').html(gon.styleData.flavor);

  //after setting style info data, set style stats if present. Check the state of the stats object first.

  //if the gon style data contains no stats, blank it and hide it.
  if(gon.styleData.stats == undefined) {
    $(container).find('.style-exceptions').html('');
    $(container).find('.style-stats').hide();
    $(container).find('.no-stats').show();

   //if it contains a stat exceptions message, then display that.
   //if there are stats, there'll be 5 keys in the 'stats' object, so check that
  } else if(Object.keys(gon.styleData.stats).length < 5 && gon.styleData.stats.exceptions != undefined) {
    $(container).find('.style-exceptions').html(gon.styleData.stats.exceptions);
    $(container).find('.style-stats').hide();
    $(container).find('.no-stats').show();

  //otherwise, update the html vals of the display with the gon style data stats
  } else {
    $(container).find('.min-og').html(gon.styleData.stats.og.low);
    $(container).find('.max-og').html(formatMaxG(gon.styleData.stats.og.high));
    $(container).find('.min-ibus').html(gon.styleData.stats.ibu.low);
    $(container).find('.max-ibus').html(gon.styleData.stats.ibu.high);
    $(container).find('.min-fg').html(gon.styleData.stats.fg.low);
    $(container).find('.max-fg').html(formatMaxG(gon.styleData.stats.fg.high));
    $(container).find('.min-abv').html(gon.styleData.stats.abv.low);
    $(container).find('.max-abv').html(gon.styleData.stats.abv.high);
    $(container).find('.no-stats').hide();
    $(container).find('.style-stats').show();
  }
}

//formats the value of max OG or max FG for more readable display
//turns 1.064 into 64, or 1.112 into 112 so that you get 'OG: 1.043-53' instead of 'OG 1.043-1.053'
function formatMaxG(maxG) {
  maxG = maxG.toString();

  if(maxG.indexOf('.0') == -1) {
    return maxG.split('.')[1];
  } else {
    return maxG.split('.0')[1];
  }

  //this should never run, but in case it does, just return the original val
  return maxG;
}

//gets the recipe style data via ajax call to the server and copies it to gon.styleData
//also takes some optional success and failure callback functions
function getStyleAjax(styleId, successCallback = null, errorCallback = null) {
  $.ajax(
    {
      type: 'GET',
      data: {style_id: styleId},
      url: '/recipes/styles',
      success: function(response) {
        gon.styleData = response;
        if(successCallback != null)
          successCallback(response);
      },
      error: function(response) {
        failSilent(response);
        if(errorCallback != null)
          errorCallback(response);
      }
    }
  );
}

//for non-critical AJAX failures. Log to the console, don't get the user involved
function failSilent(response) {
  console.log('AJAX error! Status: ', response.status);
  console.log(response);
}
