//
// website relative path to javascript configuration. changed for every install of this software on a website
//
var _configRelativeJsPath = '';

// utility.lec website module
angular.module("lec.utility", ['ui.bootstrap', 'lec.segmented', 'lec.units'])

// configure path to accordion and tabbed angular ui code
.config(function($provide) {
  $provide.decorator('accordionDirective', function($delegate) {
    //array of accordion directives
    $delegate[0].templateUrl = _configRelativeJsPath + "/js/vendor/angular/template/accordion/accordion.html";
    return $delegate;
  });
  $provide.decorator('accordionGroupDirective', function($delegate) {
    //array of accordion-group directives
    $delegate[0].templateUrl = _configRelativeJsPath + "/js/vendor/angular/template/accordion/accordion-group.html";
    return $delegate;
  });
  $provide.decorator('tabDirective', function($delegate) {
    //array of tab directives
    $delegate[0].templateUrl = _configRelativeJsPath + "/js/vendor/angular/template/tabs/tab.html";
    return $delegate;
  });
  $provide.decorator('tabsetDirective', function($delegate) {
    //array of tabset directives
    $delegate[0].templateUrl = _configRelativeJsPath + "/js/vendor/angular/template/tabs/tabset.html";
    return $delegate;
  });
})

// converts decimal inches to fractinal inches
.controller('lec.utility.controller.fractionalInches', ['$scope', 'lec.units.service.calculate', 'lec.units.service.verify', function($scope, calc, verify) {
    $scope.unitslabel = 'inches';
    $scope.showresult = false;
    $scope.result = null;
    $scope.calculate = function() {
        // default values
        $scope.showresult = false;
        $scope.result = null;
        // if not a valid decimal, then return
        if (isNaN($scope.decimal)) {
            return;
        }
        // approximate in english units to 1/16" resolution
        var type = 'e', resolution = 16;
        // verify json query arguments are valid
        if (verify.units(type, resolution))
        {
            var temp = calc.approximateUnits($scope.decimal, resolution);
            if (temp != false) {
                $scope.showresult = true;
                $scope.result = temp.display;
            }
        }
    }
}])

// determines the cut angles for different segmented rings, and displays them
.controller('lec.utility.controller.segmentedRingCutAnglesChart', ['$scope', 'lec.segmented.service.calculate', 'lec.segmented.constants', function($scope, calculate, constants) {
    $scope.arrSegments = constants.segments;
    $scope.anglelabel = 'degrees';
    $scope.angle = function(segmentNumber) {
        var temp = calculate.cutAngle(segmentNumber);
        if (temp == false) return 'Unknown';
        else return temp;
    };
}])

// determines the cut angles for different segmented rings, and displays them
.controller('lec.utility.controller.segmentedBowlRingCalculator', ['$http', '$scope', 'lec.units.service.verify',
    'lec.units.constants', 'lec.units.service.accessors', 'lec.segmented.constants',
    'lec.segmented.service.calculate', 'lec.units.service.calculate', 'lec.segmented.service.draw',
    function($http, $scope, verify, unitsConst, unitsGet,
             segmentedConst, segmented, unitsCalc, draw) {
	$scope.form = {
		units: '',
		unitsdisplay: '',
		width: '',
		diameter: '',
		numberSegments: '',
	};
    // set the default units for the form
    $scope.form.units = unitsConst.english.abbrev;
	// defaults for accordian
	$scope.status = {
		closeOthers: true,
		isConfigOpen: true,
		isResultsOpen: false,
		isResultsDisabled: true,
	};

    // sets the default variables for controller
    function resetDefaults() {
        //
        // define the default values for ng-model data
        //
        // set selected values for option selects selected in HTML
        $scope.form.diameter = -1;
        $scope.form.numberSegments = -1;
        $scope.form.width = -1;
      
        //
        // define result defaults
        //
        $scope.showresult = false;
        $scope.strCutAngle = '';
        $scope.strDiameter = '';
        $scope.strDiameterMax = '';
        $scope.strLength = '';
        $scope.strWidth = '';
        $scope.strDiameter = '';
        $scope.strResults = '';
    }
    // //
    // // build a valid json measurement retrieval URL
    // //
    // $scope.buildJsonUrl = function() {
    //     var jsonUrl = 'js/json';
    //     var url, resolution;
    //     var result = { width: false, diameter: false };

    //     switch ($scope.form.units) {
    //         case unitsConst.english.abbrev:
    //             minWidth = 0;
    //             maxWidth = 5;
    //             minDiameter = 2;
    //             maxDiameter = 36;
    //             resolution = unitsConst.english.resolutions.default;
    //             url = jsonUrl + '?u=' + $scope.form.units + '&f=' + resolution;
    //             //console.log('url: '+ url);
    //             break;
    //         case unitsConst.metric.abbrev:
    //             minWidth = 0;
    //             maxWidth = 12;
    //             minDiameter = 0;
    //             maxDiameter = 100;
    //             url = jsonUrl + '?u=' + $scope.form.units;
    //             break;
    //         default:
    //             return result;
    //     }
    //     if (verify.jsonQry($scope.form.units, resolution, minWidth, maxWidth)) result.width = url + '&min=' + minWidth + '&max=' + maxWidth;
    //     if (verify.jsonQry($scope.form.units, resolution, minDiameter, maxDiameter)) result.diameter = url + '&min=' + minDiameter + '&max=' + maxDiameter;
    //     return result;
    // };
    //
    // fill measurement drop downs with data
    //
    $scope.measurementTypeChange = function() {
        // set defaults
        $scope.form.unitsdisplay = false;
        $scope.rangeWidths = false;
        $scope.rangeDiameters = false;
        // // builds the json URL to query for select dropdown options
        // $scope.urls = $scope.buildJsonUrl();
        // //console.log('json width: ' + $scope.urls.width);
        // //console.log('json diameter: ' + $scope.urls.diameter);
        // if ($scope.urls.width == false) {
        //     console.log('JSON retrieval error for width HTML select options.');
        //     return;
        // } else $http.get($scope.urls.width).success(function(response) {
        //         $scope.rangeWidths = response;
        // });
        // if ($scope.urls.diameter == false) {
        //     console.log('JSON retrieval error for diameter HTML select options.');
        //     return;
        // } else $http.get($scope.urls.diameter).success(function(response) {
        //     $scope.rangeDiameters = response;
            
        // });

        //
        // set the measurement labels for the select drop downs
        //
        switch ($scope.form.units) {
            case unitsConst.english.abbrev:
                $scope.rangeWidths = englishRangeWidths;
                $scope.rangeDiameters = englishRangeDiameters;
                $scope.form.unitsdisplay = unitsConst.english.label;
                break;
            case unitsConst.metric.abbrev:
                $scope.rangeWidths = metricRangeWidths;
                $scope.rangeDiameters = metricRangeDiameters;
                $scope.form.unitsdisplay = unitsConst.metric.label;
                break;
        }
        resetDefaults();
    }
    //
    // calculate all values when submit button is pressed
    //
    $scope.calculate = function() {
        var result = false;
        var numberSegments = parseFloat($scope.form.numberSegments);
        // if the arguments are not chosen, then return
        if ($scope.form.diameter <= 0 || $scope.form.numberSegments <= 0 || $scope.form.width <= 0 ||
            isNaN(parseFloat($scope.form.diameter)) ||
            isNaN(numberSegments) ||
            isNaN(parseFloat($scope.form.width))) {
            resetDefaults();
			$scope.status.isConfigOpen = true;
			$scope.status.isResultsOpen = false;
			$scope.status.isResultsDisabled = true;
            return result;
        }
        // find the segment cut angle
        var cutAngle = segmented.cutAngle(numberSegments);
        $scope.strCutAngle = cutAngle + ' degrees';

        var diameter = { approx: { str: 0, decimal: 0 }, exact: 0 };
        var circumference = { approx: { str: 0, decimal: 0 }, exact: 0 };
        var length = { approx: { str: 0, decimal: 0 }, exact: 0 };
        
        // find default unit resolution
        var resolution = unitsGet.resolution($scope.form.units);
        
        // calculate circumferences and segment lengths
        // note that the final turned circumference is $scope.diameter, which is positioned
        //      approx halfway between the width of a segment. So diameter to calculate segment length with
        //      is ($scope.diameter + 2 * 1/2 * segment width)
        var diameterMax = parseFloat($scope.form.diameter) + parseFloat($scope.form.width);
        circumference.exact = segmented.circumference.diameterBased(diameterMax);
        length.exact = circumference.exact / numberSegments;
        //console.log('#max diameter: ' + diameterMax + ' circum: ' + circumference.exact + ' length: ' + length.exact);
        var temp = unitsCalc.approximateUnits(length.exact, resolution);
        if (temp == false) return result;

        length.approx.str = temp.display;
        length.approx.decimal = temp.value;

        // set approximate diameter and circumference based off approximate segmeent length
        var approxCircum = segmented.circumference.segmentLengthBased(length.approx.decimal, numberSegments);
        var approxDiameter = approxCircum / Math.PI;
        
        // calculate approximate circumference based off of approximate segment length
        temp = unitsCalc.approximateUnits(approxCircum, resolution);
        if (temp == false) return result;
        circumference.approx.str = temp.display;
        circumference.approx.decimal = temp.value;

	// calculate approximate ring diameter
        temp = unitsCalc.approximateUnits(approxDiameter, resolution);
        if (temp == false) return result;
        diameter.approx.str = temp.display;
        diameter.approx.decimal = temp.value;
        
        // set measurement units label
        var label = ' ' + unitsGet.unitlabel($scope.form.units);
        // set the length display
        $scope.strLength = length.exact + label + ', which is approximately ' + length.approx.str + label;

	// set the final turned diameter of the segmented ring
        $scope.strDiameter =  unitsCalc.approximateUnits($scope.form.diameter, resolution).display + label;

        // set the approximate outer border of ring unturned diameter
        $scope.strDiameterMax = 'approximately ' + diameter.approx.str + label;

        // set the segmented width of the segmented ring
        $scope.strWidth = unitsCalc.approximateUnits($scope.form.width, resolution).display + label;
        // show the results
        $scope.showresult = true;
        // draw the segmented ring
        draw.ringWithLabels($scope.form.numberSegments);
        $scope.strResults = 'Results are listed below.';
		
		$scope.status.isConfigOpen = false;
		$scope.status.isResultsOpen = true;
		$scope.status.isResultsDisabled = false;

        return result;
    };

    //
    // define values for select html drop downs
    //
    resetDefaults();
    $scope.rangeSegments = segmentedConst.segments;
    $scope.measurementTypeChange();
}])

;

var englishRangeWidths = [
        
    {
        "display": "1/8",
        "value": 0.125
    },
    
    {
        "display": "1/4",
        "value": 0.25
    },
    
    {
        "display": "3/8",
        "value": 0.375
    },
    
    {
        "display": "1/2",
        "value": 0.5
    },
    
    {
        "display": "5/8",
        "value": 0.625
    },
    
    {
        "display": "3/4",
        "value": 0.75
    },
    
    {
        "display": "7/8",
        "value": 0.875
    },

{
    "display": "1",
    "value": 1
},

    {
        "display": "1 1/8",
        "value": 1.125
    },
    
    {
        "display": "1 1/4",
        "value": 1.25
    },
    
    {
        "display": "1 3/8",
        "value": 1.375
    },
    
    {
        "display": "1 1/2",
        "value": 1.5
    },
    
    {
        "display": "1 5/8",
        "value": 1.625
    },
    
    {
        "display": "1 3/4",
        "value": 1.75
    },
    
    {
        "display": "1 7/8",
        "value": 1.875
    },

{
    "display": "2",
    "value": 2
},

    {
        "display": "2 1/8",
        "value": 2.125
    },
    
    {
        "display": "2 1/4",
        "value": 2.25
    },
    
    {
        "display": "2 3/8",
        "value": 2.375
    },
    
    {
        "display": "2 1/2",
        "value": 2.5
    },
    
    {
        "display": "2 5/8",
        "value": 2.625
    },
    
    {
        "display": "2 3/4",
        "value": 2.75
    },
    
    {
        "display": "2 7/8",
        "value": 2.875
    },

{
    "display": "3",
    "value": 3
},

    {
        "display": "3 1/8",
        "value": 3.125
    },
    
    {
        "display": "3 1/4",
        "value": 3.25
    },
    
    {
        "display": "3 3/8",
        "value": 3.375
    },
    
    {
        "display": "3 1/2",
        "value": 3.5
    },
    
    {
        "display": "3 5/8",
        "value": 3.625
    },
    
    {
        "display": "3 3/4",
        "value": 3.75
    },
    
    {
        "display": "3 7/8",
        "value": 3.875
    },

{
    "display": "4",
    "value": 4
},

    {
        "display": "4 1/8",
        "value": 4.125
    },
    
    {
        "display": "4 1/4",
        "value": 4.25
    },
    
    {
        "display": "4 3/8",
        "value": 4.375
    },
    
    {
        "display": "4 1/2",
        "value": 4.5
    },
    
    {
        "display": "4 5/8",
        "value": 4.625
    },
    
    {
        "display": "4 3/4",
        "value": 4.75
    },
    
    {
        "display": "4 7/8",
        "value": 4.875
    },

{
    "display": "5",
    "value": 5
}

];


