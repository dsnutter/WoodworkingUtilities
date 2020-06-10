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
        //draw.context().clean();
      });
    });
    describe('ring', function() {
      it('creates a segmented rings of with all possible sides', function() {
        var expected = ['5b12dfcd88bdb39af77e33c222b3dda9', '9927b642578973229f1c48718bf849bd', '655092960edd34777e97819a981ad2cd',
                        'cef5bc38ca131fb05e0471ee29a26aac', '892bd7e493a16e2a76753ce092f03ce9', '480535cbd978b99c095266304551d313',
                        'c22e82b2a0c957a849c225d98effc50e', 'ab2ad1e652aa83a2d4ff6c47be063915', '8ac674d749a909c1aeaa6f833ae63a31',
                        'ae072f4a346258467a3d4c50e16edf31', '49d074bdbd357440473694e6aa48403e', '994ec7df41f556bb616c3963220e7bf2',
                        '642db12c5f24980cae53505bc30798c7', 'b03ddf83eb2ee052e820992bb3dba153', '29ecdff5bd421ab42e34d2fca5722a68',
                        '50aafe9706d8df57c96a151a2eb3be8d', '9724d641def761b6abca178f23535ac9',
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
          //draw.context().clean();
        }
      });
    });
    describe('curve', function() {
      it('creates a circle', function() {
        var expected = '907c3893b2fe51685b91265bb6acffc1';

        draw.curve({x: 250, y: 250}, 100, 'red');

        json = draw.context().json();
        hash = draw.context().hash();

        //console.log('json: ' + json);
        //console.log('hash: ' + hash);

        // example unit test assertion
        expect(hash).toBe(expected);

        // clear the stack
        //draw.context().clean();
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
        //draw.context().clean();
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
