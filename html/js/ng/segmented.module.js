// woodturning segmentation module
angular.module("lec.segmented", [])

// all predefined value constants
.constant('lec.segmented.constants', {
    // all of the possible number of segments in a segmented ring
    segments: new Array(6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120)
})

// handles all segmented ring related functionality
.factory('lec.segmented.service.calculate', function() {
    return {
        //
        // determines the segment mitered cut angle
        // @numberSegments: the number of segmented in the segmented ring to build
        // @return: -1 if invalid, or cut angle decimal value
        cutAngle: function(numberSegments) {
            if (isNaN(parseFloat(numberSegments)) || numberSegments <= 0) return false;
            return (360 / numberSegments / 2);
        },
        circumference: {
            //
            // determines the approx circumference of a segmented ring
            // @diameter: the diameter of the segmented ring
            // @return: the circumference of the segmented ring
            diameterBased: function(diameter) {
                if (isNaN(parseFloat(diameter))) return false;
                return (diameter * Math.PI);
            },
            //
            // determines the approx circumference of a segmented ring
            // @length: the length of each segmented in the segmented ring
            // @numberSegments: the number of segments in the segmented ring
            // @return: the circumference of the segmented ring
            segmentLengthBased: function(length, numberSegments) {
                if (isNaN(parseFloat(length)) || isNaN(parseFloat(numberSegments))) return false;
                return (length * numberSegments);
            },
        },
    };
})

