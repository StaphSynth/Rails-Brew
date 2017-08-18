export default {
  calcAbv: function(og, fg) {
    return (fg > og) ? 0 : (76.08 * (og - fg) / (1.775 - og)) * (fg / 0.794);
  },

  getAbv: function(og, fgArray) {
    var output = '0';
    var fg = fgArray[0];
    var og = parseFloat(og);
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
  },

  validateFg: function(fg) {
    return fg.match(/^\s*1.[0-9]{3}\s*(\-\s*1.[0-9]{3}\s*)?$/);
  },

  parseFg: function(fg) {
    var parsedValue;

    if(this.validateFg(fg)) {
      //split it by '-', turn it into floats, sort it and return it
      fg = fg.split('-');
      fg.forEach((val, index, array) => { array[index] = parseFloat(val); });
      parsedValue = fg.sort((a, b) => { return b - a; });
    } else {
      parsedValue = [0];
    }

    return parsedValue;
  },
}
