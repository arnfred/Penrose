$(document).ready(function () {
	// Add svg to the penrose
	$("#penrose").svg()
	svg = $("#penrose").svg('get');
	$("svg").attr("width", window.innerWidth);

	// Get attributes from get
	colorGen.n			= $("#penrose").attr("colors");
	colorGen.current	= $("#penrose").attr("method");
	colorGen.custom		= custom;	
	colorGen.edgeColor	= $("input[name=ec]").val();
	colorGen.edgeWidth	= $("select[name=ew]").val();
	var depth			= $("#penrose").attr("depth");

	// Set up sliders
	depthSlider(svg);
	colorSlider();
	edgeSlider();

	// Set up radio buttons
	methodSetup();

	// Set up color pickers on form
	colorSelectorSetup();

	// Enable edges
	$("input[name=e]").click(function () { setClasses(colorGen.n, colorGen.current); });

	// Set up show and hide form field
	menufocus();

	// Paint window
	repaint(svg, depth);

});


// The functions used for generating the colors
colorGen		= {
	"add" 		: function (a,b) { return a + b; },
	"multiply"	: function (a,b) { return a * b; },
	"concat"	: function (a,b) { return a + "" + b; },
}

function menufocus() {
	// Hide click
	$(".hide").click(function() { 
		$("#controldiv").fadeOut(); 
	});

	var f = function(id) {
		var vis = $(".content").not(id).filter(":visible");
		if (vis.length == 0) $(id).fadeToggle(300)
		vis.fadeOut(300, function() {
			$(id).fadeToggle(300);
		});	
	}

	// About click
	$("h2#use").click(function () { f("#usediv") });
	$("h2#about").click(function () { f("#aboutdiv") });
	$("h2#control").click(function () { f("#controldiv") });

	// Share link click
	$("#link").mouseover(function () { 
		$(this).attr("href",getLink()); 
	});

	// Download SVG
	$("#downsvg").click(function () {
		// Create svg
		var output = svg.toSVG();
		uriContent = "data:application/octet-stream," + encodeURIComponent(output);
		$(this).attr("href",uriContent);
	});
	
}

function getColors(n) {
	return {
		kitestart	: $("input[name='ks']").val(),
		dartstart	: $("input[name='ds']").val(),
		kiteend		: $("input[name='ke']").val(),
		dartend		: $("input[name='de']").val()
	}
}

function isLabelPos(pos) {
    return pos.length >= 4 && 
    pos[0] === 1 && 
    pos[1] === 1 &&
    pos[2] === 1 && 
    pos[3] === 1;
}


function setClasses(n, f) {
	// For each polygon, calculate appropriate class
	$("polygon").each(function () { 
		var pos = $(this).attr("id").split("-").map(function (n) { return parseInt(n); }); 
		var oldClass = pos.reduce(function (a,b) { return colorGen[colorGen.current](a,b) % colorGen.n; });
		var newClass = pos.reduce(function (a,b) { return colorGen[f](a,b) % n; });
		$(this).addClass($(this).attr("type")); 

        // Special cases left blank for label information:
		$(this).removeClass("color" + oldClass);
        $(this).addClass("color" + newClass)
	});

	// Update colorgen
	colorGen.current = f;
	colorGen.n	= n;

	// Update all colors
	setColorGradient();
	setEdgeColors();
    setLabelColor();
    setBorderBoxColor();
}


function setEdgeColors() {

	// Set background color
	$("svg").css("background-color","#"+colorGen.edgeColor);

	// Update edge colors
	if ($("input[name=e]").is(":checked")) {
		$("polygon").css("stroke","#" + colorGen.edgeColor);
		$("polygon").css("stroke-width",colorGen.edgeWidth/10+"px");
	} else {
		$("polygon").css("stroke-width","1px");
	}
}

function setLabelColor() {
	$(".label").css("fill","#"+colorGen.edgeColor);
}

function setBorderBoxColor() {
	$(".borderBox").css("fill","#"+colorGen.edgeColor);
}

function setColorGradient() {

	// Initialize variables
	var colors	= getColors();
	var n		= colorGen.n;
	var edge	= colorGen.edgeColor;
	
	var kiteGradient = makeGradient(colors.kitestart, colors.kiteend, n)
	var dartGradient = makeGradient(colors.dartstart, colors.dartend, n)

	// For each class, set color
	for (i = 0; i <= n - 1; i++) {
		if ($("input[name=e]").is(":checked")) {
			setColor("kite", i, kiteGradient[i], edge);
			setColor("dart", i, dartGradient[i], edge);
		}
		else {
			setColor("kite", i, kiteGradient[i], kiteGradient[i]);
			setColor("dart", i, dartGradient[i], dartGradient[i]);
		}
	}

}


function setColor(type, index, fill, stroke) {
	$("."+type+".color" + index).css("fill","#" + fill).css("stroke", "#" + stroke);
}
	

