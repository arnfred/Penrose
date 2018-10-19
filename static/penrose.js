var Penrose		= function() {

	// Function for combining two dictionaries in a non destructive way
	function c(o1,o2) { return $.extend({}, o1, o2); }

	// A Point on the canvas
	var Point		= {
		x		: 0,
		y		: 0,
		set		: function(x,y) { return c(this, { x : x, y : y }); },
		add		: function(p) { return c(this, { x : p.x + this.x, y : p.y + this.y }); },
		toList	: function() { return [this.x, this.y]; }
	}

    var within = function(coord, limits) {
      var positionsWithinLimits = $.grep(coord, function(pos) {
        var x = pos[0];
        var y = pos[1];
        return (x > limits.left && 
                x < limits.right &&
                y > limits.top &&
                y < limits.bottom);
      });
      return positionsWithinLimits.length >= 2;
    }

	// A Triangle template
	var Triangle	= {

		// Some reasonable default Parameters
		start		: Point.set(-600,500),
		rotate		: 0,
		len			: 700,
		phi			: 1.6180339887498948482,
		element		: null,
		colors		: 13,

		// Options
		options		: { },


		// Geometry
		p1			: function() {
						x = 0;
						y = 0;
						return Point.set(x,y).add(this.start);
			   		  },
		p2			: function() {
						x = Math.cos(this.angle + this.rotate)*this.len;
						y = -Math.sin(this.angle + this.rotate)*this.len;
						return Point.set(x,y).add(this.start);
			   		  },
		p3			: function() {
						len = 2 * Math.cos(this.angle) * this.len;
						x = Math.cos(this.rotate)*len;
						y = -Math.sin(this.rotate)*len;
						return Point.set(x,y).add(this.start);
			   		  },

		pos			: function(angle, len, point) {
						return point.add(Point.set(Math.cos(this.rotate + angle)*len, -Math.sin(this.rotate + angle)*len));
					  },

		// Family
		children	: [],

		// Drawing
		coord		: function() { return [this.p1().toList(), this.p2().toList(), this.p3().toList()]; },
		draw		: function(canvas, group, n, id, limits) {

						// If n > 0, Draw children
						if (n != null && n > 0) {
							this.fill();
							for (i in this.children) {
								this.children[i].draw(canvas, group, n-1, id + "-" + (parseInt(i) + 1), limits);
							}
						}

						// Else, draw this if it's within limits
						else {
                          if (within(this.coord(), limits)) {
                            this.element = canvas.polygon(group, this.coord(), c(this.options,{ id : id }));
                          }
                          else {
                            //console.debug("Skipping polygon with coordinates: ",this.coord());
                          }
                        }
						// Add class
						$(this.element).addClass(this.type);
					  },

		// Extending this triangle with new data
		extend		: function(t) { return c(this, t); },

		// Template for creating a new smaller triangle based on this one
		child		: function(type, rotate, start) {
						return type.extend({	start	: start,
												rotate	: this.rotate + rotate,
												len		: this.len * (this.phi - 1)
											})
					  }
	}

	var Kite	= Triangle.extend({
		angle	: 2*Math.PI/5,
		options	: { type	: "kite" }
	});

	var Dart	= Triangle.extend({ angle	: Math.PI/5, 	options	: { type	: "dart" }});


	// An kite triangle of type 1 defined by how the children are positioned
	var Kite1	= Kite.extend({
					fill	: function () {
								// Top Dart with top pointing right
								var top		= this.child(Dart2, (Kite.angle - Math.PI), this.p2());
								// Bottom Kite top pointing left
								var bottom	= this.child(Kite1, (Math.PI - Kite.angle), this.p3())
								// Add them all
								this.children	= [top, bottom];
							  }
				  });

	// An kite triangle of type 2 defined by how the children are positioned
	var Kite2	= Kite.extend({
					fill	: function () {
								// Phi squared
								phisq		= Math.pow((this.phi - 1),2);
								// Top Dart with top pointing left
								var top		= this.child(Dart1, (Math.PI - Kite.angle), this.p3());
								// Bottom Kite with top pointing right
								var bottom	= this.child(Kite2, (Kite.angle - Math.PI), this.pos(Kite.angle, this.len * phisq, this.p1() ))
								// Add them all
								this.children	= [top, bottom];
							  }
				  });

	var Dart1	= Dart.extend({
					fill	: function () {
								// Left dart pointing up
								var left	= this.child(Dart2, 0, this.start);
								// Center Kite with top pointing down right
								var center	= this.child(Kite1, (Dart.angle - Math.PI), this.p2());
								// Right Dart pointing down
								var right	= this.child(Dart1, (Math.PI - Dart.angle), this.p3());
								// Add them all
								this.children	= [left, center, right];
							  }
				  });

	var Dart2	= Dart.extend({
					fill	: function () {
								// Phi squared
								phisq		= Math.pow((this.phi - 1),2);
								// Left Dart pointing down
								var right	= this.child(Dart2, (Dart.angle - Math.PI), this.p2());
								// Center Kite pointing down left
								var center	= this.child(Kite2, (Math.PI - Dart.angle), this.pos(-Dart.angle, this.len * phisq, this.p2()));
								// Right dart pointing up
								var left	= this.child(Dart1, 0, this.pos(0, this.len * (this.phi - 1), this.p1()));
								// Add them all
								this.children	= [left, center, right];
							  }
				  });

	function createTriangles() {

		// Width
		var w	= getWidth();
		// Height
		var h	= getHeight();
		// The dart angle in radians (TODO convert everything to radians)
		var a	= Dart.angle;

		if (w > h) {
			// Length of small piece
			var x	= w/(2 * Math.cos(a));
			// Length of b
			var b	= Math.sin(a) * x;
			// Length of short side of dart triangle
			var l	= x * ((h/2 + b)) / b;
			// Offset to the bottom
			var o	= -1 * Math.cos(a) * l + (w/2);
			// Position of top most corner
			var s	= Point.set(o, h/2);
			// Angle of rotation
			var r	= 0;
		}
		else {
			// Length of small piece
			var x	= h/(2 * Math.cos(a));
			// Length of b
			var b	= Math.sin(a) * x;
			// Length of short side of dart triangle
			var l	= x * ((w/2 + b)) / b;
			// Offset to the bottom
			var o	= Math.cos(a) * l + (h/2);
			// Position of top most corner
			var s	= Point.set((w/2), o);
			// Angle of rotation
			var r	= Math.PI/2;
		}

		// Make a penrose tile to cover the screen consisting of two dart triangles
		var upper = Dart1.extend({len : l, start : s, rotate: r });
		var lower = Dart2.extend({len : l, start : upper.p3(), rotate: Math.PI+r});

		return { upper : upper, lower : lower };
	}


	// From ifany js
	function getWidth() {
	  var myWidth = 0;
	  if( typeof( window.innerWidth ) == 'number' ) {
	    //Non-IE
	    myWidth = window.innerWidth;
	  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
	    //IE 6+ in 'standards compliant mode'
	    myWidth = document.documentElement.clientWidth;
	  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
	    //IE 4 compatible
	    myWidth = document.body.clientWidth;
	  }
	  return myWidth;
	}

	function getHeight() {
	  var myHeight = 0;
	  if( typeof( window.innerWidth ) == 'number' ) {
	    //Non-IE
	    myHeight = window.innerHeight;
	  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
	    //IE 6+ in 'standards compliant mode'
	    myHeight = document.documentElement.clientHeight;
	  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
	    //IE 4 compatible
	    myHeight = document.body.clientHeight;
	  }
	  return Math.max(myHeight,696);
	}

    function getLimits(width, height) {
      var centreX = getWidth()/2.0;
      var centreY = getHeight()/2.0;
      return {
        top: centreY - height/2.0,
        bottom: centreY + height/2.0,
        left: centreX - width/2.0,
        right: centreX + width/2.0
      }
    }

	// Return a function for drawing the pattern
	return { draw	: function(canvas, width, height, depth) {
						var triangles = createTriangles();

						// Get group
						var g = canvas.group("viewport");

                        // Get Limits
                        var limits = getLimits(width, height);

						// Draw tiles
						triangles.upper.draw(canvas, g, depth, 1, limits);
						triangles.lower.draw(canvas, g, depth, 1, limits);
					  }};

}