// draws segmented rings using HTML5 canvas
.factory('lec.segmented.service.draw', function() {
    // the HTML5 drawing context and items to set defaults for
    var _canvas, _context, _angle, _offset, _radius, _center;
    //var _circleInnerRadius;
    // radii for turned diameter and outside midpoint diameter of the segmented ring
    var _circleOuterRadius, _circleMidpointRadius
    // track the inner and outer points of the segmented ring that form the polygons
    var _innerPts, _outerPts;
    // the segmented ring's approximate radii and slope of it's radial lines
    var _ringRadiusInner, _ringRadiusOuter, _radialSlope;

    return {
        // initializes parameters for the segmented drawing service
        initialize: function(canvas) {
            _canvas = canvas;
            _context = _canvas.getContext('2d');
            // clears the canvas, and resets vars
            this.clear();
        },
        context: function() {
          return _context;
        },
        // clear the canvas of any previous drawings
        clear: function() {
            _context.clearRect(0, 0, _canvas.width, _canvas.height);

            _offset = 30;
            _radius = (_canvas.width / 3) - _offset;
            _center = { x: _canvas.width / 2, y: _canvas.height / 2 };
            _innerPts = [];
            _outerPts = [];
            _ringRadiusInner = _radius - 40;
            _ringRadiusOuter = _radius + 40;
        },
        // draws the entire segmented ring with text labels for measurements
        ringWithLabels: function(numberSegments) {
			// return if can't draw segmented ring with labels
			if (_context == undefined) return;
            // clears the canvas, and resets vars
            this.clear();
            // draws the segmented ring
            this.ring(numberSegments);
            // draws the curves formed by turning the segmented ring
            this.curves();
            // draws the ring labels
            this.labels(numberSegments);
        },
        // draws the segmented ring polygons
        ring: function(numberSegments) {
            if(typeof numberSegments == 'undefined' || numberSegments < 6)
                 throw new Error("numberSides not defined");

            _angle = (Math.PI * 2)/numberSegments;

            _context.beginPath();
            // draw the outer border of the outscribed polygons
            _context.moveTo(_center.x + _ringRadiusOuter, _center.y);
            var xouter, youter;
            for(var i = 1; i <= numberSegments; i++)
            {
                xouter = _center.x + _ringRadiusOuter * Math.cos(_angle * i);
                youter = _center.y + _ringRadiusOuter * Math.sin(_angle * i);
                _context.lineTo(xouter, youter);

                // track the outer polygonal points
                _outerPts[_outerPts.length] = new Array(xouter, youter);
            }

            // draw the inner border of the outscribed polygons
            _context.moveTo(_center.x + _ringRadiusInner, _center.y);
            var xinner, yinner;
            for(var i = 1; i <= numberSegments; i++)
            {
                xinner = _center.x + _ringRadiusInner * Math.cos(_angle * i);
                yinner = _center.y + _ringRadiusInner * Math.sin(_angle * i);
                _context.lineTo(xinner, yinner);

                // track the inner polygonal points
                _innerPts[_innerPts.length] = new Array(xinner, yinner);
            }

            _radialSlope = new Array();
            // draw the sides of the segments that make up the outscribed polygons
            for (var i = 0; i < _innerPts.length; i++)
            {
                _context.moveTo(_innerPts[i][0], _innerPts[i][1]);
                _context.lineTo(_outerPts[i][0], _outerPts[i][1]);
                _radialSlope[i] = (_outerPts[i][1] - _innerPts[i][1])/(_outerPts[i][0] - _innerPts[i][0]);
            }

            _context.closePath();
            _context.lineWidth = 2;
            _context.strokeStyle = 'black';
            _context.stroke();
        },
        // draws all curved edge approximations for the perimeters of the segmented ring
        curves: function() {
            // find the radius of the minimum diameter circle by using the distance formula: sqrt((x2 - x1)^2 + (y2 - y1)^2)
            //_circleInnerRadius = Math.sqrt(Math.pow((_innerPts[0][0] - _center.x), 2) + Math.pow((_innerPts[0][1] - _center.y), 2));
            // draw the minimum diameter circle which intersects the points on the inner wall of the segments
            //DrawCircle(_context, _center, _circleInnerRadius, 'red');

            var segmentLengthX = (_outerPts[1][0] - _outerPts[0][0]);
            var segmentLengthY = (_outerPts[1][1] - _outerPts[0][1]);
            // find the radius of the maximum diameter circle by using the distance formula
            var segmentLength = Math.sqrt(Math.pow(segmentLengthX, 2) + Math.pow(segmentLengthY, 2));
            // radius of circle goes through outer segment points of the polygon, which is the hypotenuse of the
            //		right triangle that bisects a segment
            _circleOuterRadius = Math.sqrt(Math.pow((_outerPts[0][0] - _center.x), 2) + Math.pow((_outerPts[0][1] - _center.y), 2));
            // the inner angle closest to center that consists of a right triangle that bisects a segment
            angle = _angle / 2;
            // the radius of the circle that touches the midpoint of the outer side of the segments
            _circleMidpointRadius = Math.cos(angle) * _circleOuterRadius;
            // draw the approx maximum diameter circle w/radius tangent to outer midpoint of segment
            this.curve(_center, _circleMidpointRadius, 'red');
            // draw the circle that represents the turned diameter of the circle
            this.curve(_center, _radius, 'blue');
        },
        // draws a single curved edge approximation for the perimeters of the segmented ring
        curve: function(center, radius, color) {
            _context.beginPath();
            _context.arc(center.x, center.y, radius, 0, 2*Math.PI, false);
            _context.lineWidth = 2;
            _context.strokeStyle = color;
            _context.stroke();
        },
        // draws all labels for measurements on the segmented ring
        // draws lines and text to label the dimensions of the diagram
        labels: function(numberSegments) {
            // label A: max ring diameter
            var color = 'red';
            var labelText = 'A';
            // find the y coord of the line, which is at the top of the diagram
            var y = _center.y - _circleOuterRadius - _offset;
            // define the endpoints of the line
            var p1 = { x: (_center.x - _circleMidpointRadius), y: y};
            var p2 = { x: (_center.x + _circleMidpointRadius), y: y};
            var labelOffset = { x: 0, y: -5 };
            // draw the A line
            this.label(p1, p2, color, labelText, labelOffset);

            // label B: final turned diameter of the ring
            color = 'blue';
            labelText = 'B';
            // find the y coord of the line, which is at the top of the diagram, but below the 'A' label
            y += _offset * 3/4;
            // define the endpoints of the line
            p1 = { x: (_center.x - _radius), y: y};
            p2 = { x: (_center.x + _radius), y: y};
            // draw the B line
            this.label(p1, p2, color, labelText, labelOffset);

            // label C: segment length
            labelOffset = { x: 10, y: (numberSegments > 20 ? 10 : 15) };
            lineOffset = (numberSegments > 30 ? 25 : 10);
            var deltax = (_outerPts[1][0] - _outerPts[0][0]);
            var deltay = (_outerPts[1][1] - _outerPts[0][1]);
            var slope = deltay / deltax;
            var midpointOffset;

            if (slope == 0) {
                x1 = _outerPts[0][0];
                x2 = _outerPts[1][0];
                y1 = _outerPts[0][1] + lineOffset;
                y2 = _outerPts[1][1] + lineOffset;
            } else {
                // find a point at a lineOffset distance from the midpoint, i.e. hypotenuse is lineOffset through midpoint
                var negangle = Math.atan(-1 * slope);
                var midpoint = { x: ((_outerPts[1][0] + _outerPts[0][0])/2), y: ((_outerPts[1][1] + _outerPts[0][1])/2) };
                midpointOffset = { x: (midpoint.x + (lineOffset * Math.cos(negangle))), y:(midpoint.y + (lineOffset * Math.sin(negangle))) };

                // determine the endpoints of the label line
                i = 0;
                if (_radialSlope[i] == Infinity) {
                    x1 = _outerPts[i][0];
                } else x1 = (_radialSlope[i] * _outerPts[i][0] - _outerPts[i][1] - slope * midpointOffset.x + midpointOffset.y) / (_radialSlope[i] - slope)
                y1 = slope * x1 - slope * midpointOffset.x + midpointOffset.y
                i = 1;
                if (_radialSlope[i] == Infinity) {
                    x2 = _outerPts[i][0];
                } else x2 = (_radialSlope[i] * _outerPts[i][0] - _outerPts[i][1] - slope * midpointOffset.x + midpointOffset.y) / (_radialSlope[i] - slope)
                y2 = slope * x2 - slope * midpointOffset.x + midpointOffset.y
            }
            // define the endpoints of the line, which is parallel to the first outside segment length
            p1 = { x: x1, y: y1 };
            p2 = { x: x2, y: y2 };
            color = 'purple';
            labelText = 'C';
            // draw the C line
            this.label(p1, p2, color, labelText, labelOffset);

            // Label D: segment width
            color = 'orange';
            labelText = 'D';
            lineOffset = 0;
            labelOffset = { x: 10, y: -10 };
            // define the endpoints of the line by finding the midpoints of the outer and inner sides
            var outerLast = _outerPts[_outerPts.length - 1];
            var outerNextLast = _outerPts[_outerPts.length - 2];
            p1 = { x: (outerLast[0] + outerNextLast[0])/2, y: (outerLast[1] + outerNextLast[1])/2 };
            var innerLast = _innerPts[_innerPts.length - 1];
            var innerNextLast = _innerPts[_innerPts.length - 2];
            p2 = { x: (innerLast[0] + innerNextLast[0])/2, y: (innerLast[1] + innerNextLast[1])/2 };
            // draw the D line
            this.label(p1, p2, color, labelText, labelOffset);
        },
        // draws a single label for specific measurement on a segmented ring
        label: function(p1, p2, color, labelText, labelOffset) {
            // displayText FROM: http://stackoverflow.com/questions/5068216/placing-text-label-along-a-line-on-a-canvas
            // license: CC --> http://stackexchange.com/legal
            function displayText( text, p1, p2, alignment, color, textOffset, padding ){
                if (!alignment) alignment = 'center';
                if (!padding) padding = 0;

                var dx = p2.x - p1.x;
                var dy = p2.y - p1.y;
                var p, pad;
                if (alignment == 'center'){
                    p = p1;
                    pad = 1/2;
                } else {
                    var left = alignment=='left';
                    p = left ? p1 : p2;
                    pad = padding / Math.sqrt(dx*dx+dy*dy) * (left ? 1 : -1);
                }

                _context.save();
                _context.textAlign = alignment;
                _context.translate(p.x+dx*pad,p.y+dy*pad);
                //ctx.rotate(Math.atan2(dy,dx));
                _context.font = "normal small-caps bold 15px arial";
                _context.fillStyle = color;
                _context.fillText(text, textOffset.x, textOffset.y);
                _context.restore();
            }

            _context.beginPath();

            // draw main line
            _context.moveTo(p1.x, p1.y);
            _context.lineTo(p2.x, p2.y);

            // draw the line in bold color
            _context.lineWidth = 2;
            _context.strokeStyle = color;
            _context.stroke();

            // draw line label for the line
            displayText(labelText, p1, p2, 'center', color, labelOffset);
        },
    };
})

// links the segmented drawing services to a HTML5 canvas (designated div HTML attribute is 'segmented-ring')
.directive('segmentedRing', ['lec.segmented.service.draw', function(draw) {
    return {
        restrict: 'A',
        template: '<canvas id="canvasSegmentedRingCalculatorResult" width="500" height="500" style="border: 1px solid; #000000"></canvas>',
        link: function(scope, element) {
            //console.log('test directive segmented-ring.');
            var canvas = element.find('canvas')[0]; //.getContext('2d');
            //var canvas = element(document.querySelector('#canvasSegmentedRingCalculatorResult'));
            draw.initialize(canvas);
        },
    };
}])

;