var englishRangeDiameters = 
[

        {
            "display": "2",
            "value": 2
        },
        
            {
                "display": "2 1/8",
                "value": 2.125
            },
            
            {
                "display": "2 1/4",
                "value": 2.25
            },
            
            {
                "display": "2 3/8",
                "value": 2.375
            },
            
            {
                "display": "2 1/2",
                "value": 2.5
            },
            
            {
                "display": "2 5/8",
                "value": 2.625
            },
            
            {
                "display": "2 3/4",
                "value": 2.75
            },
            
            {
                "display": "2 7/8",
                "value": 2.875
            },
    
        {
            "display": "3",
            "value": 3
        },
        
            {
                "display": "3 1/8",
                "value": 3.125
            },
            
            {
                "display": "3 1/4",
                "value": 3.25
            },
            
            {
                "display": "3 3/8",
                "value": 3.375
            },
            
            {
                "display": "3 1/2",
                "value": 3.5
            },
            
            {
                "display": "3 5/8",
                "value": 3.625
            },
            
            {
                "display": "3 3/4",
                "value": 3.75
            },
            
            {
                "display": "3 7/8",
                "value": 3.875
            },
    
        {
            "display": "4",
            "value": 4
        },
        
            {
                "display": "4 1/8",
                "value": 4.125
            },
            
            {
                "display": "4 1/4",
                "value": 4.25
            },
            
            {
                "display": "4 3/8",
                "value": 4.375
            },
            
            {
                "display": "4 1/2",
                "value": 4.5
            },
            
            {
                "display": "4 5/8",
                "value": 4.625
            },
            
            {
                "display": "4 3/4",
                "value": 4.75
            },
            
            {
                "display": "4 7/8",
                "value": 4.875
            },
    
        {
            "display": "5",
            "value": 5
        },
        
            {
                "display": "5 1/8",
                "value": 5.125
            },
            
            {
                "display": "5 1/4",
                "value": 5.25
            },
            
            {
                "display": "5 3/8",
                "value": 5.375
            },
            
            {
                "display": "5 1/2",
                "value": 5.5
            },
            
            {
                "display": "5 5/8",
                "value": 5.625
            },
            
            {
                "display": "5 3/4",
                "value": 5.75
            },
            
            {
                "display": "5 7/8",
                "value": 5.875
            },
    
        {
            "display": "6",
            "value": 6
        },
        
            {
                "display": "6 1/8",
                "value": 6.125
            },
            
            {
                "display": "6 1/4",
                "value": 6.25
            },
            
            {
                "display": "6 3/8",
                "value": 6.375
            },
            
            {
                "display": "6 1/2",
                "value": 6.5
            },
            
            {
                "display": "6 5/8",
                "value": 6.625
            },
            
            {
                "display": "6 3/4",
                "value": 6.75
            },
            
            {
                "display": "6 7/8",
                "value": 6.875
            },
    
        {
            "display": "7",
            "value": 7
        },
        
            {
                "display": "7 1/8",
                "value": 7.125
            },
            
            {
                "display": "7 1/4",
                "value": 7.25
            },
            
            {
                "display": "7 3/8",
                "value": 7.375
            },
            
            {
                "display": "7 1/2",
                "value": 7.5
            },
            
            {
                "display": "7 5/8",
                "value": 7.625
            },
            
            {
                "display": "7 3/4",
                "value": 7.75
            },
            
            {
                "display": "7 7/8",
                "value": 7.875
            },
    
        {
            "display": "8",
            "value": 8
        },
        
            {
                "display": "8 1/8",
                "value": 8.125
            },
            
            {
                "display": "8 1/4",
                "value": 8.25
            },
            
            {
                "display": "8 3/8",
                "value": 8.375
            },
            
            {
                "display": "8 1/2",
                "value": 8.5
            },
            
            {
                "display": "8 5/8",
                "value": 8.625
            },
            
            {
                "display": "8 3/4",
                "value": 8.75
            },
            
            {
                "display": "8 7/8",
                "value": 8.875
            },
    
        {
            "display": "9",
            "value": 9
        },
        
            {
                "display": "9 1/8",
                "value": 9.125
            },
            
            {
                "display": "9 1/4",
                "value": 9.25
            },
            
            {
                "display": "9 3/8",
                "value": 9.375
            },
            
            {
                "display": "9 1/2",
                "value": 9.5
            },
            
            {
                "display": "9 5/8",
                "value": 9.625
            },
            
            {
                "display": "9 3/4",
                "value": 9.75
            },
            
            {
                "display": "9 7/8",
                "value": 9.875
            },
    
        {
            "display": "10",
            "value": 10
        },
        
            {
                "display": "10 1/8",
                "value": 10.125
            },
            
            {
                "display": "10 1/4",
                "value": 10.25
            },
            
            {
                "display": "10 3/8",
                "value": 10.375
            },
            
            {
                "display": "10 1/2",
                "value": 10.5
            },
            
            {
                "display": "10 5/8",
                "value": 10.625
            },
            
            {
                "display": "10 3/4",
                "value": 10.75
            },
            
            {
                "display": "10 7/8",
                "value": 10.875
            },
    
        {
            "display": "11",
            "value": 11
        },
        
            {
                "display": "11 1/8",
                "value": 11.125
            },
            
            {
                "display": "11 1/4",
                "value": 11.25
            },
            
            {
                "display": "11 3/8",
                "value": 11.375
            },
            
            {
                "display": "11 1/2",
                "value": 11.5
            },
            
            {
                "display": "11 5/8",
                "value": 11.625
            },
            
            {
                "display": "11 3/4",
                "value": 11.75
            },
            
            {
                "display": "11 7/8",
                "value": 11.875
            },
    
        {
            "display": "12",
            "value": 12
        },
        
            {
                "display": "12 1/8",
                "value": 12.125
            },
            
            {
                "display": "12 1/4",
                "value": 12.25
            },
            
            {
                "display": "12 3/8",
                "value": 12.375
            },
            
            {
                "display": "12 1/2",
                "value": 12.5
            },
            
            {
                "display": "12 5/8",
                "value": 12.625
            },
            
            {
                "display": "12 3/4",
                "value": 12.75
            },
            
            {
                "display": "12 7/8",
                "value": 12.875
            },
    
        {
            "display": "13",
            "value": 13
        },
        
            {
                "display": "13 1/8",
                "value": 13.125
            },
            
            {
                "display": "13 1/4",
                "value": 13.25
            },
            
            {
                "display": "13 3/8",
                "value": 13.375
            },
            
            {
                "display": "13 1/2",
                "value": 13.5
            },
            
            {
                "display": "13 5/8",
                "value": 13.625
            },
            
            {
                "display": "13 3/4",
                "value": 13.75
            },
            
            {
                "display": "13 7/8",
                "value": 13.875
            },
    
        {
            "display": "14",
            "value": 14
        },
        
            {
                "display": "14 1/8",
                "value": 14.125
            },
            
            {
                "display": "14 1/4",
                "value": 14.25
            },
            
            {
                "display": "14 3/8",
                "value": 14.375
            },
            
            {
                "display": "14 1/2",
                "value": 14.5
            },
            
            {
                "display": "14 5/8",
                "value": 14.625
            },
            
            {
                "display": "14 3/4",
                "value": 14.75
            },
            
            {
                "display": "14 7/8",
                "value": 14.875
            },
    
        {
            "display": "15",
            "value": 15
        },
        
            {
                "display": "15 1/8",
                "value": 15.125
            },
            
            {
                "display": "15 1/4",
                "value": 15.25
            },
            
            {
                "display": "15 3/8",
                "value": 15.375
            },
            
            {
                "display": "15 1/2",
                "value": 15.5
            },
            
            {
                "display": "15 5/8",
                "value": 15.625
            },
            
            {
                "display": "15 3/4",
                "value": 15.75
            },
            
            {
                "display": "15 7/8",
                "value": 15.875
            },
    
        {
            "display": "16",
            "value": 16
        },
        
            {
                "display": "16 1/8",
                "value": 16.125
            },
            
            {
                "display": "16 1/4",
                "value": 16.25
            },
            
            {
                "display": "16 3/8",
                "value": 16.375
            },
            
            {
                "display": "16 1/2",
                "value": 16.5
            },
            
            {
                "display": "16 5/8",
                "value": 16.625
            },
            
            {
                "display": "16 3/4",
                "value": 16.75
            },
            
            {
                "display": "16 7/8",
                "value": 16.875
            },
    
        {
            "display": "17",
            "value": 17
        },
        
            {
                "display": "17 1/8",
                "value": 17.125
            },
            
            {
                "display": "17 1/4",
                "value": 17.25
            },
            
            {
                "display": "17 3/8",
                "value": 17.375
            },
            
            {
                "display": "17 1/2",
                "value": 17.5
            },
            
            {
                "display": "17 5/8",
                "value": 17.625
            },
            
            {
                "display": "17 3/4",
                "value": 17.75
            },
            
            {
                "display": "17 7/8",
                "value": 17.875
            },
    
        {
            "display": "18",
            "value": 18
        },
        
            {
                "display": "18 1/8",
                "value": 18.125
            },
            
            {
                "display": "18 1/4",
                "value": 18.25
            },
            
            {
                "display": "18 3/8",
                "value": 18.375
            },
            
            {
                "display": "18 1/2",
                "value": 18.5
            },
            
            {
                "display": "18 5/8",
                "value": 18.625
            },
            
            {
                "display": "18 3/4",
                "value": 18.75
            },
            
            {
                "display": "18 7/8",
                "value": 18.875
            },
    
        {
            "display": "19",
            "value": 19
        },
        
            {
                "display": "19 1/8",
                "value": 19.125
            },
            
            {
                "display": "19 1/4",
                "value": 19.25
            },
            
            {
                "display": "19 3/8",
                "value": 19.375
            },
            
            {
                "display": "19 1/2",
                "value": 19.5
            },
            
            {
                "display": "19 5/8",
                "value": 19.625
            },
            
            {
                "display": "19 3/4",
                "value": 19.75
            },
            
            {
                "display": "19 7/8",
                "value": 19.875
            },
    
        {
            "display": "20",
            "value": 20
        },
        
            {
                "display": "20 1/8",
                "value": 20.125
            },
            
            {
                "display": "20 1/4",
                "value": 20.25
            },
            
            {
                "display": "20 3/8",
                "value": 20.375
            },
            
            {
                "display": "20 1/2",
                "value": 20.5
            },
            
            {
                "display": "20 5/8",
                "value": 20.625
            },
            
            {
                "display": "20 3/4",
                "value": 20.75
            },
            
            {
                "display": "20 7/8",
                "value": 20.875
            },
    
        {
            "display": "21",
            "value": 21
        },
        
            {
                "display": "21 1/8",
                "value": 21.125
            },
            
            {
                "display": "21 1/4",
                "value": 21.25
            },
            
            {
                "display": "21 3/8",
                "value": 21.375
            },
            
            {
                "display": "21 1/2",
                "value": 21.5
            },
            
            {
                "display": "21 5/8",
                "value": 21.625
            },
            
            {
                "display": "21 3/4",
                "value": 21.75
            },
            
            {
                "display": "21 7/8",
                "value": 21.875
            },
    
        {
            "display": "22",
            "value": 22
        },
        
            {
                "display": "22 1/8",
                "value": 22.125
            },
            
            {
                "display": "22 1/4",
                "value": 22.25
            },
            
            {
                "display": "22 3/8",
                "value": 22.375
            },
            
            {
                "display": "22 1/2",
                "value": 22.5
            },
            
            {
                "display": "22 5/8",
                "value": 22.625
            },
            
            {
                "display": "22 3/4",
                "value": 22.75
            },
            
            {
                "display": "22 7/8",
                "value": 22.875
            },
    
        {
            "display": "23",
            "value": 23
        },
        
            {
                "display": "23 1/8",
                "value": 23.125
            },
            
            {
                "display": "23 1/4",
                "value": 23.25
            },
            
            {
                "display": "23 3/8",
                "value": 23.375
            },
            
            {
                "display": "23 1/2",
                "value": 23.5
            },
            
            {
                "display": "23 5/8",
                "value": 23.625
            },
            
            {
                "display": "23 3/4",
                "value": 23.75
            },
            
            {
                "display": "23 7/8",
                "value": 23.875
            },
    
        {
            "display": "24",
            "value": 24
        },
        
            {
                "display": "24 1/8",
                "value": 24.125
            },
            
            {
                "display": "24 1/4",
                "value": 24.25
            },
            
            {
                "display": "24 3/8",
                "value": 24.375
            },
            
            {
                "display": "24 1/2",
                "value": 24.5
            },
            
            {
                "display": "24 5/8",
                "value": 24.625
            },
            
            {
                "display": "24 3/4",
                "value": 24.75
            },
            
            {
                "display": "24 7/8",
                "value": 24.875
            },
    
        {
            "display": "25",
            "value": 25
        },
        
            {
                "display": "25 1/8",
                "value": 25.125
            },
            
            {
                "display": "25 1/4",
                "value": 25.25
            },
            
            {
                "display": "25 3/8",
                "value": 25.375
            },
            
            {
                "display": "25 1/2",
                "value": 25.5
            },
            
            {
                "display": "25 5/8",
                "value": 25.625
            },
            
            {
                "display": "25 3/4",
                "value": 25.75
            },
            
            {
                "display": "25 7/8",
                "value": 25.875
            },
    
        {
            "display": "26",
            "value": 26
        },
        
            {
                "display": "26 1/8",
                "value": 26.125
            },
            
            {
                "display": "26 1/4",
                "value": 26.25
            },
            
            {
                "display": "26 3/8",
                "value": 26.375
            },
            
            {
                "display": "26 1/2",
                "value": 26.5
            },
            
            {
                "display": "26 5/8",
                "value": 26.625
            },
            
            {
                "display": "26 3/4",
                "value": 26.75
            },
            
            {
                "display": "26 7/8",
                "value": 26.875
            },
    
        {
            "display": "27",
            "value": 27
        },
        
            {
                "display": "27 1/8",
                "value": 27.125
            },
            
            {
                "display": "27 1/4",
                "value": 27.25
            },
            
            {
                "display": "27 3/8",
                "value": 27.375
            },
            
            {
                "display": "27 1/2",
                "value": 27.5
            },
            
            {
                "display": "27 5/8",
                "value": 27.625
            },
            
            {
                "display": "27 3/4",
                "value": 27.75
            },
            
            {
                "display": "27 7/8",
                "value": 27.875
            },
    
        {
            "display": "28",
            "value": 28
        },
        
            {
                "display": "28 1/8",
                "value": 28.125
            },
            
            {
                "display": "28 1/4",
                "value": 28.25
            },
            
            {
                "display": "28 3/8",
                "value": 28.375
            },
            
            {
                "display": "28 1/2",
                "value": 28.5
            },
            
            {
                "display": "28 5/8",
                "value": 28.625
            },
            
            {
                "display": "28 3/4",
                "value": 28.75
            },
            
            {
                "display": "28 7/8",
                "value": 28.875
            },
    
        {
            "display": "29",
            "value": 29
        },
        
            {
                "display": "29 1/8",
                "value": 29.125
            },
            
            {
                "display": "29 1/4",
                "value": 29.25
            },
            
            {
                "display": "29 3/8",
                "value": 29.375
            },
            
            {
                "display": "29 1/2",
                "value": 29.5
            },
            
            {
                "display": "29 5/8",
                "value": 29.625
            },
            
            {
                "display": "29 3/4",
                "value": 29.75
            },
            
            {
                "display": "29 7/8",
                "value": 29.875
            },
    
        {
            "display": "30",
            "value": 30
        },
        
            {
                "display": "30 1/8",
                "value": 30.125
            },
            
            {
                "display": "30 1/4",
                "value": 30.25
            },
            
            {
                "display": "30 3/8",
                "value": 30.375
            },
            
            {
                "display": "30 1/2",
                "value": 30.5
            },
            
            {
                "display": "30 5/8",
                "value": 30.625
            },
            
            {
                "display": "30 3/4",
                "value": 30.75
            },
            
            {
                "display": "30 7/8",
                "value": 30.875
            },
    
        {
            "display": "31",
            "value": 31
        },
        
            {
                "display": "31 1/8",
                "value": 31.125
            },
            
            {
                "display": "31 1/4",
                "value": 31.25
            },
            
            {
                "display": "31 3/8",
                "value": 31.375
            },
            
            {
                "display": "31 1/2",
                "value": 31.5
            },
            
            {
                "display": "31 5/8",
                "value": 31.625
            },
            
            {
                "display": "31 3/4",
                "value": 31.75
            },
            
            {
                "display": "31 7/8",
                "value": 31.875
            },
    
        {
            "display": "32",
            "value": 32
        },
        
            {
                "display": "32 1/8",
                "value": 32.125
            },
            
            {
                "display": "32 1/4",
                "value": 32.25
            },
            
            {
                "display": "32 3/8",
                "value": 32.375
            },
            
            {
                "display": "32 1/2",
                "value": 32.5
            },
            
            {
                "display": "32 5/8",
                "value": 32.625
            },
            
            {
                "display": "32 3/4",
                "value": 32.75
            },
            
            {
                "display": "32 7/8",
                "value": 32.875
            },
    
        {
            "display": "33",
            "value": 33
        },
        
            {
                "display": "33 1/8",
                "value": 33.125
            },
            
            {
                "display": "33 1/4",
                "value": 33.25
            },
            
            {
                "display": "33 3/8",
                "value": 33.375
            },
            
            {
                "display": "33 1/2",
                "value": 33.5
            },
            
            {
                "display": "33 5/8",
                "value": 33.625
            },
            
            {
                "display": "33 3/4",
                "value": 33.75
            },
            
            {
                "display": "33 7/8",
                "value": 33.875
            },
    
        {
            "display": "34",
            "value": 34
        },
        
            {
                "display": "34 1/8",
                "value": 34.125
            },
            
            {
                "display": "34 1/4",
                "value": 34.25
            },
            
            {
                "display": "34 3/8",
                "value": 34.375
            },
            
            {
                "display": "34 1/2",
                "value": 34.5
            },
            
            {
                "display": "34 5/8",
                "value": 34.625
            },
            
            {
                "display": "34 3/4",
                "value": 34.75
            },
            
            {
                "display": "34 7/8",
                "value": 34.875
            },
    
        {
            "display": "35",
            "value": 35
        },
        
            {
                "display": "35 1/8",
                "value": 35.125
            },
            
            {
                "display": "35 1/4",
                "value": 35.25
            },
            
            {
                "display": "35 3/8",
                "value": 35.375
            },
            
            {
                "display": "35 1/2",
                "value": 35.5
            },
            
            {
                "display": "35 5/8",
                "value": 35.625
            },
            
            {
                "display": "35 3/4",
                "value": 35.75
            },
            
            {
                "display": "35 7/8",
                "value": 35.875
            },
    
        {
            "display": "36",
            "value": 36
        }

];

