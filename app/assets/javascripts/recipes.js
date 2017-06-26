/**********************************************
RECIPES.JS
==========
Does all the predictions, AJAXing,
and display updating required by the
recipe creation form and recipe index page.
**********************************************/

/**********************************
*****CONST AND FUNCTION DEFINITIONS
***********************************/
const units = {
  I: 'lb',
  O: 'oz',
  M: 'g',
  K: 'kg',
  L: 'L',
  G: 'Gal.',
  B: 'Imp. Gal.',
  F: '°F',
  C: '°C'
};

const srmColourMap = {
        0:  '#ffffff',
        1:  '#FFE699',  2: '#FFD878',
        3:  '#FFCA5A',  4: '#FFBF42',
        5:  '#FBB123',  6: '#F8A600',
        7:  '#F39C00',  8: '#EA8F00',
        9:  '#E58500', 10: '#DE7C00',
        11: '#D77200', 12: '#CF6900',
        13: '#CB6200', 14: '#C35900',
        15: '#BB5100', 16: '#B54C00',
        17: '#B04500', 18: '#A63E00',
        19: '#A13700', 20: '#9B3200',
        21: '#952D00', 22: '#8E2900',
        23: '#882300', 24: '#821E00',
        25: '#7B1A00', 26: '#771900',
        27: '#701400', 28: '#6A0E00',
        29: '#660D00', 30: '#5E0B00',
        31: '#5A0A02', 32: '#560A05',
        33: '#520907', 34: '#4C0505',
        35: '#470606', 36: '#440607',
        37: '#3F0708', 38: '#3B0607',
        39: '#3A070B', 40: '#36080A',
        'max': '#030403'
    };


//unit conversion functions
var noConv = function(v)        { return v; }
var celToFar = function(v)      { return (v * 9 / 5) + 32; }
var farToCel = function(v)      { return (v - 32) * 5 / 9; }
var litToUsGal = function(v)    { return v / 3.785; }
var litToImpGal = function(v)   { return v / 4.54609; }
var impGalToUsGal = function(v) { return v / 0.832674188148; }
var usGalToImpGal = function(v) { return v * 0.832674188148; }
var usGalToLit = function(v)    { return v * 3.785; }
var impGalToLit = function(v)   { return v * 4.546091879; }
var gramToLbs = function(v)     { return v * 0.00220462262; }
var lbsToGram = function(v)     { return v * 453.592; }
var gramToOz = function(v)      { return v / 28.34952313; }
var ozToGram = function(v)      { return v * 28.34952313; }
var ozToLbs = function(v)       { return v / 16; }
var lbsToOz = function(v)       { return v * 16; }
var gToKg = function(v)         { return v / 1000; }
var kgToG = function(v)         { return v * 1000; }
var lbsToKg = function(v)       { return gToKg(lbsToGram(v)); }
var kgToLbs = function(v)       { return gramToLbs(kgToG(v)); }

/*
Returns a function to convert a value from one unit to another
Usage: unitConverter['from']['to'](value)
KEYS: C = Celcius, F = fahrenheit, L = Litre, G = US Gallon, B = Imperial (British) Gallon,
I = pounds, O = ounces, M = grams, K = kilograms
*/
const unitConverter = {
  C: {
        C: noConv,
        F: celToFar
      },
  F: {
        C: farToCel,
        F: noConv
      },
  L: {
        G: litToUsGal,
        B: litToImpGal,
        L: noConv
      },
  G: {
        G: noConv,
        B: usGalToImpGal,
        L: usGalToLit
      },
  B: {
        G: impGalToUsGal,
        B: noConv,
        L: impGalToLit
      },
  M: {
        I: gramToLbs,
        M: noConv,
        O: gramToOz,
        K: gToKg
      },
  I: {
        I: noConv,
        M: lbsToGram,
        O: lbsToOz,
        K: lbsToKg
      },
  O:  {
        I: ozToLbs,
        M: ozToGram,
        O: noConv
      },
  K:  {
        I: kgToLbs,
        M: kgToG,
        K: noConv
      }
};

//returns the total malt colour units (MCU) of the beer, divided by batch size (in Gal)
function calcMcu() {
  var totalMcu = 0;
  var amount;
  var colour;
  var batchVol = unitConverter[gon.userPref.volume]['G'](parseFloat($('#volume-display').val()));

  //loop through the malts, multiply colour (in SRM)
  //with amount (in lbs) for each, then add to total mcu
  Object.keys(gon.malts).forEach(function(key) {
    amount = unitConverter[gon.userPref.weight_big]['I'](parseFloat(gon.malts[key].quantity));
    colour = gon.malts[key].colour || 0;

    totalMcu += amount * colour;
  });

  return totalMcu / batchVol;
}

