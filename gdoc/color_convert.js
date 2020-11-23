
var protoToCssColor = function(rgbColor) {
   var redFrac = rgbColor.red || 0.0;
   var greenFrac = rgbColor.green || 0.0;
   var blueFrac = rgbColor.blue || 0.0;
   var red = Math.floor(redFrac * 255);
   var green = Math.floor(greenFrac * 255);
   var blue = Math.floor(blueFrac * 255);

   if (!('alpha' in rgbColor)) {
      return rgbToCssColor_(red, green, blue);
   }

   var alphaFrac = rgbColor.alpha.value || 0.0;
   var rgbParams = [red, green, blue].join(',');
   return ['rgba(', rgbParams, ',', alphaFrac, ')'].join('');
};

var rgbToCssColor_ = function(red, green, blue) {
  var rgbNumber = new Number((red << 16) | (green << 8) | blue);
  var hexString = rgbNumber.toString(16);
  var missingZeros = 6 - hexString.length;
  var resultBuilder = ['#'];
  for (var i = 0; i < missingZeros; i++) {
     resultBuilder.push('0');
  }
  resultBuilder.push(hexString);
  return resultBuilder.join('');
};

rgb_color ={}
rgb_color.red = 60;
rgb_color.green = 179;
rgb_color.blue = 113;
rgb_color.alpha = 0.1;
console.log(protoToCssColor(rgb_color))