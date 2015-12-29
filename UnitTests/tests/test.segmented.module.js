describe('lec.segmented', function() {
  // tests the service for segmented related calculations
  describe('lec.segmented.service.calculate', function() {
    var service;
    beforeEach(function() {
      // load the module.
      module('lec.segmented');

      inject(function($injector) {
        service = $injector.get('lec.segmented.service.calculate');;
      });
    });

    // tests the cutAngle method
    describe('cutAngle', function() {
      it('has an invalid number of segments', function() {
          numberSegments = 'test';
          expected = false;
          t = service.cutAngle(numberSegments);
          expect(t).toBe(expected);
      });
      it('has an zero number of segments', function() {
          numberSegments = 0;
          expected = false;
          t = service.cutAngle(numberSegments);
          expect(t).toBe(expected);
      });
      it('has a negative number of segments', function() {
          numberSegments = -2;
          expected = false;
          t = service.cutAngle(numberSegments);
          expect(t).toBe(expected);
      });
      it('has valid inputs, and returns the cut angle', function() {
          numberSegments = 12;
          expected = 15;
          t = service.cutAngle(numberSegments);
          expect(t).toBe(expected);
      });
    });

    describe('circumference', function() {
      describe('diameterBased', function() {
        it('valid diameter', function() {
          t = service.circumference.diameterBased(2);
          expect(t).toBe(2 * Math.PI);
        });
        it('invalid diameter', function() {
          t = service.circumference.diameterBased('test');
          expect(t).toBeFalsy();

          t = service.circumference.diameterBased();
          expect(t).toBeFalsy();

          t = service.circumference.diameterBased(null);
          expect(t).toBeFalsy();
        });
      });
      describe('segmentLengthBased', function() {
        it('valid segment length and number segments', function() {
          t = service.circumference.segmentLengthBased(2, 3);
          expect(t).toBe(6);
        });
        it('invalid segment length or number segments', function() {
          t = service.circumference.segmentLengthBased('test', 3);
          expect(t).toBeFalsy();

          t = service.circumference.segmentLengthBased(3, 'test');
          expect(t).toBeFalsy();
        });
      });
    });
  });

  // test the segmented ring drawing functionality
  describe('lec.segmented.service.draw', function() {
    var draw, context, constants;
    beforeEach(function() {
      // load the module.
      module('lec.segmented');

      inject(function($injector) {
        draw = $injector.get('lec.segmented.service.draw');
        constants = $injector.get('lec.segmented.constants');
        var canvas = document.createElement('canvas');
        canvas.id     = "testCanvas";
        canvas.width  = 500;
        canvas.height = 500;
        //console.log('canvas: ' + canvas);
        // initialize the canvas
        draw.initialize(canvas);
      });
    });

    describe('clear', function() {
      it('erases the canvas', function() {
        draw.clear();
        var expected = 'c62e5ecf5bead7be72f252325e55bc02';

        //var json = draw.context().json();
        var hash = draw.context().hash();

        //console.log('json: ' + json);
        //console.log('hash: ' + hash);

        // example unit test assertion
        expect(hash).toBe(expected);

        // clear the stack
        draw.context().clean();
      });
    });
    describe('ring', function() {
      it('creates a segmented rings of with all possible sides', function() {
        var expected = ['2a93ca88a3f064ba0a2ee1cfaceb393d', '0a4ff60bbb0c160875a7726f03c33a99', '23f6a26970a8dc12c9c258467e93d460',
                        '02a26dfd4f275c0d44476065712b5a84', '9db7a96fa24284939704bce2a47d6e02', 'f36ef21c58e250925f56b473660cde3a',
                        'd627c150ac75434ffa3776d3be9a59eb', '9fb1882044defa958ea2f970b4869fd2', '4a49fb4a182357122b864898031c9bc3',
                        '9859c28c78e38047858505abb94e9cf2', '9eafa06641550554d1551481ab7cc894', '0bbcf9968efb47f3756827284f847d36',
                        'e68e9c805843857b6e3a09f6d8517d98', 'b5e1ae59e496c0ea268626c39f4c6e26', '892c95e1502ebd7482441eb699539a08',
                        '6189e942e9021c9bf70e4f58ff635326', 'efb31add36adf4341677adfdce479da9',
                        ];
        var json, hash;
        for (i = 0; i < constants.segments.length; i++) {
          draw.ring(constants.segments[i]);

          //json = draw.context().json();
          hash = draw.context().hash();

          //console.log('json: ' + json);
          //console.log('hash: #' + i + ' --> ' + hash);

          // example unit test assertion
          expect(hash).toBe(expected[i]);

          // clear the stack
          draw.context().clean();
        }
      });
    });
    describe('curve', function() {
      it('creates a circle', function() {
        var expected = '00f624e6dff2bf91662a1f80f6981ad9';

        draw.curve({x: 250, y: 250}, 100, 'red');

        json = draw.context().json();
        hash = draw.context().hash();

        //console.log('json: ' + json);
        //console.log('hash: ' + hash);

        // example unit test assertion
        expect(hash).toBe(expected);

        // clear the stack
        draw.context().clean();
      });
    });
    describe('label', function() {
      it('draws a line with a text label', function() {
        var expected = '66fea56dc30b47fd19fa509f48ff5df6';
        var p1 = { x: 100, y: 100 };
        var p2 = { x: 200, y: 100 };
        var labelText = 'Testing';
        var labelOffset = { x:5, y: 10 };

        draw.label(p1, p2, 'red', labelText, labelOffset);

        json = draw.context().json();
        hash = draw.context().hash();

        //console.log('json: ' + json);
        //console.log('hash: ' + hash);

        // example unit test assertion
        expect(hash).toBe(expected);

        // clear the stack
        draw.context().clean();
      });
    });
/*
    describe('ringWithLabels', function() {
      it('creates all segmented rings with labels', function() {

        var expected = ['', '', '',
                        '', '', '',
                        '', '', '',
                        '', '', '',
                        '', '', '',
                        '', '',
                        ];
        var json, hash;
        for (i = 0; i < constants.segments.length; i++) {
          draw.ringWithLabels(constants.segments[i]);

          json = draw.context().json();
          hash = draw.context().hash();

          console.log('json: ' + json);
          console.log('hash: #' + i + ' --> ' + hash);

          // example unit test assertion
          expect(hash).toBe(expected[i]);

          // clear the stack
          draw.context().clean();
        }
      });
    });
*/
  });
});