//calc beer colour in SRM
function calcBeerSrm() {
  //SRM = 1.4922 * (MCU ^ 0.6859)
  return (1.4922 * Math.pow(calcMcu(), 0.6859)).toFixed(1);
}

//returns the hex value from the colour look-up table
function srmToHex(srm) {
  srm = Math.round(srm);
  return srm > 40 ? srmColourMap['max'] : srmColourMap[srm];
}

//return the weight unit (big or small) to be used based on ingredient type
function getWeightUnit(ingredientType) {
  return ingredientType == 'malts' ? gon.userPref.weight_big : gon.userPref.weight_small;
}

//returns the calculated SG of the beer taking into account the
//amount of malt, the efficiency of extraction and the batch size.
//malts are stored as objects in the global object, gon.malts
function calculateOg() {
  var totalGravPoints = 0;
  var weight;
  var ppg;
  var efficiency = parseInt($('#efficiency').val()) / 100;
  var batchVolume = unitConverter[gon.userPref.volume]['G'](parseFloat($('#volume-display').val()));

  //cycle through malts and add the grav points produced by each to the total
  Object.keys(gon.malts).forEach(function(key) {
    weight = unitConverter[gon.userPref.weight_big]['I'](gon.malts[key].quantity);
    ppg = gon.malts[key].ppg;

    if(gon.malts[key].must_mash)
      totalGravPoints += weight * ppgToGravPoints(ppg) * efficiency;
    else
      totalGravPoints += weight * ppgToGravPoints(ppg);
  });

  //convert from grav points to SG (float) and return
  return (((Math.round(totalGravPoints / batchVolume)) / 1000) + 1).toFixed(3);
}

//parses the text in the FG field and returns an array containing
//up to two FG numbers (as floats), the lower and upper bound in reverse order
//EG: [1.012, 1.008] or if only one val is present, [1.012]
//The user may enter up to two values in the field, separated by a '-'
//if these conditions are not met, returns [0].
function parseFg() {
  var fg = $('.fg-model').val();
  var fgExp = new RegExp(/^\s*1.[0-9]{3}\s*(\-\s*1.[0-9]{3}\s*)?$/);

  if(!fg)
    return [0]; //is empty so return default zero
  else if(!fg.match(fgExp))
    //do something to warn the user their FG string is badly formatted

    //then return default zero
    return [0];
  else { //if the fg string is present and correct
    //split it by '-', turn it into floats, sort it and return it
    fg = fg.split('-');
    fg.forEach(function(val, index, array) { array[index] = parseFloat(val); });
    return fg.sort(function(a, b) { return b - a; });
  }
}

//returns predicted alcohol by volume
//pass OG and FG (original grav, final grav, both floats)
function calcAbv(og, fg) {
  return (fg > og) ? 0 : (76.08 * (og - fg) / (1.775 - og)) * (fg / 0.794);
}

/*generates a string detailing the predicted ABV of the final beer as dictated by
the OG and FG values. Since FG can be a range (eg: FG = 1.008 - 1.011),
this function will return a ranged ABV string if this is so.
Accepts two args: og, a float; and fgArray, an array containing the
FG range boundaries as floats in reverse order (eg [1.012, 1.009])
The FG array may contain either one or two elements and should be generated
using the function parseFg().
If the ABV calcs make no sense, then getAbv will return "0"*/
function getAbv(og, fgArray) {
  var output = "0";
  var fg = fgArray[0];
  var abv = calcAbv(og, fg);


  if(abv > 0)
    output = abv.toFixed(1);

  if(fgArray.length > 1) {
    fg = fgArray[1];
    abv = calcAbv(og, fg);

    if(abv > 0)
      output += '-' + abv.toFixed(1);
  }

  return output;
}

function ppgToGravPoints(ppg) {
  return Math.round((ppg - 1) * 1000);
}

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
        //set the new data
        setIngredientData(type, response, callerId);
        //if the related quantity field has a value, then set that as well and update the calcs
        if(quantity) {
          setIngredientQty(type, callerId, quantity);
          updateCalcs();
         }
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

//used to pre-fill the FG input elem on change
//of style select drop-down
function preFillFg() {
  var fg = "";

  //only if the pre-defined stats for the style exist
  if(gon.styleData.stats != undefined && gon.styleData.stats.fg != undefined) {
    fg = gon.styleData.stats.fg.low.toString() +
    '-' + gon.styleData.stats.fg.high.toString();
  }

  $('.fg-model').val(fg);
}

