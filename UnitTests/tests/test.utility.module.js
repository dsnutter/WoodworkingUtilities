//
// this file tests the utility services and controllers
//
describe('lec.utility', function() {
  beforeEach(function() {
    // load the modules
    module('lec.utility');
  });

  describe('lec.utility.controller.fractionalInches', function() {
    var controller, rootScope, calculate, verify, scope;
  
    beforeEach(function() {
      // $httpBackend will be a mock, thanks to angular-mocks.js
      inject(function($injector, $controller) {
        rootScope = $injector.get('$rootScope');
        calculate = $injector.get('lec.units.service.calculate');;
        verify = $injector.get('lec.units.service.verify');;
        scope = rootScope.$new();
        // define controller
        controller = $controller('lec.utility.controller.fractionalInches', {
          '$scope': scope,
          'lec.units.service.calculate': calculate,
          'lec.units.service.verify': verify
        });
      });
    });
  
    it('has a string in place of a decimal value, and the result will not be shown', function() {
      scope.decimal = 'test';
      scope.calculate();
      
      expect(scope.showresult).toBeFalsy(); 
      expect(scope.result).toBe(null); 
    });
  
    it('has decimal value < 0 that can be estimated and the result is shown', function() {
      // results
      var expected = '1/4';
      // input
      scope.decimal = 0.254;
      // action
      scope.calculate();
      // HTML response is to be displayed
      expect(scope.showresult).toBeTruthy();
      // expected value is correct
      expect(scope.result).toBe(expected); 
    });
  
    it('has decimal value > 0 that can be estimated and the result is shown', function() {
      // results
      var expected = '3 and 1/4';
      // input
      scope.decimal = 3.254;
      // action
      scope.calculate();
      // HTML response is to be displayed
      expect(scope.showresult).toBeTruthy();
      // expected value is correct
      expect(scope.result).toBe(expected); 
    });
  });
  
  // segmented ring cut angles chart controller
  describe('lec.utility.controller.segmentedRingCutAnglesChart', function() {
    var controller, rootScope, segmented, scope, constants;
  
    beforeEach(function() {
      inject(function($injector, $controller) {
        rootScope = $injector.get('$rootScope');
        segmented = $injector.get('lec.segmented.service.calculate');;
        constants = $injector.get('lec.segmented.constants');;
        scope = rootScope.$new();
        // define controller
        controller = $controller('lec.utility.controller.segmentedRingCutAnglesChart', {
          '$scope': scope,
          'lec.segmented.service.calculate': segmented,
          'lec.segmented.constants': constants
        });
      });
    });
  
    it('returns empty string on invalid segment number decimal', function() {
          numberSegments = 'test';
          expected = 'Unknown';
          t = scope.angle(numberSegments);
          expect(t).toBe(expected);
    });
  
    it('returns a valid cut angle', function() {
        numberSegments = 12;
        expected = 15;
        t = scope.angle(numberSegments);
        expect(t).toBe(expected);
    });
  });

  // segmented ring cut angles chart controller
  describe('lec.utility.controller.segmentedBowlRingCalculator', function() {
    var controller, rootScope, segmentedConst, unitsConst, scope, verify, http, segmented, httpBackend;
  
    beforeEach(function() {
      inject(function($injector, $controller, $httpBackend, $http) {
        rootScope = $injector.get('$rootScope');
        scope = rootScope.$new();
        verify = $injector.get('lec.units.service.verify');;
        unitsConst = $injector.get('lec.units.constants');;
        segmentedConst = $injector.get('lec.segmented.constants');
        segmented = $injector.get('lec.segmented.service.calculate');
        unitsCalc = $injector.get('lec.units.service.calculate');
        unitsGet = $injector.get('lec.units.service.accessors');
        httpBackend = $httpBackend;
        
        // define controller
        controller = $controller('lec.utility.controller.segmentedBowlRingCalculator', {
          '$http': $http,
          '$scope': scope,
          'lec.units.service.verify': verify,
          'lec.units.constants': unitsConst,
          'lec.units.service.accessors': unitsGet,
          'lec.segmented.constants': segmentedConst,
          'lec.segmented.service.calculate': segmented,
          'lec.units.service.calculate': unitsCalc
        });
      });
    });

    describe('buildJsonUrl', function() {
      it('builds a valid json url', function() {
        scope.form.units = unitsConst.metric.abbrev;
        t = scope.buildJsonUrl();
        expect(t.width).toBe('/js/json/units.php?u=m&min=0&max=12');
        expect(t.diameter).toBe('/js/json/units.php?u=m&min=0&max=100');
  
        scope.form.units = unitsConst.english.abbrev;
        t = scope.buildJsonUrl();
        expect(t.width).toBe('/js/json/units.php?u=e&f=16&min=0&max=5');
        expect(t.diameter).toBe('/js/json/units.php?u=e&f=16&min=2&max=36');
      });
  
      it('builds an invalid json url', function() {
        scope.form.units = unitsConst.pixel.abbrev;
        t = scope.buildJsonUrl();
        expect(t.width).toBeFalsy();
        expect(t.diameter).toBeFalsy();
  
        scope.form.units = 'test';
        t = scope.buildJsonUrl();
        expect(t.width).toBeFalsy();
        expect(t.diameter).toBeFalsy();
      });
    });

    describe('measurementTypeChange', function() {
      // the json resulting from the json queries
      var jsonResult = [ { "valid": true }, ];

      beforeEach(function() {
          httpBackend.expectGET('/js/json/units.php?u=e&f=16&min=0&max=5').respond(jsonResult);
          httpBackend.expectGET('/js/json/units.php?u=e&f=16&min=2&max=36').respond(jsonResult);
      });

      afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
      });

      it('validly changes the measurement type', function() {
        // define json query and results
        httpBackend.expectGET('/js/json/units.php?u=m&min=0&max=12').respond(jsonResult);
        httpBackend.expectGET('/js/json/units.php?u=m&min=0&max=100').respond(jsonResult);
        // using metric measurement units
        scope.form.units = unitsConst.metric.abbrev;
        scope.measurementTypeChange();
        expect(scope.form.unitsdisplay).toBe(unitsConst.metric.label);

        /// remember to check $http for select options
        httpBackend.flush();
        expect(scope.rangeWidths).toEqual(jsonResult);
        expect(scope.rangeDiameters).toEqual(jsonResult);
 
        // define json query and results 
        httpBackend.expectGET('/js/json/units.php?u=e&f=16&min=0&max=5').respond(jsonResult);
        httpBackend.expectGET('/js/json/units.php?u=e&f=16&min=2&max=36').respond(jsonResult);
        // using english measurement units
        scope.form.units = unitsConst.english.abbrev;
        scope.measurementTypeChange();
        expect(scope.form.unitsdisplay).toBe(unitsConst.english.label);

        /// remember to check $http for select options
        httpBackend.flush();
        expect(scope.rangeWidths).toEqual(jsonResult);
        expect(scope.rangeDiameters).toEqual(jsonResult);
      });
  
      it('invalidly changes the measurement type', function() {
        httpBackend.flush();
        scope.form.units = 'test';
        scope.measurementTypeChange();
        expect(scope.unitsdisplay).toBeFalsy();
        /// remember to check $http for select options
        expect(scope.rangeWidths).toBeFalsy();
        expect(scope.rangeDiameters).toBeFalsy();      
      });
    });

    describe('calculate', function() {
      it('calculates valid results', function() {
        scope.form.units = unitsConst.english.abbrev;
        scope.form.diameter = 8;
        scope.form.width = 2;
        scope.form.numberSegments = 12;
        t = scope.calculate();
        expect(scope.showresult).toBeTruthy();
        expect(scope.strCutAngle).toBe('15 degrees');
        expect(scope.strDiameterMax).toBe('approximately 10 inches');
        expect(scope.strLength).toBe('2.6179938779914944 inches, which is approximately 2 and 5/8 inches');
        expect(scope.strDiameter).toBe('8 inches');
        expect(scope.strWidth).toBe('2 inches');

        scope.form.diameter = 9.5625;
        scope.form.width = 1.4375;
        scope.form.numberSegments = 12;
        t = scope.calculate();
        expect(scope.showresult).toBeTruthy();
        expect(scope.strCutAngle).toBe('15 degrees');
        expect(scope.strDiameterMax).toBe('approximately 11 inches');
        expect(scope.strLength).toBe('2.8797932657906435 inches, which is approximately 2 and 7/8 inches');
        expect(scope.strDiameter).toBe('9 and 9/16 inches');
        expect(scope.strWidth).toBe('1 and 7/16 inches');

        scope.form.units = unitsConst.metric.abbrev;
        scope.form.diameter = 15.2;
        scope.form.width = 3;
        scope.form.numberSegments = 12;
        t = scope.calculate();
        expect(scope.showresult).toBeTruthy();
        expect(scope.strCutAngle).toBe('15 degrees');
        expect(scope.strDiameterMax).toBe('approximately 18.3 cm');
        expect(scope.strLength).toBe('4.764748857944519 cm, which is approximately 4.8 cm');
        expect(scope.strDiameter).toBe('15.2 cm');
        expect(scope.strWidth).toBe('3 cm');

        // test inputs as string, still valid because method parses them into floats
        scope.form.units = unitsConst.metric.abbrev;
        scope.form.diameter = '15.2';
        scope.form.width = '3';
        scope.form.numberSegments = '12';
        t = scope.calculate();
        expect(scope.showresult).toBeTruthy();
        expect(scope.strCutAngle).toBe('15 degrees');
        expect(scope.strDiameterMax).toBe('approximately 18.3 cm');
        expect(scope.strLength).toBe('4.764748857944519 cm, which is approximately 4.8 cm');
        expect(scope.strDiameter).toBe('15.2 cm');
        expect(scope.strWidth).toBe('3 cm');
      });

      it('has invalid parameters', function() {
        scope.form.diameter = -1;
        scope.form.width = 2;
        scope.form.numberSegments = 12;
        t = scope.calculate();
        expect(t).toBeFalsy();
        expect(scope.showresult).toBeFalsy();
  
        scope.form.diameter = 10;
        scope.form.width = 2;
        scope.form.numberSegments = -1;
        t = scope.calculate();
        expect(t).toBeFalsy();
        expect(scope.showresult).toBeFalsy();
  
        scope.form.diameter = 10;
        scope.form.width = -1;
        scope.form.numberSegments = 12;
        t = scope.calculate();
        expect(t).toBeFalsy();
        expect(scope.showresult).toBeFalsy();

        scope.form.diameter = 10;
        scope.form.width = 'test';
        scope.form.numberSegments = 12;
        t = scope.calculate();
        expect(t).toBeFalsy();
        expect(scope.showresult).toBeFalsy();
      });
    });
  });
});