var metricRangeWidths = 
[
        
            {
                "display": "0.1",
                "value": 0.1
            },
            
            {
                "display": "0.2",
                "value": 0.2
            },
            
            {
                "display": "0.3",
                "value": 0.3
            },
            
            {
                "display": "0.4",
                "value": 0.4
            },
            
            {
                "display": "0.5",
                "value": 0.5
            },
            
            {
                "display": "0.6",
                "value": 0.6
            },
            
            {
                "display": "0.7",
                "value": 0.7
            },
            
            {
                "display": "0.8",
                "value": 0.8
            },
            
            {
                "display": "0.9",
                "value": 0.9
            },
    
        {
            "display": "1",
            "value": 1
        },
        
            {
                "display": "1.1",
                "value": 1.1
            },
            
            {
                "display": "1.2",
                "value": 1.2
            },
            
            {
                "display": "1.3",
                "value": 1.3
            },
            
            {
                "display": "1.4",
                "value": 1.4
            },
            
            {
                "display": "1.5",
                "value": 1.5
            },
            
            {
                "display": "1.6",
                "value": 1.6
            },
            
            {
                "display": "1.7",
                "value": 1.7
            },
            
            {
                "display": "1.8",
                "value": 1.8
            },
            
            {
                "display": "1.9",
                "value": 1.9
            },
    
        {
            "display": "2",
            "value": 2
        },
        
            {
                "display": "2.1",
                "value": 2.1
            },
            
            {
                "display": "2.2",
                "value": 2.2
            },
            
            {
                "display": "2.3",
                "value": 2.3
            },
            
            {
                "display": "2.4",
                "value": 2.4
            },
            
            {
                "display": "2.5",
                "value": 2.5
            },
            
            {
                "display": "2.6",
                "value": 2.6
            },
            
            {
                "display": "2.7",
                "value": 2.7
            },
            
            {
                "display": "2.8",
                "value": 2.8
            },
            
            {
                "display": "2.9",
                "value": 2.9
            },
    
        {
            "display": "3",
            "value": 3
        },
        
            {
                "display": "3.1",
                "value": 3.1
            },
            
            {
                "display": "3.2",
                "value": 3.2
            },
            
            {
                "display": "3.3",
                "value": 3.3
            },
            
            {
                "display": "3.4",
                "value": 3.4
            },
            
            {
                "display": "3.5",
                "value": 3.5
            },
            
            {
                "display": "3.6",
                "value": 3.6
            },
            
            {
                "display": "3.7",
                "value": 3.7
            },
            
            {
                "display": "3.8",
                "value": 3.8
            },
            
            {
                "display": "3.9",
                "value": 3.9
            },
    
        {
            "display": "4",
            "value": 4
        },
        
            {
                "display": "4.1",
                "value": 4.1
            },
            
            {
                "display": "4.2",
                "value": 4.2
            },
            
            {
                "display": "4.3",
                "value": 4.3
            },
            
            {
                "display": "4.4",
                "value": 4.4
            },
            
            {
                "display": "4.5",
                "value": 4.5
            },
            
            {
                "display": "4.6",
                "value": 4.6
            },
            
            {
                "display": "4.7",
                "value": 4.7
            },
            
            {
                "display": "4.8",
                "value": 4.8
            },
            
            {
                "display": "4.9",
                "value": 4.9
            },
    
        {
            "display": "5",
            "value": 5
        },
        
            {
                "display": "5.1",
                "value": 5.1
            },
            
            {
                "display": "5.2",
                "value": 5.2
            },
            
            {
                "display": "5.3",
                "value": 5.3
            },
            
            {
                "display": "5.4",
                "value": 5.4
            },
            
            {
                "display": "5.5",
                "value": 5.5
            },
            
            {
                "display": "5.6",
                "value": 5.6
            },
            
            {
                "display": "5.7",
                "value": 5.7
            },
            
            {
                "display": "5.8",
                "value": 5.8
            },
            
            {
                "display": "5.9",
                "value": 5.9
            },
    
        {
            "display": "6",
            "value": 6
        },
        
            {
                "display": "6.1",
                "value": 6.1
            },
            
            {
                "display": "6.2",
                "value": 6.2
            },
            
            {
                "display": "6.3",
                "value": 6.3
            },
            
            {
                "display": "6.4",
                "value": 6.4
            },
            
            {
                "display": "6.5",
                "value": 6.5
            },
            
            {
                "display": "6.6",
                "value": 6.6
            },
            
            {
                "display": "6.7",
                "value": 6.7
            },
            
            {
                "display": "6.8",
                "value": 6.8
            },
            
            {
                "display": "6.9",
                "value": 6.9
            },
    
        {
            "display": "7",
            "value": 7
        },
        
            {
                "display": "7.1",
                "value": 7.1
            },
            
            {
                "display": "7.2",
                "value": 7.2
            },
            
            {
                "display": "7.3",
                "value": 7.3
            },
            
            {
                "display": "7.4",
                "value": 7.4
            },
            
            {
                "display": "7.5",
                "value": 7.5
            },
            
            {
                "display": "7.6",
                "value": 7.6
            },
            
            {
                "display": "7.7",
                "value": 7.7
            },
            
            {
                "display": "7.8",
                "value": 7.8
            },
            
            {
                "display": "7.9",
                "value": 7.9
            },
    
        {
            "display": "8",
            "value": 8
        },
        
            {
                "display": "8.1",
                "value": 8.1
            },
            
            {
                "display": "8.2",
                "value": 8.2
            },
            
            {
                "display": "8.3",
                "value": 8.3
            },
            
            {
                "display": "8.4",
                "value": 8.4
            },
            
            {
                "display": "8.5",
                "value": 8.5
            },
            
            {
                "display": "8.6",
                "value": 8.6
            },
            
            {
                "display": "8.7",
                "value": 8.7
            },
            
            {
                "display": "8.8",
                "value": 8.8
            },
            
            {
                "display": "8.9",
                "value": 8.9
            },
    
        {
            "display": "9",
            "value": 9
        },
        
            {
                "display": "9.1",
                "value": 9.1
            },
            
            {
                "display": "9.2",
                "value": 9.2
            },
            
            {
                "display": "9.3",
                "value": 9.3
            },
            
            {
                "display": "9.4",
                "value": 9.4
            },
            
            {
                "display": "9.5",
                "value": 9.5
            },
            
            {
                "display": "9.6",
                "value": 9.6
            },
            
            {
                "display": "9.7",
                "value": 9.7
            },
            
            {
                "display": "9.8",
                "value": 9.8
            },
            
            {
                "display": "9.9",
                "value": 9.9
            },
    
        {
            "display": "10",
            "value": 10
        },
        
            {
                "display": "10.1",
                "value": 10.1
            },
            
            {
                "display": "10.2",
                "value": 10.2
            },
            
            {
                "display": "10.3",
                "value": 10.3
            },
            
            {
                "display": "10.4",
                "value": 10.4
            },
            
            {
                "display": "10.5",
                "value": 10.5
            },
            
            {
                "display": "10.6",
                "value": 10.6
            },
            
            {
                "display": "10.7",
                "value": 10.7
            },
            
            {
                "display": "10.8",
                "value": 10.8
            },
            
            {
                "display": "10.9",
                "value": 10.9
            },
    
        {
            "display": "11",
            "value": 11
        },
        
            {
                "display": "11.1",
                "value": 11.1
            },
            
            {
                "display": "11.2",
                "value": 11.2
            },
            
            {
                "display": "11.3",
                "value": 11.3
            },
            
            {
                "display": "11.4",
                "value": 11.4
            },
            
            {
                "display": "11.5",
                "value": 11.5
            },
            
            {
                "display": "11.6",
                "value": 11.6
            },
            
            {
                "display": "11.7",
                "value": 11.7
            },
            
            {
                "display": "11.8",
                "value": 11.8
            },
            
            {
                "display": "11.9",
                "value": 11.9
            },
    
        {
            "display": "12",
            "value": 12
        }

];