//this function will update the displayed recipe style parameters
//when the user makes a recipe style selection from the select#recipe_style element
//takes optional callback function (used for calling preFillFg if req'd)
function getRecipeStyleInfo(callback = false) {
  var selectedValue = $('#recipe_style').val();

  //if value is empty, user has selected the prompt, hide the params
  if(selectedValue == '') {
    $('.style-stats-container').hide();

  //if not, then ajax for the style data and display
  } else {
    getStyleAjax(selectedValue, function(response) {
      setStyleInfo('.style-stats-container');
      if(callback != false)
        callback();
      $('.style-stats-container').show();
    }, function(response) {
      $('.style-stats-container').hide();
    });
  }
}

//calls all the prediction calculation functions and
//updates the display and model with the new values
function updateCalcs() {
  var og = calculateOg();
  var srm = calcBeerSrm();
  var ibu = 0; //will call calcIbu when it's written, for now set to zero
  var abv = getAbv(og, parseFg());

  //update the displays and models with
  //the new values
  $('.og-display').html(og);
  $('.og-model').val(og);
  $('.srm-display').html(srm);
  $('.srm-model').val(srm);
  $('.predicted-colour').css('background', srmToHex(srm));
  $('.ibu-display').html(ibu);
  $('.ibu-model').val(ibu);
  $('.abv-display').html(abv);
}


/************************************
******* CODE EXECUTION  *************
*************************************/
$(document).on('turbolinks:load', function() {

  /*SETUP DISPLAY, LINK MODELS TO DISPLAYS FOR UNIT CONVERSION/STORAGE, ETC*/

  //set display of any pre-selected recipe style
  getRecipeStyleInfo();

  //setup display of recipe volume
  $('#volume-display').val(unitConverter['L'][gon.userPref.volume]($('#volume-model').val()));

  //link the volume display with the model
  $('#volume-display').change(function() {
    $('#volume-model').val(unitConverter[gon.userPref.volume]['L']($(this).val()));
  });

  //setup display of ingredient weights in recipe form
  $('.ingredient-qty-display').each(function() {
    var weightUnit = getWeightUnit($(this).attr('data'));
    $(this).val(Math.round(unitConverter['M'][weightUnit](
      $(this).siblings('.ingredient-qty-model').val())
    ));
  });

  //set background colour of glass(es)
  $('.predicted-colour').each(function() {
    $(this).css('background', srmToHex($(this).attr('data')));
  });

  //do unit conversion and display qty on recipe show page
  $('.qty').each(function() {
    var qty = parseFloat($(this).attr('data'));
    var weightUnit = getWeightUnit($(this).attr('data-type'));
    qty = unitConverter['M'][weightUnit](qty);

    //decide on rounding rules
    if((weightUnit == 'M') || (qty % 1 == 0))
      qty = Math.round(qty);
    else
      qty = qty.toFixed(2);

    //set the display
    $(this).html(qty);
    $(this).siblings('.qty-unit').html(units[weightUnit]);
  });

  /*END MODEL-DISPLAY LINKING*/

  /*BEGIN FORM CHANGE EVENTS*/

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
    var quantity = $(this).parent().parent().find('.ingredient-qty-display').val();

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

  $('.ingredient-qty-display').change(function() {
    var callerId = formatCallerId($(this).siblings('.ingredient-qty-model').attr('id'));
    var quantity = parseFloat($(this).val());
    var type = $(this).attr('data');
    var weightUnit = getWeightUnit(type);

    //set the weight unit param first (big for MALTS, else small)

    //update the ingredient-qty-model with the new value in metric
    $(this).siblings('.ingredient-qty-model').val(unitConverter[weightUnit]['M']($(this).val()));

    //if the ingredient is present in gon.INGREDIENT, then update the qty there as well
    //if not, then the ingredient select change event will update both ingredient id and qty
    if(gon[type][callerId] != undefined) {
      setIngredientQty(type, callerId, quantity);
      updateCalcs();
    }
  });

  $('#recipe_FG').change(updateCalcs);

  $('#volume-display').change(updateCalcs);

  $('#efficiency').change(updateCalcs);

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
    updateCalcs();
  });

  //set current recipe style data if the data exists
  if(!(gon != undefined && (gon.styleData == undefined || $.isEmptyObject(gon.styleData)))) {
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

  $('select#recipe_style').change(function() {
    //get the style info and pre-fill the FG input element
    getRecipeStyleInfo(preFillFg);
    //if the FG has changed, the calcs need to be updated again
    updateCalcs();
  });

  /*END FORM CHANGE EVENTS*/
}); //document load
