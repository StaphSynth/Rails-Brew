import Ajax from './AjaxWrapper';

export default {
  decimalNumberRegex: function() {
    return /^[0-9]+(\.[0-9]+)?$/;
  },

  //builds up a series of meta data (colour, ppg, aa%, etc)
  //on each ingredient object to be used by calc functions via callback.
  buildIngredientMeta: function(type, ingredientsList, callback) {
    let ingredientsMeta = [];

    for(let i = 0; i < ingredientsList.length; i++) {
      let ingredient = ingredientsList[i];

      this.getIngredientMeta(type, ingredient.handle, metaData => {
        ingredientsMeta.push(metaData);

        if(ingredientsMeta.length >= ingredientsList.length) {
          //got them all, now merge the arrays and call the callback
          for(let i = 0; i < ingredientsList.length; i++) {
            Object.keys(ingredientsList[i]).forEach(key => {
              if(key != 'type') //avoids clash
                ingredientsMeta[i][key] = ingredientsList[i][key];
            });
          }

          callback(ingredientsMeta);
        }
      });
    }
  },

  //returns ingredient meta information from browser localStorage
  getIngredientMeta: function(type, handle, callback) {
  	//If cached, call the callback with the cached value.
    //If not cached, call the callback with the AJAX call result.
    if(!(callback instanceof Function)) {
      throw new Error('Invalid callback function passed to getIngredientMeta');
    }

    let ingredient = this.accessLocalStorage(type, handle);

    if(ingredient) {
      callback(ingredient);
    } else {
      this.fetchIngredientMeta(type, handle, callback);
    }
  },

  //goes to the server for ingredient meta info, then stores it
  //in localStorage before calling the callback
  fetchIngredientMeta: function(type, handle, callback) {
    Ajax.get({
      url: '/recipes/ingredient_data',
      data: {ingredient_type: type, ingredient_id: handle},
      return: 'json',
      success: data => {
        this.accessLocalStorage(type, handle, data);
        callback(data);
      },
      failure: error => { console.log(error); }
    });
  },

  /*wraps access to the localStorage subsystem.

    localStorage.rb = {
      "type" : {"name": "{your data}", "name": "{your data}"},
      "type" : {"name": "{your data}", "name": "{your data}"}
    }
  arg: type (string), access first level of data
  arg: name (string), access the second level of data
  arg: object (object, optional), the object to be stored
  */
  accessLocalStorage: function(type, name = null, object = null) {
    if(this.storageAvailable('localStorage')) {
      var rb = JSON.parse(localStorage.getItem('rb')) || {};

      if(object == null) {//if obj == null, then get from rb

        if(!name)
          return rb[type];
        else if(!(name && rb[type]))
          return undefined;
        else
          return rb[type][name];

      } else if(object && type && name) { //if obj has been passed, then add it to rb
        if(!rb[type])
          rb[type] = {};

        rb[type][name] = object;
        try {
          localStorage.setItem('rb', JSON.stringify(rb));
        } catch(e) {
          console.log('localStorage write error!', e);
        }
      } else {
        throw new Error('accessLocalStorage setter requires all args to be truthy');
      }
    } else {
      return undefined;
    }
  },

  //checks if local browser storage is available. Lifted from MDN
  //https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  //pass 'localStorage' or 'sessionStorage' to check either.
  storageAvailable: function(type) {
      try {
          var storage = window[type],
              x = '__storage_test__';
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
      }
      catch(e) {
          return e instanceof DOMException && (
              // everything except Firefox
              e.code === 22 ||
              // Firefox
              e.code === 1014 ||
              // test name field too, because code might not be present
              // everything except Firefox
              e.name === 'QuotaExceededError' ||
              // Firefox
              e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
              // acknowledge QuotaExceededError only if there's something already stored
              storage.length !== 0;
      }
  },


}
