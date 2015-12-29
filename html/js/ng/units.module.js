// measurement units module
angular.module('lec.units', [])

// all predefined value constants
.constant('lec.units.constants', {
        english: { abbrev: 'e', label: 'inches', resolutions: { default: 16, arr: new Array(2, 4, 8, 16, 32, 64) } },
        metric: { abbrev: 'm', label: 'cm', resolutions: { default: 10, arr: new Array(10) } },
        pixel: { abbrev: 'p', label: 'px', resolutions: { default: 1, arr: new Array(1) } }
})

.value('lec.units.properties', {
    type: 'e',
    resolution: 16,
    pixelsPerType: 0,
})

// verifies units
.factory('lec.units.service.accessors', ['lec.units.constants', function(constants) {
    return {
        //
        // finds the default resolution for measurement units based off of the unit abbreviation
        // @unitabbrev: the measurement unit abbreviation
        // @return: the default resolution associated with the desired units or false
        resolution: function(unitabbrev) {
            var resolution = false;
            switch (unitabbrev) {
                case constants.english.abbrev:
                    resolution = constants.english.resolutions.default;
                    break;
                case constants.metric.abbrev:
                    resolution = constants.metric.resolutions.default;
                    break;
                case constants.pixel.abbrev:
                    resolution = constants.pixel.resolutions.default;
                    break;
            }
            return resolution;
        },
        //
        // gets the measurement unit label associated with a measurement unit abbreviation
        // @unitabbrev: the measurement unit abbreviation
        // @return: the label for the measurement unit
        unitlabel: function(unitabbrev) {
            var label = false;
            switch (unitabbrev) {
                case constants.english.abbrev:
                    label = constants.english.label;
                    break;
                case constants.metric.abbrev:
                    label = constants.metric.label;
                    break;
                case constants.pixel.abbrev:
                    label = constants.pixel.label;
                    break;
            }
            return label;
        },
    };
}])

// calculates, converts, and approximates units
.factory('lec.units.service.calculate', ['lec.units.properties', function(properties) {

    // finds the gcd of fractions so can divide both top and bottom of fraction by gcd value
    gcd = function(a,b) {
        a = Math.abs(a);
        b = Math.abs(b);
        if( a < b) {
            //list(b,a) = Array(a,b);
            temp = a;
            a = b;
            b = temp;
        }
        if( b == 0) return a;
        r = a % b;
        while(r > 0) {
            a = b;
            b = r;
            r = a % b;
        }
        return b;
    }

    return {
        //
        // estimates a decimal value in fractional units
        // @decimal: the value to estimate
        // @resolution: the resolution of the fraction to estimate the value in, such as 4 for 1/4th, 8 for 1/8th, or 16 for 1/16th
        // @return: false if can't approximate, or object like this...{ display: '1 and 1/2', value: 1.5 }
        approximateUnits: function(decimal, resolution) {
            var result = false, whole, fractional, remaining, numerator, denominator, factor, display, value;
            // if decimal is a float, and resolution is an integer
            if (!isNaN(parseFloat(decimal)) && Math.round(resolution) === resolution) {
                whole = Math.floor(decimal);
                fractional = decimal - whole;
                // number of resolutions of an inch
                remaining = fractional * resolution;
                // generate numerator
                numerator = Math.round(remaining);
                // can never have zero estimated unit results, so round up to 1st resolution value
                if (whole == 0 && numerator == 0) numerator = 1;
                // set denominator
                denominator = resolution;
                // generate the gcd of the fraction
                factor = gcd(numerator, denominator);
                if (factor > 1) {
                    // divide the numerator and denominator by factor
                    numerator = numerator / factor;
                    denominator = denominator / factor;
                }
                // if the numerator is zero, then just display the whole part
                if (numerator == 0) {
                    display = '' + whole;
                    value = whole;
                // if the resolution is an even tenth, such as with metric units,
                //   then display decimal display results
                } else if (resolution == 10) {
                    // set calculated value
                    value = whole + (numerator/denominator);
                    // set display value
                    display = '' + value;
                // else if fractional part is 1/1
                } else if (numerator == 1 && denominator == 1){
                    // set calculated value
                    value = whole + 1;
                    // set display value
                    display = '' + value;
                // else display any other fractional type units
                } else {
                    // set display value
                    display = ((whole > 0 ? (whole + ' and ') : '') + numerator + '/' + denominator);
                    // set calculated value
                    value = whole + (numerator/denominator);
                }
                result = {
                    display: display,
                    value: value
                };
            }
            return result;
        },
        //
        // convert a value from inches to cm, or cm to inches
        // @type the unit type to convert to, either 'e' for english, or 'm' for metric
        // @value: the value to convert the units for
        // @return: -1 if invalid, converted decimal value if valid
        convertTo: function(type, value) {
            var returnValue = false;
            // 1 inch = 2.54 cm
            var factor = 2.54;

            // if value is numeric, then process it 
            if (!isNaN(parseFloat(value))) {
                // convert cm to inches, value is in cm
                if (type == 'e') {
                        returnValue = value / factor;
                // convert inches to cm, value is in inches
                } else if (type == 'm') {
                        returnValue  = value * factor;
                }
            }
            return returnValue;
        },
        //
        // determines the number of pixels per unit measurement for the entire laminate
        // @measurement: value is an integer indicating how many unit resolutions, such as 17/16 which is 1 and 1/16
        // @pixels: the number of pixels that make up the measurement unit value
        // @return: 0 if invalid, or the pixel ratio decimal value
        pixelRatio: function(measurement, pixels) {
            // if both measurement and pixels are integers
            if (Math.round(measurement) == measurement && Math.round(pixels) == pixels)
                properties.pixelsPerType = pixels / measurement;
            // else reset the pixel ratio to zero
            else
                properties.pixelsPerType = 0;
            return properties.pixelsPerType;
        },
    };
}])

