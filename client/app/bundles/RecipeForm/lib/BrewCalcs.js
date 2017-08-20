export default {

  srmColourMap: {
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
  },

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
    return /^\s*1.[0-9]{3}\s*(\-\s*1.[0-9]{3}\s*)?$/.test(fg);
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

  //returns the hex value from the srm colour look-up table
  srmToHex: function(srm) {
    srm = Math.round(srm);
    return srm > 40 ? this.srmColourMap['max'] : srmColourMap[srm];
  },
}