var metricRangeDiameters = 

[
        
    {
        "display": "0.1",
        "value": 0.1
    },
    
    {
        "display": "0.2",
        "value": 0.2
    },
    
    {
        "display": "0.3",
        "value": 0.3
    },
    
    {
        "display": "0.4",
        "value": 0.4
    },
    
    {
        "display": "0.5",
        "value": 0.5
    },
    
    {
        "display": "0.6",
        "value": 0.6
    },
    
    {
        "display": "0.7",
        "value": 0.7
    },
    
    {
        "display": "0.8",
        "value": 0.8
    },
    
    {
        "display": "0.9",
        "value": 0.9
    },

{
    "display": "1",
    "value": 1
},

    {
        "display": "1.1",
        "value": 1.1
    },
    
    {
        "display": "1.2",
        "value": 1.2
    },
    
    {
        "display": "1.3",
        "value": 1.3
    },
    
    {
        "display": "1.4",
        "value": 1.4
    },
    
    {
        "display": "1.5",
        "value": 1.5
    },
    
    {
        "display": "1.6",
        "value": 1.6
    },
    
    {
        "display": "1.7",
        "value": 1.7
    },
    
    {
        "display": "1.8",
        "value": 1.8
    },
    
    {
        "display": "1.9",
        "value": 1.9
    },

{
    "display": "2",
    "value": 2
},

    {
        "display": "2.1",
        "value": 2.1
    },
    
    {
        "display": "2.2",
        "value": 2.2
    },
    
    {
        "display": "2.3",
        "value": 2.3
    },
    
    {
        "display": "2.4",
        "value": 2.4
    },
    
    {
        "display": "2.5",
        "value": 2.5
    },
    
    {
        "display": "2.6",
        "value": 2.6
    },
    
    {
        "display": "2.7",
        "value": 2.7
    },
    
    {
        "display": "2.8",
        "value": 2.8
    },
    
    {
        "display": "2.9",
        "value": 2.9
    },

{
    "display": "3",
    "value": 3
},

    {
        "display": "3.1",
        "value": 3.1
    },
    
    {
        "display": "3.2",
        "value": 3.2
    },
    
    {
        "display": "3.3",
        "value": 3.3
    },
    
    {
        "display": "3.4",
        "value": 3.4
    },
    
    {
        "display": "3.5",
        "value": 3.5
    },
    
    {
        "display": "3.6",
        "value": 3.6
    },
    
    {
        "display": "3.7",
        "value": 3.7
    },
    
    {
        "display": "3.8",
        "value": 3.8
    },
    
    {
        "display": "3.9",
        "value": 3.9
    },

{
    "display": "4",
    "value": 4
},

    {
        "display": "4.1",
        "value": 4.1
    },
    
    {
        "display": "4.2",
        "value": 4.2
    },
    
    {
        "display": "4.3",
        "value": 4.3
    },
    
    {
        "display": "4.4",
        "value": 4.4
    },
    
    {
        "display": "4.5",
        "value": 4.5
    },
    
    {
        "display": "4.6",
        "value": 4.6
    },
    
    {
        "display": "4.7",
        "value": 4.7
    },
    
    {
        "display": "4.8",
        "value": 4.8
    },
    
    {
        "display": "4.9",
        "value": 4.9
    },

{
    "display": "5",
    "value": 5
},

    {
        "display": "5.1",
        "value": 5.1
    },
    
    {
        "display": "5.2",
        "value": 5.2
    },
    
    {
        "display": "5.3",
        "value": 5.3
    },
    
    {
        "display": "5.4",
        "value": 5.4
    },
    
    {
        "display": "5.5",
        "value": 5.5
    },
    
    {
        "display": "5.6",
        "value": 5.6
    },
    
    {
        "display": "5.7",
        "value": 5.7
    },
    
    {
        "display": "5.8",
        "value": 5.8
    },
    
    {
        "display": "5.9",
        "value": 5.9
    },

{
    "display": "6",
    "value": 6
},

    {
        "display": "6.1",
        "value": 6.1
    },
    
    {
        "display": "6.2",
        "value": 6.2
    },
    
    {
        "display": "6.3",
        "value": 6.3
    },
    
    {
        "display": "6.4",
        "value": 6.4
    },
    
    {
        "display": "6.5",
        "value": 6.5
    },
    
    {
        "display": "6.6",
        "value": 6.6
    },
    
    {
        "display": "6.7",
        "value": 6.7
    },
    
    {
        "display": "6.8",
        "value": 6.8
    },
    
    {
        "display": "6.9",
        "value": 6.9
    },

{
    "display": "7",
    "value": 7
},

    {
        "display": "7.1",
        "value": 7.1
    },
    
    {
        "display": "7.2",
        "value": 7.2
    },
    
    {
        "display": "7.3",
        "value": 7.3
    },
    
    {
        "display": "7.4",
        "value": 7.4
    },
    
    {
        "display": "7.5",
        "value": 7.5
    },
    
    {
        "display": "7.6",
        "value": 7.6
    },
    
    {
        "display": "7.7",
        "value": 7.7
    },
    
    {
        "display": "7.8",
        "value": 7.8
    },
    
    {
        "display": "7.9",
        "value": 7.9
    },

{
    "display": "8",
    "value": 8
},

    {
        "display": "8.1",
        "value": 8.1
    },
    
    {
        "display": "8.2",
        "value": 8.2
    },
    
    {
        "display": "8.3",
        "value": 8.3
    },
    
    {
        "display": "8.4",
        "value": 8.4
    },
    
    {
        "display": "8.5",
        "value": 8.5
    },
    
    {
        "display": "8.6",
        "value": 8.6
    },
    
    {
        "display": "8.7",
        "value": 8.7
    },
    
    {
        "display": "8.8",
        "value": 8.8
    },
    
    {
        "display": "8.9",
        "value": 8.9
    },

{
    "display": "9",
    "value": 9
},

    {
        "display": "9.1",
        "value": 9.1
    },
    
    {
        "display": "9.2",
        "value": 9.2
    },
    
    {
        "display": "9.3",
        "value": 9.3
    },
    
    {
        "display": "9.4",
        "value": 9.4
    },
    
    {
        "display": "9.5",
        "value": 9.5
    },
    
    {
        "display": "9.6",
        "value": 9.6
    },
    
    {
        "display": "9.7",
        "value": 9.7
    },
    
    {
        "display": "9.8",
        "value": 9.8
    },
    
    {
        "display": "9.9",
        "value": 9.9
    },

{
    "display": "10",
    "value": 10
},

    {
        "display": "10.1",
        "value": 10.1
    },
    
    {
        "display": "10.2",
        "value": 10.2
    },
    
    {
        "display": "10.3",
        "value": 10.3
    },
    
    {
        "display": "10.4",
        "value": 10.4
    },
    
    {
        "display": "10.5",
        "value": 10.5
    },
    
    {
        "display": "10.6",
        "value": 10.6
    },
    
    {
        "display": "10.7",
        "value": 10.7
    },
    
    {
        "display": "10.8",
        "value": 10.8
    },
    
    {
        "display": "10.9",
        "value": 10.9
    },

{
    "display": "11",
    "value": 11
},

    {
        "display": "11.1",
        "value": 11.1
    },
    
    {
        "display": "11.2",
        "value": 11.2
    },
    
    {
        "display": "11.3",
        "value": 11.3
    },
    
    {
        "display": "11.4",
        "value": 11.4
    },
    
    {
        "display": "11.5",
        "value": 11.5
    },
    
    {
        "display": "11.6",
        "value": 11.6
    },
    
    {
        "display": "11.7",
        "value": 11.7
    },
    
    {
        "display": "11.8",
        "value": 11.8
    },
    
    {
        "display": "11.9",
        "value": 11.9
    },

{
    "display": "12",
    "value": 12
},

    {
        "display": "12.1",
        "value": 12.1
    },
    
    {
        "display": "12.2",
        "value": 12.2
    },
    
    {
        "display": "12.3",
        "value": 12.3
    },
    
    {
        "display": "12.4",
        "value": 12.4
    },
    
    {
        "display": "12.5",
        "value": 12.5
    },
    
    {
        "display": "12.6",
        "value": 12.6
    },
    
    {
        "display": "12.7",
        "value": 12.7
    },
    
    {
        "display": "12.8",
        "value": 12.8
    },
    
    {
        "display": "12.9",
        "value": 12.9
    },

{
    "display": "13",
    "value": 13
},

    {
        "display": "13.1",
        "value": 13.1
    },
    
    {
        "display": "13.2",
        "value": 13.2
    },
    
    {
        "display": "13.3",
        "value": 13.3
    },
    
    {
        "display": "13.4",
        "value": 13.4
    },
    
    {
        "display": "13.5",
        "value": 13.5
    },
    
    {
        "display": "13.6",
        "value": 13.6
    },
    
    {
        "display": "13.7",
        "value": 13.7
    },
    
    {
        "display": "13.8",
        "value": 13.8
    },
    
    {
        "display": "13.9",
        "value": 13.9
    },

{
    "display": "14",
    "value": 14
},

    {
        "display": "14.1",
        "value": 14.1
    },
    
    {
        "display": "14.2",
        "value": 14.2
    },
    
    {
        "display": "14.3",
        "value": 14.3
    },
    
    {
        "display": "14.4",
        "value": 14.4
    },
    
    {
        "display": "14.5",
        "value": 14.5
    },
    
    {
        "display": "14.6",
        "value": 14.6
    },
    
    {
        "display": "14.7",
        "value": 14.7
    },
    
    {
        "display": "14.8",
        "value": 14.8
    },
    
    {
        "display": "14.9",
        "value": 14.9
    },

{
    "display": "15",
    "value": 15
},

    {
        "display": "15.1",
        "value": 15.1
    },
    
    {
        "display": "15.2",
        "value": 15.2
    },
    
    {
        "display": "15.3",
        "value": 15.3
    },
    
    {
        "display": "15.4",
        "value": 15.4
    },
    
    {
        "display": "15.5",
        "value": 15.5
    },
    
    {
        "display": "15.6",
        "value": 15.6
    },
    
    {
        "display": "15.7",
        "value": 15.7
    },
    
    {
        "display": "15.8",
        "value": 15.8
    },
    
    {
        "display": "15.9",
        "value": 15.9
    },

{
    "display": "16",
    "value": 16
},

    {
        "display": "16.1",
        "value": 16.1
    },
    
    {
        "display": "16.2",
        "value": 16.2
    },
    
    {
        "display": "16.3",
        "value": 16.3
    },
    
    {
        "display": "16.4",
        "value": 16.4
    },
    
    {
        "display": "16.5",
        "value": 16.5
    },
    
    {
        "display": "16.6",
        "value": 16.6
    },
    
    {
        "display": "16.7",
        "value": 16.7
    },
    
    {
        "display": "16.8",
        "value": 16.8
    },
    
    {
        "display": "16.9",
        "value": 16.9
    },

{
    "display": "17",
    "value": 17
},

    {
        "display": "17.1",
        "value": 17.1
    },
    
    {
        "display": "17.2",
        "value": 17.2
    },
    
    {
        "display": "17.3",
        "value": 17.3
    },
    
    {
        "display": "17.4",
        "value": 17.4
    },
    
    {
        "display": "17.5",
        "value": 17.5
    },
    
    {
        "display": "17.6",
        "value": 17.6
    },
    
    {
        "display": "17.7",
        "value": 17.7
    },
    
    {
        "display": "17.8",
        "value": 17.8
    },
    
    {
        "display": "17.9",
        "value": 17.9
    },

{
    "display": "18",
    "value": 18
},

    {
        "display": "18.1",
        "value": 18.1
    },
    
    {
        "display": "18.2",
        "value": 18.2
    },
    
    {
        "display": "18.3",
        "value": 18.3
    },
    
    {
        "display": "18.4",
        "value": 18.4
    },
    
    {
        "display": "18.5",
        "value": 18.5
    },
    
    {
        "display": "18.6",
        "value": 18.6
    },
    
    {
        "display": "18.7",
        "value": 18.7
    },
    
    {
        "display": "18.8",
        "value": 18.8
    },
    
    {
        "display": "18.9",
        "value": 18.9
    },

{
    "display": "19",
    "value": 19
},

    {
        "display": "19.1",
        "value": 19.1
    },
    
    {
        "display": "19.2",
        "value": 19.2
    },
    
    {
        "display": "19.3",
        "value": 19.3
    },
    
    {
        "display": "19.4",
        "value": 19.4
    },
    
    {
        "display": "19.5",
        "value": 19.5
    },
    
    {
        "display": "19.6",
        "value": 19.6
    },
    
    {
        "display": "19.7",
        "value": 19.7
    },
    
    {
        "display": "19.8",
        "value": 19.8
    },
    
    {
        "display": "19.9",
        "value": 19.9
    },

{
    "display": "20",
    "value": 20
},

    {
        "display": "20.1",
        "value": 20.1
    },
    
    {
        "display": "20.2",
        "value": 20.2
    },
    
    {
        "display": "20.3",
        "value": 20.3
    },
    
    {
        "display": "20.4",
        "value": 20.4
    },
    
    {
        "display": "20.5",
        "value": 20.5
    },
    
    {
        "display": "20.6",
        "value": 20.6
    },
    
    {
        "display": "20.7",
        "value": 20.7
    },
    
    {
        "display": "20.8",
        "value": 20.8
    },
    
    {
        "display": "20.9",
        "value": 20.9
    },

{
    "display": "21",
    "value": 21
},

    {
        "display": "21.1",
        "value": 21.1
    },
    
    {
        "display": "21.2",
        "value": 21.2
    },
    
    {
        "display": "21.3",
        "value": 21.3
    },
    
    {
        "display": "21.4",
        "value": 21.4
    },
    
    {
        "display": "21.5",
        "value": 21.5
    },
    
    {
        "display": "21.6",
        "value": 21.6
    },
    
    {
        "display": "21.7",
        "value": 21.7
    },
    
    {
        "display": "21.8",
        "value": 21.8
    },
    
    {
        "display": "21.9",
        "value": 21.9
    },

{
    "display": "22",
    "value": 22
},

    {
        "display": "22.1",
        "value": 22.1
    },
    
    {
        "display": "22.2",
        "value": 22.2
    },
    
    {
        "display": "22.3",
        "value": 22.3
    },
    
    {
        "display": "22.4",
        "value": 22.4
    },
    
    {
        "display": "22.5",
        "value": 22.5
    },
    
    {
        "display": "22.6",
        "value": 22.6
    },
    
    {
        "display": "22.7",
        "value": 22.7
    },
    
    {
        "display": "22.8",
        "value": 22.8
    },
    
    {
        "display": "22.9",
        "value": 22.9
    },

{
    "display": "23",
    "value": 23
},

    {
        "display": "23.1",
        "value": 23.1
    },
    
    {
        "display": "23.2",
        "value": 23.2
    },
    
    {
        "display": "23.3",
        "value": 23.3
    },
    
    {
        "display": "23.4",
        "value": 23.4
    },
    
    {
        "display": "23.5",
        "value": 23.5
    },
    
    {
        "display": "23.6",
        "value": 23.6
    },
    
    {
        "display": "23.7",
        "value": 23.7
    },
    
    {
        "display": "23.8",
        "value": 23.8
    },
    
    {
        "display": "23.9",
        "value": 23.9
    },

{
    "display": "24",
    "value": 24
},

    {
        "display": "24.1",
        "value": 24.1
    },
    
    {
        "display": "24.2",
        "value": 24.2
    },
    
    {
        "display": "24.3",
        "value": 24.3
    },
    
    {
        "display": "24.4",
        "value": 24.4
    },
    
    {
        "display": "24.5",
        "value": 24.5
    },
    
    {
        "display": "24.6",
        "value": 24.6
    },
    
    {
        "display": "24.7",
        "value": 24.7
    },
    
    {
        "display": "24.8",
        "value": 24.8
    },
    
    {
        "display": "24.9",
        "value": 24.9
    },

{
    "display": "25",
    "value": 25
},

    {
        "display": "25.1",
        "value": 25.1
    },
    
    {
        "display": "25.2",
        "value": 25.2
    },
    
    {
        "display": "25.3",
        "value": 25.3
    },
    
    {
        "display": "25.4",
        "value": 25.4
    },
    
    {
        "display": "25.5",
        "value": 25.5
    },
    
    {
        "display": "25.6",
        "value": 25.6
    },
    
    {
        "display": "25.7",
        "value": 25.7
    },
    
    {
        "display": "25.8",
        "value": 25.8
    },
    
    {
        "display": "25.9",
        "value": 25.9
    },

{
    "display": "26",
    "value": 26
},

    {
        "display": "26.1",
        "value": 26.1
    },
    
    {
        "display": "26.2",
        "value": 26.2
    },
    
    {
        "display": "26.3",
        "value": 26.3
    },
    
    {
        "display": "26.4",
        "value": 26.4
    },
    
    {
        "display": "26.5",
        "value": 26.5
    },
    
    {
        "display": "26.6",
        "value": 26.6
    },
    
    {
        "display": "26.7",
        "value": 26.7
    },
    
    {
        "display": "26.8",
        "value": 26.8
    },
    
    {
        "display": "26.9",
        "value": 26.9
    },

{
    "display": "27",
    "value": 27
},

    {
        "display": "27.1",
        "value": 27.1
    },
    
    {
        "display": "27.2",
        "value": 27.2
    },
    
    {
        "display": "27.3",
        "value": 27.3
    },
    
    {
        "display": "27.4",
        "value": 27.4
    },
    
    {
        "display": "27.5",
        "value": 27.5
    },
    
    {
        "display": "27.6",
        "value": 27.6
    },
    
    {
        "display": "27.7",
        "value": 27.7
    },
    
    {
        "display": "27.8",
        "value": 27.8
    },
    
    {
        "display": "27.9",
        "value": 27.9
    },

{
    "display": "28",
    "value": 28
},

    {
        "display": "28.1",
        "value": 28.1
    },
    
    {
        "display": "28.2",
        "value": 28.2
    },
    
    {
        "display": "28.3",
        "value": 28.3
    },
    
    {
        "display": "28.4",
        "value": 28.4
    },
    
    {
        "display": "28.5",
        "value": 28.5
    },
    
    {
        "display": "28.6",
        "value": 28.6
    },
    
    {
        "display": "28.7",
        "value": 28.7
    },
    
    {
        "display": "28.8",
        "value": 28.8
    },
    
    {
        "display": "28.9",
        "value": 28.9
    },

{
    "display": "29",
    "value": 29
},

    {
        "display": "29.1",
        "value": 29.1
    },
    
    {
        "display": "29.2",
        "value": 29.2
    },
    
    {
        "display": "29.3",
        "value": 29.3
    },
    
    {
        "display": "29.4",
        "value": 29.4
    },
    
    {
        "display": "29.5",
        "value": 29.5
    },
    
    {
        "display": "29.6",
        "value": 29.6
    },
    
    {
        "display": "29.7",
        "value": 29.7
    },
    
    {
        "display": "29.8",
        "value": 29.8
    },
    
    {
        "display": "29.9",
        "value": 29.9
    },

{
    "display": "30",
    "value": 30
},

    {
        "display": "30.1",
        "value": 30.1
    },
    
    {
        "display": "30.2",
        "value": 30.2
    },
    
    {
        "display": "30.3",
        "value": 30.3
    },
    
    {
        "display": "30.4",
        "value": 30.4
    },
    
    {
        "display": "30.5",
        "value": 30.5
    },
    
    {
        "display": "30.6",
        "value": 30.6
    },
    
    {
        "display": "30.7",
        "value": 30.7
    },
    
    {
        "display": "30.8",
        "value": 30.8
    },
    
    {
        "display": "30.9",
        "value": 30.9
    },

{
    "display": "31",
    "value": 31
},

    {
        "display": "31.1",
        "value": 31.1
    },
    
    {
        "display": "31.2",
        "value": 31.2
    },
    
    {
        "display": "31.3",
        "value": 31.3
    },
    
    {
        "display": "31.4",
        "value": 31.4
    },
    
    {
        "display": "31.5",
        "value": 31.5
    },
    
    {
        "display": "31.6",
        "value": 31.6
    },
    
    {
        "display": "31.7",
        "value": 31.7
    },
    
    {
        "display": "31.8",
        "value": 31.8
    },
    
    {
        "display": "31.9",
        "value": 31.9
    },

{
    "display": "32",
    "value": 32
},

    {
        "display": "32.1",
        "value": 32.1
    },
    
    {
        "display": "32.2",
        "value": 32.2
    },
    
    {
        "display": "32.3",
        "value": 32.3
    },
    
    {
        "display": "32.4",
        "value": 32.4
    },
    
    {
        "display": "32.5",
        "value": 32.5
    },
    
    {
        "display": "32.6",
        "value": 32.6
    },
    
    {
        "display": "32.7",
        "value": 32.7
    },
    
    {
        "display": "32.8",
        "value": 32.8
    },
    
    {
        "display": "32.9",
        "value": 32.9
    },

{
    "display": "33",
    "value": 33
},

    {
        "display": "33.1",
        "value": 33.1
    },
    
    {
        "display": "33.2",
        "value": 33.2
    },
    
    {
        "display": "33.3",
        "value": 33.3
    },
    
    {
        "display": "33.4",
        "value": 33.4
    },
    
    {
        "display": "33.5",
        "value": 33.5
    },
    
    {
        "display": "33.6",
        "value": 33.6
    },
    
    {
        "display": "33.7",
        "value": 33.7
    },
    
    {
        "display": "33.8",
        "value": 33.8
    },
    
    {
        "display": "33.9",
        "value": 33.9
    },

{
    "display": "34",
    "value": 34
},

    {
        "display": "34.1",
        "value": 34.1
    },
    
    {
        "display": "34.2",
        "value": 34.2
    },
    
    {
        "display": "34.3",
        "value": 34.3
    },
    
    {
        "display": "34.4",
        "value": 34.4
    },
    
    {
        "display": "34.5",
        "value": 34.5
    },
    
    {
        "display": "34.6",
        "value": 34.6
    },
    
    {
        "display": "34.7",
        "value": 34.7
    },
    
    {
        "display": "34.8",
        "value": 34.8
    },
    
    {
        "display": "34.9",
        "value": 34.9
    },

{
    "display": "35",
    "value": 35
},

    {
        "display": "35.1",
        "value": 35.1
    },
    
    {
        "display": "35.2",
        "value": 35.2
    },
    
    {
        "display": "35.3",
        "value": 35.3
    },
    
    {
        "display": "35.4",
        "value": 35.4
    },
    
    {
        "display": "35.5",
        "value": 35.5
    },
    
    {
        "display": "35.6",
        "value": 35.6
    },
    
    {
        "display": "35.7",
        "value": 35.7
    },
    
    {
        "display": "35.8",
        "value": 35.8
    },
    
    {
        "display": "35.9",
        "value": 35.9
    },

{
    "display": "36",
    "value": 36
},

    {
        "display": "36.1",
        "value": 36.1
    },
    
    {
        "display": "36.2",
        "value": 36.2
    },
    
    {
        "display": "36.3",
        "value": 36.3
    },
    
    {
        "display": "36.4",
        "value": 36.4
    },
    
    {
        "display": "36.5",
        "value": 36.5
    },
    
    {
        "display": "36.6",
        "value": 36.6
    },
    
    {
        "display": "36.7",
        "value": 36.7
    },
    
    {
        "display": "36.8",
        "value": 36.8
    },
    
    {
        "display": "36.9",
        "value": 36.9
    },

{
    "display": "37",
    "value": 37
},

    {
        "display": "37.1",
        "value": 37.1
    },
    
    {
        "display": "37.2",
        "value": 37.2
    },
    
    {
        "display": "37.3",
        "value": 37.3
    },
    
    {
        "display": "37.4",
        "value": 37.4
    },
    
    {
        "display": "37.5",
        "value": 37.5
    },
    
    {
        "display": "37.6",
        "value": 37.6
    },
    
    {
        "display": "37.7",
        "value": 37.7
    },
    
    {
        "display": "37.8",
        "value": 37.8
    },
    
    {
        "display": "37.9",
        "value": 37.9
    },

{
    "display": "38",
    "value": 38
},

    {
        "display": "38.1",
        "value": 38.1
    },
    
    {
        "display": "38.2",
        "value": 38.2
    },
    
    {
        "display": "38.3",
        "value": 38.3
    },
    
    {
        "display": "38.4",
        "value": 38.4
    },
    
    {
        "display": "38.5",
        "value": 38.5
    },
    
    {
        "display": "38.6",
        "value": 38.6
    },
    
    {
        "display": "38.7",
        "value": 38.7
    },
    
    {
        "display": "38.8",
        "value": 38.8
    },
    
    {
        "display": "38.9",
        "value": 38.9
    },

{
    "display": "39",
    "value": 39
},

    {
        "display": "39.1",
        "value": 39.1
    },
    
    {
        "display": "39.2",
        "value": 39.2
    },
    
    {
        "display": "39.3",
        "value": 39.3
    },
    
    {
        "display": "39.4",
        "value": 39.4
    },
    
    {
        "display": "39.5",
        "value": 39.5
    },
    
    {
        "display": "39.6",
        "value": 39.6
    },
    
    {
        "display": "39.7",
        "value": 39.7
    },
    
    {
        "display": "39.8",
        "value": 39.8
    },
    
    {
        "display": "39.9",
        "value": 39.9
    },

{
    "display": "40",
    "value": 40
},

    {
        "display": "40.1",
        "value": 40.1
    },
    
    {
        "display": "40.2",
        "value": 40.2
    },
    
    {
        "display": "40.3",
        "value": 40.3
    },
    
    {
        "display": "40.4",
        "value": 40.4
    },
    
    {
        "display": "40.5",
        "value": 40.5
    },
    
    {
        "display": "40.6",
        "value": 40.6
    },
    
    {
        "display": "40.7",
        "value": 40.7
    },
    
    {
        "display": "40.8",
        "value": 40.8
    },
    
    {
        "display": "40.9",
        "value": 40.9
    },

{
    "display": "41",
    "value": 41
},

    {
        "display": "41.1",
        "value": 41.1
    },
    
    {
        "display": "41.2",
        "value": 41.2
    },
    
    {
        "display": "41.3",
        "value": 41.3
    },
    
    {
        "display": "41.4",
        "value": 41.4
    },
    
    {
        "display": "41.5",
        "value": 41.5
    },
    
    {
        "display": "41.6",
        "value": 41.6
    },
    
    {
        "display": "41.7",
        "value": 41.7
    },
    
    {
        "display": "41.8",
        "value": 41.8
    },
    
    {
        "display": "41.9",
        "value": 41.9
    },

{
    "display": "42",
    "value": 42
},

    {
        "display": "42.1",
        "value": 42.1
    },
    
    {
        "display": "42.2",
        "value": 42.2
    },
    
    {
        "display": "42.3",
        "value": 42.3
    },
    
    {
        "display": "42.4",
        "value": 42.4
    },
    
    {
        "display": "42.5",
        "value": 42.5
    },
    
    {
        "display": "42.6",
        "value": 42.6
    },
    
    {
        "display": "42.7",
        "value": 42.7
    },
    
    {
        "display": "42.8",
        "value": 42.8
    },
    
    {
        "display": "42.9",
        "value": 42.9
    },

{
    "display": "43",
    "value": 43
},

    {
        "display": "43.1",
        "value": 43.1
    },
    
    {
        "display": "43.2",
        "value": 43.2
    },
    
    {
        "display": "43.3",
        "value": 43.3
    },
    
    {
        "display": "43.4",
        "value": 43.4
    },
    
    {
        "display": "43.5",
        "value": 43.5
    },
    
    {
        "display": "43.6",
        "value": 43.6
    },
    
    {
        "display": "43.7",
        "value": 43.7
    },
    
    {
        "display": "43.8",
        "value": 43.8
    },
    
    {
        "display": "43.9",
        "value": 43.9
    },

{
    "display": "44",
    "value": 44
},

    {
        "display": "44.1",
        "value": 44.1
    },
    
    {
        "display": "44.2",
        "value": 44.2
    },
    
    {
        "display": "44.3",
        "value": 44.3
    },
    
    {
        "display": "44.4",
        "value": 44.4
    },
    
    {
        "display": "44.5",
        "value": 44.5
    },
    
    {
        "display": "44.6",
        "value": 44.6
    },
    
    {
        "display": "44.7",
        "value": 44.7
    },
    
    {
        "display": "44.8",
        "value": 44.8
    },
    
    {
        "display": "44.9",
        "value": 44.9
    },

{
    "display": "45",
    "value": 45
},

    {
        "display": "45.1",
        "value": 45.1
    },
    
    {
        "display": "45.2",
        "value": 45.2
    },
    
    {
        "display": "45.3",
        "value": 45.3
    },
    
    {
        "display": "45.4",
        "value": 45.4
    },
    
    {
        "display": "45.5",
        "value": 45.5
    },
    
    {
        "display": "45.6",
        "value": 45.6
    },
    
    {
        "display": "45.7",
        "value": 45.7
    },
    
    {
        "display": "45.8",
        "value": 45.8
    },
    
    {
        "display": "45.9",
        "value": 45.9
    },

{
    "display": "46",
    "value": 46
},

    {
        "display": "46.1",
        "value": 46.1
    },
    
    {
        "display": "46.2",
        "value": 46.2
    },
    
    {
        "display": "46.3",
        "value": 46.3
    },
    
    {
        "display": "46.4",
        "value": 46.4
    },
    
    {
        "display": "46.5",
        "value": 46.5
    },
    
    {
        "display": "46.6",
        "value": 46.6
    },
    
    {
        "display": "46.7",
        "value": 46.7
    },
    
    {
        "display": "46.8",
        "value": 46.8
    },
    
    {
        "display": "46.9",
        "value": 46.9
    },

{
    "display": "47",
    "value": 47
},

    {
        "display": "47.1",
        "value": 47.1
    },
    
    {
        "display": "47.2",
        "value": 47.2
    },
    
    {
        "display": "47.3",
        "value": 47.3
    },
    
    {
        "display": "47.4",
        "value": 47.4
    },
    
    {
        "display": "47.5",
        "value": 47.5
    },
    
    {
        "display": "47.6",
        "value": 47.6
    },
    
    {
        "display": "47.7",
        "value": 47.7
    },
    
    {
        "display": "47.8",
        "value": 47.8
    },
    
    {
        "display": "47.9",
        "value": 47.9
    },

{
    "display": "48",
    "value": 48
},

    {
        "display": "48.1",
        "value": 48.1
    },
    
    {
        "display": "48.2",
        "value": 48.2
    },
    
    {
        "display": "48.3",
        "value": 48.3
    },
    
    {
        "display": "48.4",
        "value": 48.4
    },
    
    {
        "display": "48.5",
        "value": 48.5
    },
    
    {
        "display": "48.6",
        "value": 48.6
    },
    
    {
        "display": "48.7",
        "value": 48.7
    },
    
    {
        "display": "48.8",
        "value": 48.8
    },
    
    {
        "display": "48.9",
        "value": 48.9
    },

{
    "display": "49",
    "value": 49
},

    {
        "display": "49.1",
        "value": 49.1
    },
    
    {
        "display": "49.2",
        "value": 49.2
    },
    
    {
        "display": "49.3",
        "value": 49.3
    },
    
    {
        "display": "49.4",
        "value": 49.4
    },
    
    {
        "display": "49.5",
        "value": 49.5
    },
    
    {
        "display": "49.6",
        "value": 49.6
    },
    
    {
        "display": "49.7",
        "value": 49.7
    },
    
    {
        "display": "49.8",
        "value": 49.8
    },
    
    {
        "display": "49.9",
        "value": 49.9
    },

{
    "display": "50",
    "value": 50
},

    {
        "display": "50.1",
        "value": 50.1
    },
    
    {
        "display": "50.2",
        "value": 50.2
    },
    
    {
        "display": "50.3",
        "value": 50.3
    },
    
    {
        "display": "50.4",
        "value": 50.4
    },
    
    {
        "display": "50.5",
        "value": 50.5
    },
    
    {
        "display": "50.6",
        "value": 50.6
    },
    
    {
        "display": "50.7",
        "value": 50.7
    },
    
    {
        "display": "50.8",
        "value": 50.8
    },
    
    {
        "display": "50.9",
        "value": 50.9
    },

{
    "display": "51",
    "value": 51
},

    {
        "display": "51.1",
        "value": 51.1
    },
    
    {
        "display": "51.2",
        "value": 51.2
    },
    
    {
        "display": "51.3",
        "value": 51.3
    },
    
    {
        "display": "51.4",
        "value": 51.4
    },
    
    {
        "display": "51.5",
        "value": 51.5
    },
    
    {
        "display": "51.6",
        "value": 51.6
    },
    
    {
        "display": "51.7",
        "value": 51.7
    },
    
    {
        "display": "51.8",
        "value": 51.8
    },
    
    {
        "display": "51.9",
        "value": 51.9
    },

{
    "display": "52",
    "value": 52
},

    {
        "display": "52.1",
        "value": 52.1
    },
    
    {
        "display": "52.2",
        "value": 52.2
    },
    
    {
        "display": "52.3",
        "value": 52.3
    },
    
    {
        "display": "52.4",
        "value": 52.4
    },
    
    {
        "display": "52.5",
        "value": 52.5
    },
    
    {
        "display": "52.6",
        "value": 52.6
    },
    
    {
        "display": "52.7",
        "value": 52.7
    },
    
    {
        "display": "52.8",
        "value": 52.8
    },
    
    {
        "display": "52.9",
        "value": 52.9
    },

{
    "display": "53",
    "value": 53
},

    {
        "display": "53.1",
        "value": 53.1
    },
    
    {
        "display": "53.2",
        "value": 53.2
    },
    
    {
        "display": "53.3",
        "value": 53.3
    },
    
    {
        "display": "53.4",
        "value": 53.4
    },
    
    {
        "display": "53.5",
        "value": 53.5
    },
    
    {
        "display": "53.6",
        "value": 53.6
    },
    
    {
        "display": "53.7",
        "value": 53.7
    },
    
    {
        "display": "53.8",
        "value": 53.8
    },
    
    {
        "display": "53.9",
        "value": 53.9
    },

{
    "display": "54",
    "value": 54
},

    {
        "display": "54.1",
        "value": 54.1
    },
    
    {
        "display": "54.2",
        "value": 54.2
    },
    
    {
        "display": "54.3",
        "value": 54.3
    },
    
    {
        "display": "54.4",
        "value": 54.4
    },
    
    {
        "display": "54.5",
        "value": 54.5
    },
    
    {
        "display": "54.6",
        "value": 54.6
    },
    
    {
        "display": "54.7",
        "value": 54.7
    },
    
    {
        "display": "54.8",
        "value": 54.8
    },
    
    {
        "display": "54.9",
        "value": 54.9
    },

{
    "display": "55",
    "value": 55
},

    {
        "display": "55.1",
        "value": 55.1
    },
    
    {
        "display": "55.2",
        "value": 55.2
    },
    
    {
        "display": "55.3",
        "value": 55.3
    },
    
    {
        "display": "55.4",
        "value": 55.4
    },
    
    {
        "display": "55.5",
        "value": 55.5
    },
    
    {
        "display": "55.6",
        "value": 55.6
    },
    
    {
        "display": "55.7",
        "value": 55.7
    },
    
    {
        "display": "55.8",
        "value": 55.8
    },
    
    {
        "display": "55.9",
        "value": 55.9
    },

{
    "display": "56",
    "value": 56
},

    {
        "display": "56.1",
        "value": 56.1
    },
    
    {
        "display": "56.2",
        "value": 56.2
    },
    
    {
        "display": "56.3",
        "value": 56.3
    },
    
    {
        "display": "56.4",
        "value": 56.4
    },
    
    {
        "display": "56.5",
        "value": 56.5
    },
    
    {
        "display": "56.6",
        "value": 56.6
    },
    
    {
        "display": "56.7",
        "value": 56.7
    },
    
    {
        "display": "56.8",
        "value": 56.8
    },
    
    {
        "display": "56.9",
        "value": 56.9
    },

{
    "display": "57",
    "value": 57
},

    {
        "display": "57.1",
        "value": 57.1
    },
    
    {
        "display": "57.2",
        "value": 57.2
    },
    
    {
        "display": "57.3",
        "value": 57.3
    },
    
    {
        "display": "57.4",
        "value": 57.4
    },
    
    {
        "display": "57.5",
        "value": 57.5
    },
    
    {
        "display": "57.6",
        "value": 57.6
    },
    
    {
        "display": "57.7",
        "value": 57.7
    },
    
    {
        "display": "57.8",
        "value": 57.8
    },
    
    {
        "display": "57.9",
        "value": 57.9
    },

{
    "display": "58",
    "value": 58
},

    {
        "display": "58.1",
        "value": 58.1
    },
    
    {
        "display": "58.2",
        "value": 58.2
    },
    
    {
        "display": "58.3",
        "value": 58.3
    },
    
    {
        "display": "58.4",
        "value": 58.4
    },
    
    {
        "display": "58.5",
        "value": 58.5
    },
    
    {
        "display": "58.6",
        "value": 58.6
    },
    
    {
        "display": "58.7",
        "value": 58.7
    },
    
    {
        "display": "58.8",
        "value": 58.8
    },
    
    {
        "display": "58.9",
        "value": 58.9
    },

{
    "display": "59",
    "value": 59
},

    {
        "display": "59.1",
        "value": 59.1
    },
    
    {
        "display": "59.2",
        "value": 59.2
    },
    
    {
        "display": "59.3",
        "value": 59.3
    },
    
    {
        "display": "59.4",
        "value": 59.4
    },
    
    {
        "display": "59.5",
        "value": 59.5
    },
    
    {
        "display": "59.6",
        "value": 59.6
    },
    
    {
        "display": "59.7",
        "value": 59.7
    },
    
    {
        "display": "59.8",
        "value": 59.8
    },
    
    {
        "display": "59.9",
        "value": 59.9
    },

{
    "display": "60",
    "value": 60
},

    {
        "display": "60.1",
        "value": 60.1
    },
    
    {
        "display": "60.2",
        "value": 60.2
    },
    
    {
        "display": "60.3",
        "value": 60.3
    },
    
    {
        "display": "60.4",
        "value": 60.4
    },
    
    {
        "display": "60.5",
        "value": 60.5
    },
    
    {
        "display": "60.6",
        "value": 60.6
    },
    
    {
        "display": "60.7",
        "value": 60.7
    },
    
    {
        "display": "60.8",
        "value": 60.8
    },
    
    {
        "display": "60.9",
        "value": 60.9
    },

{
    "display": "61",
    "value": 61
},

    {
        "display": "61.1",
        "value": 61.1
    },
    
    {
        "display": "61.2",
        "value": 61.2
    },
    
    {
        "display": "61.3",
        "value": 61.3
    },
    
    {
        "display": "61.4",
        "value": 61.4
    },
    
    {
        "display": "61.5",
        "value": 61.5
    },
    
    {
        "display": "61.6",
        "value": 61.6
    },
    
    {
        "display": "61.7",
        "value": 61.7
    },
    
    {
        "display": "61.8",
        "value": 61.8
    },
    
    {
        "display": "61.9",
        "value": 61.9
    },

{
    "display": "62",
    "value": 62
},

    {
        "display": "62.1",
        "value": 62.1
    },
    
    {
        "display": "62.2",
        "value": 62.2
    },
    
    {
        "display": "62.3",
        "value": 62.3
    },
    
    {
        "display": "62.4",
        "value": 62.4
    },
    
    {
        "display": "62.5",
        "value": 62.5
    },
    
    {
        "display": "62.6",
        "value": 62.6
    },
    
    {
        "display": "62.7",
        "value": 62.7
    },
    
    {
        "display": "62.8",
        "value": 62.8
    },
    
    {
        "display": "62.9",
        "value": 62.9
    },

{
    "display": "63",
    "value": 63
},

    {
        "display": "63.1",
        "value": 63.1
    },
    
    {
        "display": "63.2",
        "value": 63.2
    },
    
    {
        "display": "63.3",
        "value": 63.3
    },
    
    {
        "display": "63.4",
        "value": 63.4
    },
    
    {
        "display": "63.5",
        "value": 63.5
    },
    
    {
        "display": "63.6",
        "value": 63.6
    },
    
    {
        "display": "63.7",
        "value": 63.7
    },
    
    {
        "display": "63.8",
        "value": 63.8
    },
    
    {
        "display": "63.9",
        "value": 63.9
    },

{
    "display": "64",
    "value": 64
},

    {
        "display": "64.1",
        "value": 64.1
    },
    
    {
        "display": "64.2",
        "value": 64.2
    },
    
    {
        "display": "64.3",
        "value": 64.3
    },
    
    {
        "display": "64.4",
        "value": 64.4
    },
    
    {
        "display": "64.5",
        "value": 64.5
    },
    
    {
        "display": "64.6",
        "value": 64.6
    },
    
    {
        "display": "64.7",
        "value": 64.7
    },
    
    {
        "display": "64.8",
        "value": 64.8
    },
    
    {
        "display": "64.9",
        "value": 64.9
    },

{
    "display": "65",
    "value": 65
},

    {
        "display": "65.1",
        "value": 65.1
    },
    
    {
        "display": "65.2",
        "value": 65.2
    },
    
    {
        "display": "65.3",
        "value": 65.3
    },
    
    {
        "display": "65.4",
        "value": 65.4
    },
    
    {
        "display": "65.5",
        "value": 65.5
    },
    
    {
        "display": "65.6",
        "value": 65.6
    },
    
    {
        "display": "65.7",
        "value": 65.7
    },
    
    {
        "display": "65.8",
        "value": 65.8
    },
    
    {
        "display": "65.9",
        "value": 65.9
    },

{
    "display": "66",
    "value": 66
},

    {
        "display": "66.1",
        "value": 66.1
    },
    
    {
        "display": "66.2",
        "value": 66.2
    },
    
    {
        "display": "66.3",
        "value": 66.3
    },
    
    {
        "display": "66.4",
        "value": 66.4
    },
    
    {
        "display": "66.5",
        "value": 66.5
    },
    
    {
        "display": "66.6",
        "value": 66.6
    },
    
    {
        "display": "66.7",
        "value": 66.7
    },
    
    {
        "display": "66.8",
        "value": 66.8
    },
    
    {
        "display": "66.9",
        "value": 66.9
    },

{
    "display": "67",
    "value": 67
},

    {
        "display": "67.1",
        "value": 67.1
    },
    
    {
        "display": "67.2",
        "value": 67.2
    },
    
    {
        "display": "67.3",
        "value": 67.3
    },
    
    {
        "display": "67.4",
        "value": 67.4
    },
    
    {
        "display": "67.5",
        "value": 67.5
    },
    
    {
        "display": "67.6",
        "value": 67.6
    },
    
    {
        "display": "67.7",
        "value": 67.7
    },
    
    {
        "display": "67.8",
        "value": 67.8
    },
    
    {
        "display": "67.9",
        "value": 67.9
    },

{
    "display": "68",
    "value": 68
},

    {
        "display": "68.1",
        "value": 68.1
    },
    
    {
        "display": "68.2",
        "value": 68.2
    },
    
    {
        "display": "68.3",
        "value": 68.3
    },
    
    {
        "display": "68.4",
        "value": 68.4
    },
    
    {
        "display": "68.5",
        "value": 68.5
    },
    
    {
        "display": "68.6",
        "value": 68.6
    },
    
    {
        "display": "68.7",
        "value": 68.7
    },
    
    {
        "display": "68.8",
        "value": 68.8
    },
    
    {
        "display": "68.9",
        "value": 68.9
    },

{
    "display": "69",
    "value": 69
},

    {
        "display": "69.1",
        "value": 69.1
    },
    
    {
        "display": "69.2",
        "value": 69.2
    },
    
    {
        "display": "69.3",
        "value": 69.3
    },
    
    {
        "display": "69.4",
        "value": 69.4
    },
    
    {
        "display": "69.5",
        "value": 69.5
    },
    
    {
        "display": "69.6",
        "value": 69.6
    },
    
    {
        "display": "69.7",
        "value": 69.7
    },
    
    {
        "display": "69.8",
        "value": 69.8
    },
    
    {
        "display": "69.9",
        "value": 69.9
    },

{
    "display": "70",
    "value": 70
},

    {
        "display": "70.1",
        "value": 70.1
    },
    
    {
        "display": "70.2",
        "value": 70.2
    },
    
    {
        "display": "70.3",
        "value": 70.3
    },
    
    {
        "display": "70.4",
        "value": 70.4
    },
    
    {
        "display": "70.5",
        "value": 70.5
    },
    
    {
        "display": "70.6",
        "value": 70.6
    },
    
    {
        "display": "70.7",
        "value": 70.7
    },
    
    {
        "display": "70.8",
        "value": 70.8
    },
    
    {
        "display": "70.9",
        "value": 70.9
    },

{
    "display": "71",
    "value": 71
},

    {
        "display": "71.1",
        "value": 71.1
    },
    
    {
        "display": "71.2",
        "value": 71.2
    },
    
    {
        "display": "71.3",
        "value": 71.3
    },
    
    {
        "display": "71.4",
        "value": 71.4
    },
    
    {
        "display": "71.5",
        "value": 71.5
    },
    
    {
        "display": "71.6",
        "value": 71.6
    },
    
    {
        "display": "71.7",
        "value": 71.7
    },
    
    {
        "display": "71.8",
        "value": 71.8
    },
    
    {
        "display": "71.9",
        "value": 71.9
    },

{
    "display": "72",
    "value": 72
},

    {
        "display": "72.1",
        "value": 72.1
    },
    
    {
        "display": "72.2",
        "value": 72.2
    },
    
    {
        "display": "72.3",
        "value": 72.3
    },
    
    {
        "display": "72.4",
        "value": 72.4
    },
    
    {
        "display": "72.5",
        "value": 72.5
    },
    
    {
        "display": "72.6",
        "value": 72.6
    },
    
    {
        "display": "72.7",
        "value": 72.7
    },
    
    {
        "display": "72.8",
        "value": 72.8
    },
    
    {
        "display": "72.9",
        "value": 72.9
    },

{
    "display": "73",
    "value": 73
},

    {
        "display": "73.1",
        "value": 73.1
    },
    
    {
        "display": "73.2",
        "value": 73.2
    },
    
    {
        "display": "73.3",
        "value": 73.3
    },
    
    {
        "display": "73.4",
        "value": 73.4
    },
    
    {
        "display": "73.5",
        "value": 73.5
    },
    
    {
        "display": "73.6",
        "value": 73.6
    },
    
    {
        "display": "73.7",
        "value": 73.7
    },
    
    {
        "display": "73.8",
        "value": 73.8
    },
    
    {
        "display": "73.9",
        "value": 73.9
    },

{
    "display": "74",
    "value": 74
},

    {
        "display": "74.1",
        "value": 74.1
    },
    
    {
        "display": "74.2",
        "value": 74.2
    },
    
    {
        "display": "74.3",
        "value": 74.3
    },
    
    {
        "display": "74.4",
        "value": 74.4
    },
    
    {
        "display": "74.5",
        "value": 74.5
    },
    
    {
        "display": "74.6",
        "value": 74.6
    },
    
    {
        "display": "74.7",
        "value": 74.7
    },
    
    {
        "display": "74.8",
        "value": 74.8
    },
    
    {
        "display": "74.9",
        "value": 74.9
    },

{
    "display": "75",
    "value": 75
},

    {
        "display": "75.1",
        "value": 75.1
    },
    
    {
        "display": "75.2",
        "value": 75.2
    },
    
    {
        "display": "75.3",
        "value": 75.3
    },
    
    {
        "display": "75.4",
        "value": 75.4
    },
    
    {
        "display": "75.5",
        "value": 75.5
    },
    
    {
        "display": "75.6",
        "value": 75.6
    },
    
    {
        "display": "75.7",
        "value": 75.7
    },
    
    {
        "display": "75.8",
        "value": 75.8
    },
    
    {
        "display": "75.9",
        "value": 75.9
    },

{
    "display": "76",
    "value": 76
},

    {
        "display": "76.1",
        "value": 76.1
    },
    
    {
        "display": "76.2",
        "value": 76.2
    },
    
    {
        "display": "76.3",
        "value": 76.3
    },
    
    {
        "display": "76.4",
        "value": 76.4
    },
    
    {
        "display": "76.5",
        "value": 76.5
    },
    
    {
        "display": "76.6",
        "value": 76.6
    },
    
    {
        "display": "76.7",
        "value": 76.7
    },
    
    {
        "display": "76.8",
        "value": 76.8
    },
    
    {
        "display": "76.9",
        "value": 76.9
    },

{
    "display": "77",
    "value": 77
},

    {
        "display": "77.1",
        "value": 77.1
    },
    
    {
        "display": "77.2",
        "value": 77.2
    },
    
    {
        "display": "77.3",
        "value": 77.3
    },
    
    {
        "display": "77.4",
        "value": 77.4
    },
    
    {
        "display": "77.5",
        "value": 77.5
    },
    
    {
        "display": "77.6",
        "value": 77.6
    },
    
    {
        "display": "77.7",
        "value": 77.7
    },
    
    {
        "display": "77.8",
        "value": 77.8
    },
    
    {
        "display": "77.9",
        "value": 77.9
    },

{
    "display": "78",
    "value": 78
},

    {
        "display": "78.1",
        "value": 78.1
    },
    
    {
        "display": "78.2",
        "value": 78.2
    },
    
    {
        "display": "78.3",
        "value": 78.3
    },
    
    {
        "display": "78.4",
        "value": 78.4
    },
    
    {
        "display": "78.5",
        "value": 78.5
    },
    
    {
        "display": "78.6",
        "value": 78.6
    },
    
    {
        "display": "78.7",
        "value": 78.7
    },
    
    {
        "display": "78.8",
        "value": 78.8
    },
    
    {
        "display": "78.9",
        "value": 78.9
    },

{
    "display": "79",
    "value": 79
},

    {
        "display": "79.1",
        "value": 79.1
    },
    
    {
        "display": "79.2",
        "value": 79.2
    },
    
    {
        "display": "79.3",
        "value": 79.3
    },
    
    {
        "display": "79.4",
        "value": 79.4
    },
    
    {
        "display": "79.5",
        "value": 79.5
    },
    
    {
        "display": "79.6",
        "value": 79.6
    },
    
    {
        "display": "79.7",
        "value": 79.7
    },
    
    {
        "display": "79.8",
        "value": 79.8
    },
    
    {
        "display": "79.9",
        "value": 79.9
    },

{
    "display": "80",
    "value": 80
},

    {
        "display": "80.1",
        "value": 80.1
    },
    
    {
        "display": "80.2",
        "value": 80.2
    },
    
    {
        "display": "80.3",
        "value": 80.3
    },
    
    {
        "display": "80.4",
        "value": 80.4
    },
    
    {
        "display": "80.5",
        "value": 80.5
    },
    
    {
        "display": "80.6",
        "value": 80.6
    },
    
    {
        "display": "80.7",
        "value": 80.7
    },
    
    {
        "display": "80.8",
        "value": 80.8
    },
    
    {
        "display": "80.9",
        "value": 80.9
    },

{
    "display": "81",
    "value": 81
},

    {
        "display": "81.1",
        "value": 81.1
    },
    
    {
        "display": "81.2",
        "value": 81.2
    },
    
    {
        "display": "81.3",
        "value": 81.3
    },
    
    {
        "display": "81.4",
        "value": 81.4
    },
    
    {
        "display": "81.5",
        "value": 81.5
    },
    
    {
        "display": "81.6",
        "value": 81.6
    },
    
    {
        "display": "81.7",
        "value": 81.7
    },
    
    {
        "display": "81.8",
        "value": 81.8
    },
    
    {
        "display": "81.9",
        "value": 81.9
    },

{
    "display": "82",
    "value": 82
},

    {
        "display": "82.1",
        "value": 82.1
    },
    
    {
        "display": "82.2",
        "value": 82.2
    },
    
    {
        "display": "82.3",
        "value": 82.3
    },
    
    {
        "display": "82.4",
        "value": 82.4
    },
    
    {
        "display": "82.5",
        "value": 82.5
    },
    
    {
        "display": "82.6",
        "value": 82.6
    },
    
    {
        "display": "82.7",
        "value": 82.7
    },
    
    {
        "display": "82.8",
        "value": 82.8
    },
    
    {
        "display": "82.9",
        "value": 82.9
    },

{
    "display": "83",
    "value": 83
},

    {
        "display": "83.1",
        "value": 83.1
    },
    
    {
        "display": "83.2",
        "value": 83.2
    },
    
    {
        "display": "83.3",
        "value": 83.3
    },
    
    {
        "display": "83.4",
        "value": 83.4
    },
    
    {
        "display": "83.5",
        "value": 83.5
    },
    
    {
        "display": "83.6",
        "value": 83.6
    },
    
    {
        "display": "83.7",
        "value": 83.7
    },
    
    {
        "display": "83.8",
        "value": 83.8
    },
    
    {
        "display": "83.9",
        "value": 83.9
    },

{
    "display": "84",
    "value": 84
},

    {
        "display": "84.1",
        "value": 84.1
    },
    
    {
        "display": "84.2",
        "value": 84.2
    },
    
    {
        "display": "84.3",
        "value": 84.3
    },
    
    {
        "display": "84.4",
        "value": 84.4
    },
    
    {
        "display": "84.5",
        "value": 84.5
    },
    
    {
        "display": "84.6",
        "value": 84.6
    },
    
    {
        "display": "84.7",
        "value": 84.7
    },
    
    {
        "display": "84.8",
        "value": 84.8
    },
    
    {
        "display": "84.9",
        "value": 84.9
    },

{
    "display": "85",
    "value": 85
},

    {
        "display": "85.1",
        "value": 85.1
    },
    
    {
        "display": "85.2",
        "value": 85.2
    },
    
    {
        "display": "85.3",
        "value": 85.3
    },
    
    {
        "display": "85.4",
        "value": 85.4
    },
    
    {
        "display": "85.5",
        "value": 85.5
    },
    
    {
        "display": "85.6",
        "value": 85.6
    },
    
    {
        "display": "85.7",
        "value": 85.7
    },
    
    {
        "display": "85.8",
        "value": 85.8
    },
    
    {
        "display": "85.9",
        "value": 85.9
    },

{
    "display": "86",
    "value": 86
},

    {
        "display": "86.1",
        "value": 86.1
    },
    
    {
        "display": "86.2",
        "value": 86.2
    },
    
    {
        "display": "86.3",
        "value": 86.3
    },
    
    {
        "display": "86.4",
        "value": 86.4
    },
    
    {
        "display": "86.5",
        "value": 86.5
    },
    
    {
        "display": "86.6",
        "value": 86.6
    },
    
    {
        "display": "86.7",
        "value": 86.7
    },
    
    {
        "display": "86.8",
        "value": 86.8
    },
    
    {
        "display": "86.9",
        "value": 86.9
    },

{
    "display": "87",
    "value": 87
},

    {
        "display": "87.1",
        "value": 87.1
    },
    
    {
        "display": "87.2",
        "value": 87.2
    },
    
    {
        "display": "87.3",
        "value": 87.3
    },
    
    {
        "display": "87.4",
        "value": 87.4
    },
    
    {
        "display": "87.5",
        "value": 87.5
    },
    
    {
        "display": "87.6",
        "value": 87.6
    },
    
    {
        "display": "87.7",
        "value": 87.7
    },
    
    {
        "display": "87.8",
        "value": 87.8
    },
    
    {
        "display": "87.9",
        "value": 87.9
    },

{
    "display": "88",
    "value": 88
},

    {
        "display": "88.1",
        "value": 88.1
    },
    
    {
        "display": "88.2",
        "value": 88.2
    },
    
    {
        "display": "88.3",
        "value": 88.3
    },
    
    {
        "display": "88.4",
        "value": 88.4
    },
    
    {
        "display": "88.5",
        "value": 88.5
    },
    
    {
        "display": "88.6",
        "value": 88.6
    },
    
    {
        "display": "88.7",
        "value": 88.7
    },
    
    {
        "display": "88.8",
        "value": 88.8
    },
    
    {
        "display": "88.9",
        "value": 88.9
    },

{
    "display": "89",
    "value": 89
},

    {
        "display": "89.1",
        "value": 89.1
    },
    
    {
        "display": "89.2",
        "value": 89.2
    },
    
    {
        "display": "89.3",
        "value": 89.3
    },
    
    {
        "display": "89.4",
        "value": 89.4
    },
    
    {
        "display": "89.5",
        "value": 89.5
    },
    
    {
        "display": "89.6",
        "value": 89.6
    },
    
    {
        "display": "89.7",
        "value": 89.7
    },
    
    {
        "display": "89.8",
        "value": 89.8
    },
    
    {
        "display": "89.9",
        "value": 89.9
    },

{
    "display": "90",
    "value": 90
},

    {
        "display": "90.1",
        "value": 90.1
    },
    
    {
        "display": "90.2",
        "value": 90.2
    },
    
    {
        "display": "90.3",
        "value": 90.3
    },
    
    {
        "display": "90.4",
        "value": 90.4
    },
    
    {
        "display": "90.5",
        "value": 90.5
    },
    
    {
        "display": "90.6",
        "value": 90.6
    },
    
    {
        "display": "90.7",
        "value": 90.7
    },
    
    {
        "display": "90.8",
        "value": 90.8
    },
    
    {
        "display": "90.9",
        "value": 90.9
    },

{
    "display": "91",
    "value": 91
},

    {
        "display": "91.1",
        "value": 91.1
    },
    
    {
        "display": "91.2",
        "value": 91.2
    },
    
    {
        "display": "91.3",
        "value": 91.3
    },
    
    {
        "display": "91.4",
        "value": 91.4
    },
    
    {
        "display": "91.5",
        "value": 91.5
    },
    
    {
        "display": "91.6",
        "value": 91.6
    },
    
    {
        "display": "91.7",
        "value": 91.7
    },
    
    {
        "display": "91.8",
        "value": 91.8
    },
    
    {
        "display": "91.9",
        "value": 91.9
    },

{
    "display": "92",
    "value": 92
},

    {
        "display": "92.1",
        "value": 92.1
    },
    
    {
        "display": "92.2",
        "value": 92.2
    },
    
    {
        "display": "92.3",
        "value": 92.3
    },
    
    {
        "display": "92.4",
        "value": 92.4
    },
    
    {
        "display": "92.5",
        "value": 92.5
    },
    
    {
        "display": "92.6",
        "value": 92.6
    },
    
    {
        "display": "92.7",
        "value": 92.7
    },
    
    {
        "display": "92.8",
        "value": 92.8
    },
    
    {
        "display": "92.9",
        "value": 92.9
    },

{
    "display": "93",
    "value": 93
},

    {
        "display": "93.1",
        "value": 93.1
    },
    
    {
        "display": "93.2",
        "value": 93.2
    },
    
    {
        "display": "93.3",
        "value": 93.3
    },
    
    {
        "display": "93.4",
        "value": 93.4
    },
    
    {
        "display": "93.5",
        "value": 93.5
    },
    
    {
        "display": "93.6",
        "value": 93.6
    },
    
    {
        "display": "93.7",
        "value": 93.7
    },
    
    {
        "display": "93.8",
        "value": 93.8
    },
    
    {
        "display": "93.9",
        "value": 93.9
    },

{
    "display": "94",
    "value": 94
},

    {
        "display": "94.1",
        "value": 94.1
    },
    
    {
        "display": "94.2",
        "value": 94.2
    },
    
    {
        "display": "94.3",
        "value": 94.3
    },
    
    {
        "display": "94.4",
        "value": 94.4
    },
    
    {
        "display": "94.5",
        "value": 94.5
    },
    
    {
        "display": "94.6",
        "value": 94.6
    },
    
    {
        "display": "94.7",
        "value": 94.7
    },
    
    {
        "display": "94.8",
        "value": 94.8
    },
    
    {
        "display": "94.9",
        "value": 94.9
    },

{
    "display": "95",
    "value": 95
},

    {
        "display": "95.1",
        "value": 95.1
    },
    
    {
        "display": "95.2",
        "value": 95.2
    },
    
    {
        "display": "95.3",
        "value": 95.3
    },
    
    {
        "display": "95.4",
        "value": 95.4
    },
    
    {
        "display": "95.5",
        "value": 95.5
    },
    
    {
        "display": "95.6",
        "value": 95.6
    },
    
    {
        "display": "95.7",
        "value": 95.7
    },
    
    {
        "display": "95.8",
        "value": 95.8
    },
    
    {
        "display": "95.9",
        "value": 95.9
    },

{
    "display": "96",
    "value": 96
},

    {
        "display": "96.1",
        "value": 96.1
    },
    
    {
        "display": "96.2",
        "value": 96.2
    },
    
    {
        "display": "96.3",
        "value": 96.3
    },
    
    {
        "display": "96.4",
        "value": 96.4
    },
    
    {
        "display": "96.5",
        "value": 96.5
    },
    
    {
        "display": "96.6",
        "value": 96.6
    },
    
    {
        "display": "96.7",
        "value": 96.7
    },
    
    {
        "display": "96.8",
        "value": 96.8
    },
    
    {
        "display": "96.9",
        "value": 96.9
    },

{
    "display": "97",
    "value": 97
},

    {
        "display": "97.1",
        "value": 97.1
    },
    
    {
        "display": "97.2",
        "value": 97.2
    },
    
    {
        "display": "97.3",
        "value": 97.3
    },
    
    {
        "display": "97.4",
        "value": 97.4
    },
    
    {
        "display": "97.5",
        "value": 97.5
    },
    
    {
        "display": "97.6",
        "value": 97.6
    },
    
    {
        "display": "97.7",
        "value": 97.7
    },
    
    {
        "display": "97.8",
        "value": 97.8
    },
    
    {
        "display": "97.9",
        "value": 97.9
    },

{
    "display": "98",
    "value": 98
},

    {
        "display": "98.1",
        "value": 98.1
    },
    
    {
        "display": "98.2",
        "value": 98.2
    },
    
    {
        "display": "98.3",
        "value": 98.3
    },
    
    {
        "display": "98.4",
        "value": 98.4
    },
    
    {
        "display": "98.5",
        "value": 98.5
    },
    
    {
        "display": "98.6",
        "value": 98.6
    },
    
    {
        "display": "98.7",
        "value": 98.7
    },
    
    {
        "display": "98.8",
        "value": 98.8
    },
    
    {
        "display": "98.9",
        "value": 98.9
    },

{
    "display": "99",
    "value": 99
},

    {
        "display": "99.1",
        "value": 99.1
    },
    
    {
        "display": "99.2",
        "value": 99.2
    },
    
    {
        "display": "99.3",
        "value": 99.3
    },
    
    {
        "display": "99.4",
        "value": 99.4
    },
    
    {
        "display": "99.5",
        "value": 99.5
    },
    
    {
        "display": "99.6",
        "value": 99.6
    },
    
    {
        "display": "99.7",
        "value": 99.7
    },
    
    {
        "display": "99.8",
        "value": 99.8
    },
    
    {
        "display": "99.9",
        "value": 99.9
    },

{
    "display": "100",
    "value": 100
}

];