// verifies units
.factory('lec.units.service.verify', ['lec.units.constants', 'lec.units.properties', function(constants, properties) {
    return {
        //
        // verifies the unit argments for /js/json/units.php json service queries
        // @type, the unit type, either 'e' for 'english' or 'm' for 'metric'
        // $resolution, for english units only, the fractional unit resolution, such as 2,4,8,16,32,64
        // @min, when generating a range of units, this is the minimum whole number, such as 23
        // @max, when generating a range of units, this is the maximum whole number, such as 30
        // @return: true if parameters are valid, false if not
        jsonQry: function(type, resolution, min, max) {
            // verify max and min
            if (
                // if min is not empty and not an integer, and max is an integer
                (min != undefined && min != parseInt(min, 10) && max == parseInt(max, 10)) ||
                // if max is not empty and not an integer, and min is an integer
                (max != undefined && min == parseInt(min, 10) && max != parseInt(max, 10)) ||
                // if both max and min are not empty and both are integers
                (min != undefined && max != undefined && min != parseInt(min, 10) && max != parseInt(max, 10))
               ) return false;
            // continues onto this point if max and min are both undefined or are both integers
            // check unit type
            switch (type) {
                case constants.english.abbrev:
                    if (constants.english.resolutions.arr.indexOf(resolution) == -1) {
                        return false;
                    }
                    break;
                case constants.metric.abbrev:
                    // resolution needs to be undefined or null in metric units for argument to be valid
                    if (resolution != undefined || resolution != null) return false;
                    break;
                default:
                    // invalid unit type
                    return false;
            }
            // every applicable argument is valid at this point
            return true;
        },
        //
        // verifies a valid unit type and resolution
        // @type: the units type, such as 'e', 'm', or 'p'
        // @resolution: only needed for english unit types, an integer, or can be undefined
        units: function(type, resolution) {
            var result = false;
            switch (type) {
                case constants.english.abbrev:
                    // if resolution is incorrect, then return false
                    if (constants.english.resolutions.arr.indexOf(resolution) == -1) return false;
                    // valid arguments set
                    result = true;
                    break;
                case constants.metric.abbrev:
                case constants.pixel.abbrev:
                    // valid arguments set
                    result = true;
                    break;
            }
            return result;
        },
    }
}]);