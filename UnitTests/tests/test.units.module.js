// test the module that manipulates measurement units
describe('lec.units', function() {
  var predefined, properties;

  beforeEach(function() {
    // load the module.
    module('lec.units');
  });

  // tests the verify service
  describe('lec.units.service.verify', function() {
    var verify, predefined, properties;

    beforeEach(function() {
      inject(function($injector) {
        constants = $injector.get('lec.units.constants');
        properties = $injector.get('lec.units.properties');
        verify = $injector.get('lec.units.service.verify', {
          'lec.units.constants': constants,
          'lec.units.properties': properties
        });
      });
    });

    describe('jsonQry', function() {
      // check to see if service has the expected function
      it('should have an jsonQry function', function () {
        expect(angular.isFunction(verify.jsonQry)).toBeTruthy();
      });
        it('with unknown units, string', function() {
        var t = verify.jsonQry('test');
        expect(t).toBeFalsy();
      });
      it('with unknown units, undefined', function() {
        var t = verify.jsonQry();
        expect(t).toBeFalsy();
      });
      it('with valid units, with an invalid resolution, string', function() {
        var t = verify.jsonQry('e', 'halves');
        expect(t).toBeFalsy();
      });
      it('with valid units, with an invalid resolution, numeric', function() {
        var t = verify.jsonQry('e', 128);
        expect(t).toBeFalsy();
      });
      it('with valid units, metric, without resolution', function() {
        var t = verify.jsonQry('m');
        expect(t).toBeTruthy();
      });
      it('with valid units, english, without resolution', function() {
        var t = verify.jsonQry('e');
        expect(t).toBeFalsy();
      });
      it('with valid units and resolution', function() {
        var t = verify.jsonQry('e', 4);
        expect(t).toBeTruthy();
      });
  
      it('with an invalid min, numeric', function() {
        var t = verify.jsonQry('e', 4, 2.4, 5);
        expect(t).toBeFalsy();
      });
      it('with an invalid min, string', function() {
        var t = verify.jsonQry('e', 4, 'test', 4);
        expect(t).toBeFalsy();
      });
      it('with an invalid max, numeric', function() {
        var t = verify.jsonQry('e', 4, 2, 5.3);
        expect(t).toBeFalsy();
      });
      it('with an invalid max, string', function() {
        var t = verify.jsonQry('e', 2, 4, 'test');
        expect(t).toBeFalsy();
      });
      it('with an invalid min and max, numeric', function() {
        var t = verify.jsonQry('e', 3, 2.2, 4.5);
        expect(t).toBeFalsy();
      });
      it('with an invalid min and max, string', function() {
        var t = verify.jsonQry('e', 3, 'test1', 'test2');
        expect(t).toBeFalsy();
      });
      it('in valid units, resolution, min, and max', function() {
        var t = verify.jsonQry('e', 16, 5, 10);
        expect(t).toBeTruthy();
      });
    });

    describe('units', function() {
      it('in valid english units and resolution', function() {
        var t = verify.units('e', 16);
        expect(t).toBeTruthy();
      });
      it('in valid metric units and resolution', function() {
        var t = verify.units('m');
        expect(t).toBeTruthy();
      });
      it('in valid pixel units and resolution', function() {
        var t = verify.units('m');
        expect(t).toBeTruthy();
      });
      it('invalid units and resolution', function() {
        var t = verify.units('test', 16);
        expect(t).toBeFalsy();
        var t = verify.units('test', 100);
        expect(t).toBeFalsy();
      });
    });
  });

  //
  // test calculate services
  //
  describe('lec.units.service.calculate', function() {
    var units, properties;
    beforeEach(function() {
      inject(function($injector) {
        properties = $injector.get('lec.units.properties');
        units = $injector.get('lec.units.service.calculate', {
          'lec.units.properties': properties
        });
      });
    });
    // tests the approximateUnits method
    describe('approximateUnits', function() {
        var expected, decimal, t, resolution;
        //
        // testing metric units
        //
        it('in metric units greater than decimal value', function() {
          resolution = 10;
          expected = { display: '0.6', value: 0.6 };
          decimal = 0.583;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('in metric units less than decimal value', function() {
          resolution = 10;
          expected = { display: '0.6', value: 0.6 };
          decimal = 0.612;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('in metric units equal to decimal value', function() {
          resolution = 10;
          expected = { display: '0.6', value: 0.6 };
          decimal = 0.6;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('in metric units near zero, approximate up', function() {
          resolution = 10;
          expected = { display: '0.1', value: 0.1 };
          decimal = 0.02;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('in metric units greater than greatest value', function() {
          resolution = 10;
          expected = { display: '5', value: 5 };
          decimal = 4.95;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('in metric units exactly halfway between the estimate values', function() {
          resolution = 10;
          expected = { display: '0.6', value: 0.6 };
          decimal = 0.55;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        //
        // testing english units
        //
        it('in english units greater than decimal value', function () {
          resolution = 16;
          expected = { display: '1/4', value: 0.25 };
          decimal = 0.248;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('in english units less than decimal value', function() {
          resolution = 16;
          expected = { display: '1/4', value: 0.25 };
          decimal = 0.258;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('in english units equal to decimal value', function() {
          resolution = 16;
          expected = { display: '1/4', value: 0.25 };
          decimal = 0.25;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('in english units equal to decimal value with whole part', function() {
          resolution = 16;
          expected = { display: '5 and 1/4', value: 5.25 };
          decimal = 5.25;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('in english units equal approximated to whole part only', function() {
          resolution = 16;
          expected = { display: '5', value: 5 };
          decimal = 5.02;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('in english units equal to whole part only', function() {
          resolution = 16;
          expected = { display: '5', value: 5 };
          decimal = 5;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
  
        it('invalid decimal value argument', function() {
          resolution = 16;
          expected = false;
          decimal = 'test';
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('invalid resolution value as decimal argument', function() {
          resolution = 16.2;
          expected = false;
          decimal = 5.24;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
        it('invalid resolution value as string argument', function() {
          resolution = 'test';
          expected = false;
          decimal = 5.24;
          t = units.approximateUnits(decimal, resolution);
          // check the result.
          expect(t).toEqual(expected); 
        });
    });

    //
    // tests the convertTo method
    //
    describe('convertTo', function() {
      it('has invalid value to process arguments', function() {
        convertValue = 'test';
        expected = false;
        t = units.convertTo('m', convertValue);
        expect(t).toBe(expected);
      });

      it('has invalid unit arguments', function() {
        convertValue = 1;
        expected = false;
        t = units.convertTo('test', convertValue);
        expect(t).toBe(expected);
      });

      it('converts inches to cm', function() {
        convertValue = 1;
        expected = 2.54;
        t = units.convertTo('m', convertValue);
        expect(t).toBe(expected);
      });

      it('converts cm to inches', function() {
        convertValue = 2.54;
        expected = 1;
        t = units.convertTo('e', convertValue);
        expect(t).toBe(expected);
      });
    });

    //
    // test the pixel ratio subservice
    //
    describe('pixelRatio', function() {
      it('invalid measurement and pixel values', function() {
        expected = 0;
        t = units.pixelRatio(1.2, 2);
        expect(t).toBe(expected);
        t = units.pixelRatio(2, 2.1);
        expect(t).toBe(expected);
        t = units.pixelRatio(4.2, 2.2);
        expect(t).toBe(expected);
        t = units.pixelRatio('test', 2);
        expect(t).toBe(expected);
        t = units.pixelRatio(2, 'test');
        expect(t).toBe(expected);
        t = units.pixelRatio('test1', 'test2');
        expect(t).toBe(expected);
      });
      it('valid measurement and pixel values', function() {
        expected = 10;
        t = units.pixelRatio(10, 100);
        expect(t).toBe(expected);
      });
    });
  });

  describe('lec.units.service.accessors', function() {
    var accessors, constants;
    beforeEach(function() {
      inject(function($injector) {
        constants = $injector.get('lec.units.constants');
        accessors = $injector.get('lec.units.service.accessors', {
          'lec.units.constants': constants
        });
      });
    });
    
    describe('get default unit resolutions', function() {
      it('valid units', function() {
        t = accessors.resolution(constants.english.abbrev);
        expect(t).toBe(constants.english.resolutions.default);

        t = accessors.resolution(constants.metric.abbrev);
        expect(t).toBe(constants.metric.resolutions.default);

        t = accessors.resolution(constants.pixel.abbrev);
        expect(t).toBe(constants.pixel.resolutions.default);
      });
      it('invalid units', function() {
        t = accessors.resolution('t');
        expect(t).toBeFalsy();
      });
    });

    describe('get unit labels', function() {
      it('valid units', function() {
        t = accessors.unitlabel(constants.english.abbrev);
        expect(t).toBe(constants.english.label);

        t = accessors.unitlabel(constants.metric.abbrev);
        expect(t).toBe(constants.metric.label);

        t = accessors.unitlabel(constants.pixel.abbrev);
        expect(t).toBe(constants.pixel.label);
      });
      it('invalid units', function() {
        t = accessors.unitlabel('t');
        expect(t).toBeFalsy();
      });
    });
  });
});
