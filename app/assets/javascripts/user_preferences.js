$(document).on('turbolinks:load', function() {

  //setup display of batch volume
  $('#batch-display').val(unitConverter['L'][gon.userPref.volume]($('#batch-model').val()));

  //link the batch volume display with the model
  $('#batch-display').change(function() {
    $('#batch-model').val(unitConverter[gon.userPref.volume]['L']($(this).val()));
  });

});
