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

export default {

  unitSymbol: {
    I: 'lb',
    O: 'oz',
    M: 'g',
    K: 'kg',
    L: 'L',
    G: 'Gal.',
    B: 'Imp. Gal.',
    F: '°F',
    C: '°C'
  },

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

  /*
  Returns a function to convert a value from one unit to another
  Usage: unitConverter['from']['to'](value)
  KEYS: C = Celcius, F = fahrenheit, L = Litre, G = US Gallon, B = Imperial (British) Gallon,
  I = pounds, O = ounces, M = grams, K = kilograms
  */
  unitConverter: {
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
  },

  calcAbv: function(og, fg) {
    return (fg > og) ? 0 : (76.08 * (og - fg) / (1.775 - og)) * (fg / 0.794);
  },

  getAbv: function(og, fgArray) {
    var output = '0';
    var fg = fgArray[0];
    var og = parseFloat(og);
    var abv = this.calcAbv(og, fg);


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

  /*returns the calculated SG of the beer taking into account the
  amount of malt, the efficiency of extraction and the batch size.
  malts passed as an array of malt objects, efficiency as a decimal
  float value and batchVolume as a float in gallons*/
  calcOg: function(malts, batchVolume, efficiency) {
    var totalGravPoints = 0;

    if(batchVolume == 0 || isNaN(batchVolume)) { return '1.000'; }

    malts.forEach(malt => {
      let weight = this.unitConverter['M']['I'](malt.quantity);

      if(malt.must_mash) {
        totalGravPoints += weight * this.ppgToGravPoints(malt.ppg || 0) * efficiency;
      } else {
        totalGravPoints += weight * this.ppgToGravPoints(malt.ppg || 0);
      }
    });

    //convert from grav points to Specific Gravity and return
    return (((Math.round(totalGravPoints / batchVolume)) / 1000) + 1).toFixed(3);
  },

  ppgToGravPoints: function(ppg) {
    return Math.round((ppg - 1) * 1000);
  },

  //returns the total malt colour units (MCU) of the beer, divided by batch size (in Gal)
  calcMcu: function(malts, batchVolume) {
    var totalMcu = 0;
    var amount;
    var colour;

    if(batchVolume == 0 || isNaN(batchVolume)) { return 0; }

    //loop through the malts, multiply colour (in SRM)
    //with amount (in lbs) for each, then add to total mcu
    malts.forEach(malt => {
      amount = this.unitConverter['M']['I'](malt.quantity);
      colour = malt.colour || 0;

      totalMcu += amount * colour;
    });

    return totalMcu / batchVolume;
  },

  //calc beer colour in SRM
  calcBeerSrm: function(mcu) {
    return (1.4922 * Math.pow(mcu, 0.6859)).toFixed(1);
  },

  //returns the hex value from the srm colour look-up table
  srmToHex: function(srm) {
    srm = Math.round(srm);
    return srm > 40 ? this.srmColourMap['max'] : srmColourMap[srm];
  },


  //Tinsenth method of calculating IBU.
  //Takes a hop opbject, the OG
  //(which is a string thanks to .toFixed()),
  //and the batch volume.
  //The Tinsenth method is in SI units, so vol is in L and hop weight in g.
  calcIbu: function(hop, og, batchVolume) {
    og = parseFloat(og);
    batchVolume = parseFloat(batchVolume);

    if(!hop.boil_time || !batchVolume ||
      isNaN(batchVolume) || !og || isNaN(og)) {

      return 0;
    }

    let bigness = 1.65 * Math.pow(0.000125, (og - 1));
    let aa = hop.aa / 100; //make it an actual % decimal
    let boilTimeFactor = (1 - Math.pow(Math.E, (-0.04 * hop.boil_time))) / 4;
    let utilisation = boilTimeFactor * bigness;
    let mglAa = aa * hop.quantity * 1000 / batchVolume;
    let ibu = utilisation * mglAa;

    return ibu;
  },

  //returns a total ibu value by repeatedly calling
  //calcIbu on an array of hops
  getTotalIbu: function(hops, og, batchVolume) {
    og = parseFloat(og);
    var totalIbus = 0;

    if(!batchVolume || !og) { return 0; }

    hops.forEach(hop => {
      totalIbus += this.calcIbu(hop, og, batchVolume);
    });

    return totalIbus.toFixed(1);
  }
}
