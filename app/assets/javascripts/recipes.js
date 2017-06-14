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

  //set current recipe style data if the data exists
  if(!(gon.styleData == undefined || $.isEmptyObject(gon.styleData))) {
    setStyleProperties();
    $('.style-display').show();
  }

  //when a user clicks on the question mark symbol next to the recipe style,
  //this function will toggle the appearance of additional style info
  $('.get-style-info').click(function() {

    //if already visible, hide
    if($('.style-info-container').is(':visible')) {
      $('.style-info-container').slideUp('fast');

      //if not visible, but correct data already in gon object, display
    } else if($('.recipe-style').attr('data-style-id') == gon.styleData.id) {
      $('.style-info-container').slideDown('fast');

      //if the style data isn't already there, make ajax req for it, then display
    } else {
      getStyleAjax($('.recipe-style').attr('data-style-id'), function() {
        setStyleProperties();
        $('.style-info-container').slideDown('fast');
      });
    }
  });


  //when creating a recipe, this function will update the displayed recipe style parameters
  //when the user makes a recipe style selection from the select#recipe_style element
  $('select#recipe_style').change(function() {
    var selectedValue = $(this).val();

    //if value is empty, user has selected the prompt, hide the params
    if(selectedValue == '') {
      $('.style-display').hide();

    //if not, then ajax for the style data and display
    } else {
      getStyleAjax(selectedValue, function(response) {
        setStyleProperties();
        $('.style-display').show();
      }, function(response){
        $('.style-display').hide();
      });
    }
  });

}); //document load



function replaceAttr(elem, attr, toBeReplaced, replaceVal) {
  var oldAttr = $(elem).attr(attr);

  if(!oldAttr)
    return;

  var newAttr = oldAttr.replace(toBeReplaced, replaceVal);
  $(elem).attr(attr, newAttr);
}

//displays the stat properties (OG, FG, etc) of the beer style to the user
function setStyleProperties() {
  //if the gon style data contains no stats or contains a stat exceptions message, then display that and return
  if(gon.styleData.stats == undefined) {
    $('.style-exceptions').html('');
    $('.style-stats').hide();
    $('.no-stats').show();
    return;
  } else if(Object.keys(gon.styleData.stats).length < 3 && gon.styleData.stats.exceptions != undefined) {
    $('.style-exceptions').html(gon.styleData.stats.exceptions);
    $('.style-stats').hide();
    $('.no-stats').show();
    return;
  }

  //otherwise, update the html vals of the display with the gon style data stats
  $('.min-og').html(gon.styleData.stats.og.low);
  $('.max-og').html(formatMaxG(gon.styleData.stats.og.high));
  $('.min-ibus').html(gon.styleData.stats.ibu.low);
  $('.max-ibus').html(gon.styleData.stats.ibu.high);
  $('.min-fg').html(gon.styleData.stats.fg.low);
  $('.max-fg').html(formatMaxG(gon.styleData.stats.fg.high));
  $('.style-appearance').html(gon.styleData.appearance);
  $('.style-aroma').html(gon.styleData.aroma);
  $('.style-flavor').html(gon.styleData.flavor);
  $('.no-stats').hide();
  $('.style-stats').show();
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
