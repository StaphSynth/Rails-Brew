$(document).on('turbolinks:load', function() {

  //setup display of batch volume
  setVolumeDisplay();

  //link the batch volume display with the model
  $('#batch-display').change(function() {
    $('#batch-model').val(unitConverter[gon.userPref.volume]['L']($(this).val()));
  });

  //if the user changes the volume radio,
  //automatically change the units on the default batch volume
  $('input[name*="user_preference[volume]"]').change(function() {
    var userSelection = $(this).val();
    var unitSymb = {
      B: 'Imp. Gal.',
      G: 'Gal.',
      L: 'L'
    };

    gon.userPref.volume = userSelection;
    $('.volume-unit').html(unitSymb[userSelection]);
    setVolumeDisplay();
  });

});

function setVolumeDisplay() {
  var value = unitConverter['L'][gon.userPref.volume](parseFloat($('#batch-model').val())).toFixed(1);
  $('#batch-display').val(value);
}