function slider(div, change, scale) {

	var select = $( "#" + div + ".slide" ).hide();
	var slider = $( "<div id='slider'></div>" ).insertAfter( select ).slider({
		min: 1,
		max: select.children().last().val(),
		range: "min",
		value: select[ 0 ].selectedIndex + 1,
		slide: function( event, ui ) {
			$("#" + div + "div span.count").html(Math.round(ui.value*scale*10)/10);
			select[ 0 ].selectedIndex = ui.value - 1;
		},
		change: function(event, ui) { 
			change(ui.value);
		}
	});
}

function depthSlider(svg) {
	slider("depth", function(n) { repaint(svg, n); }, 1)
}

function colorSlider() {
	slider("colors", function(n) { setClasses(n, colorGen.current); }, 1)
}

function edgeSlider() {
	slider("ew", function(n) { setEdge(n, colorGen.edgeColor); }, 0.1)
}

/*
 * Sets the edge
 */
function setEdge(n, color) {
	// Update colorGen
	colorGen.edgeColor = color;
	colorGen.edgeWidth = n;

	// Update classes
	setEdgeColors();

}

/*
 * Repaint the window
 */
function repaint(svg, depth) {
	// Clear current svg
	svg.clear();
	// Build new one
	Penrose().draw(svg, depth);
	// Set classes
	setClasses(colorGen.n, colorGen.current);
	// Set color pickers
	//colorPolygonSetup();
	//
	// Set up panning and zooming
	$('svg').svgPan("viewport");
}


function colorSelectorSetup() {
	// Set up color selection from colors
	$('.colorselector').click(function () {

		// Initialize variables
		var selector 	= $(this);
		var type		= selector.attr("type"); 
		var hidden		= $("#" + selector.attr("id") + "hidden");



		// Bind colorpicker to element and call it
		selector.unbind();
		var changeColor	= function(color) { selector.css('background-color', "#" + color); };
		if (selector.hasClass("edge"))
			var submitColor		= function(color) { changeColor(color); hidden.val(color); setEdge(colorGen.edgeWidth, color); };
		else
			var submitColor		= function(color) { changeColor(color); hidden.val(color); setColorGradient(); };

		colorPickInit(selector, selector.css('background-color'), changeColor, submitColor);
		selector.trigger("click");
	});
}

function colorPolygonSetup() {

	// Set up color selection from polygons
	$("polygon").click(function () {
		// Initialize variables
		var elem		= $(this);
		var id			= elem.attr("class").split(" ").splice(0,2).join("");
		var type		= elem.attr("type"); 

		// Bind colorpicker to element and call it
		elem.unbind();
		changeColor		= function(color) { setColor(type, index, color, color); };
		submitColor		= function(color) { };
		colorPickInit(elem, elem.css("fill"), changeColor, submitColor);
		elem.trigger("click");
	});
}

function colorPickInit(elem, color, changeColor, submitColor) {
	elem.ColorPicker({
		color: "#" + rgb2hex(color),
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			var col = $(colpkr).children(".colorpicker_current_color").css("background-color");
			changeColor(col);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			changeColor(hex);

		},
		onSubmit: function (hsb, hex, rgb) {
			$(".colorpicker").fadeOut(500);
			submitColor(hex);
		}
	});
}


function methodSetup() {
	// Make sure that custom shows it it's the current selected
	if ($("#customradio").is(":checked")) $(".custom").show();
	
	$(".method").change(function() {
		var f = $(this).val();
		var n = colorGen.n;

		// Check if it's the custom function
		if (f == "custom") {
			$(".custom").slideDown('fast');
		}
		else {
			$(".custom").slideUp('fast');
		}
		
		// Calculate new classes
		setClasses(n, f);
	});

	$("#custom").keydown(function () {
		$(this).css("border-color","#bb6030");
	});

	$("#custombutton").click(function () {
		var field = $("#custom");
		var f = field.val();
		var n = colorGen.n;
		colorGen.custom = function (a,b) { eval(f); };

		// Redirect page
		window.location.href = getLink();
	});

}

function getLink() {
	return "index?" + $("form").serialize()
}

function makeGradient(start,end,n) {
	var s = hex2rgb(start);
	var e = hex2rgb(end);
	var step = _.zip(s,e).map(function(a) { return (a[1] - a[0]) / (n-1); })
	var f = function(c,s,i) { return c + Math.ceil((s*i)); };
	var result = _.range(n).map(function (i) { return rgbArray2hex([f(s[0],step[0],i),f(s[1],step[1],i),f(s[2],step[2],i)]); });
	return result;
}

function hex2rgb(hex) {
	hex = (hex.indexOf('#') > -1) ? hex.substring(1) : hex;
	if (hex.length < 6) hex = hex.split('').map(function (c) { return c+c; }).join('')
	var hex = parseInt(hex, 16);
	return Array(hex >> 16, (hex & 0x00FF00) >> 8, hex & 0x0000FF);
}

function rgb2hex(rgbString) {

	var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1);
	// parts now should be ["rgb(0, 70, 255", "0", "70", "255"]
	hexString = rgbArray2hex(parts);
	return hexString
}

function rgbArray2hex(parts) {
	for (var i = 0; i < 3; ++i) {
		parts[i] = parseInt(parts[i]).toString(16);
		if (parts[i].length == 1) parts[i] = '0' + parts[i];
	} 
	var hexString = parts.join('').toUpperCase();
	return hexString;
}

