package penrose

// Unfiltered
import unfiltered.netty._
import unfiltered.request._
import unfiltered.response._
import com.dongxiguo.fastring.Fastring.Implicits._

object Main {

  def main(args : Array[String]): Unit= {

    // Fetch the server
    val srv = Server.init

    // Run the server
    srv.run
  }
}



object Server {

  import util.Properties

  def init = {

    // Where files for the web server are located
    val resourceDir = new java.io.File("resources/")

    // The default port used for testing. This will have to change for deployment
    val testPort = Properties.envOrElse("PORT", "8000").toInt
    println("starting on port: " + testPort)

    // Initialize Server
    val srv = unfiltered.netty.Http(testPort).chunked(1048576).resources(resourceDir.toURI.toURL);

    srv.handler(FrontpagePlan)
  }

}


object FrontpagePlan extends async.Plan with ServerErrorResponse {

  def intent = {


	//////////////////////////////////////////////
	//                                          //
	//                Frontpage                 //
	//                                          //
	//////////////////////////////////////////////
    case req @ Params(params) => {

      setVariables(params)
      val frontpage = frontpageTemplate
      req.respond(Ok ~> HtmlContent ~> ResponseString( frontpageTemplate ))
    }

  }

  def setVariables(params : Map[String, Seq[String]]) = {

    if (!params("colors").isEmpty) colors = params("colors").head
    if (!params("method").isEmpty) method = params("method").head
    if (!params("depth").isEmpty) depth = params("depth").head
    if (!params("custom").isEmpty) custom = params("custom").head

    /* Colors */ 
    if (!params("ks").isEmpty) kitestart = params("ks").head
    if (!params("ke").isEmpty) kiteend = params("ke").head
    if (!params("ds").isEmpty) dartstart = params("ds").head
    if (!params("de").isEmpty) dartend = params("de").head

    /* Edge */
    if (!params("e").isEmpty) edge = params("e").head
    if (!params("ec").isEmpty) edgecolor = params("ec").head
    if (!params("ew").isEmpty) edgewidth = params("ew").head
    if (!params("colors").isEmpty) colors = params("colors").head
  }



  //////////////////////////////////////////////
  //                                          //
  //              Default Values              //
  //                                          //
  //////////////////////////////////////////////

  /* Variables */
  var defcolors2	= List("#4dd", "#4cc", "#4bb", "#4aa", "#499", "#488", "#477", "#466", "#455", "#444", "#433", "#422", "#411", "#521", "#631", "#741", "#851", "#961", "#a71", "#b81", "#c91");
  var defcolors		= List("#411","#422","#433","#444","#455","#466","#477","#488","#499","#4aa","#4bb","#4cc","#4dd", "#4dd", "#4cc", "#4bb", "#4aa", "#499", "#488", "#477", "#466", "#455", "#444", "#433", "#422", "#411", "#521", "#631", "#741", "#851", "#961", "#a71", "#b81", "#c91","#4ee","#4ff","#5ff","#6ff","#7ff","#8ff","#9ff","#aff","#CC9911", "#C39011", "#BA8711", "#B17E11", "#A87511", "#9F6C11", "#966311", "#8D5A11", "#845111", "#7B4811", "#723F11", "#693611", "#602D11", "#572411", "#4E1B11", "#441111");
  var colors 		= "25" 
  var method 		= "concat" 
  var depth			= "8" 
  var custom		= "a+b*b"

  /* Colors */
  var kitestart		= "411" 
  var kiteend		= "d70" 
  var dartstart		= "911" 
  var dartend		= "d70" 

  /* Edge */
  var edge			= "off"
  var edgecolor		= "ddd" 
  var edgewidth		= "8" 

  def frontpageTemplate : String = fast"""
<!DOCTYPE HTML>
<html>
  <head>
    <title>Penrose Tilings</title>
    <script type="text/javascript">
      // Echo out the custom function to make it a little faster
      var custom = function(a,b) { return $custom; };
    </script>
    <script type="text/javascript" src="lib/jquery.js"></script>
    <script type="text/javascript" src="lib/jquery.svg.pack.js"></script>
    <script type="text/javascript" src="lib/jquery.svgdom.js"></script>
    <script type="text/javascript" src="lib/jquery-ui-1.8.18.custom.min.js"></script>
    <script type="text/javascript" src="lib/js/colorpicker.js"></script>
    <script type="text/javascript" src="lib/underscore-min.js"></script>
    <script type="text/javascript" src="lib/jquery-svgpan.min.js"></script>
    <script type="text/javascript" src="penrose.js"></script>
    <script type="text/javascript" src="script.js"></script>
    <link rel="icon" type="image/png" href="favicon2.png"/>
    <link type="text/css" rel="stylesheet" href="reset.css"/>	
    <link type="text/css" rel="stylesheet" href="lib/jquery-ui-1.8.18.custom.css"/>	
    <link rel="stylesheet" media="screen" type="text/css" href="lib/css/colorpicker.css" />
    <link type="text/css" rel="stylesheet" href="style.css"/>	
  </head>

  <body>
    <div id="penrose" depth="$depth" colors="$colors" method="$method"></div>

    <div id="control">
      <div id="menu">
        <h2 id="control">Controls</h2>
        <h2 id="use">How to Use</h2>
        <h2 id="about">About</h2>
      </div>



      <div id="usediv" class="content">
        <p>Even if the controls might look a little daunting, they should be 
        fairly intuitive to use. Just play around and see what happens.</p>
        <p>When you've made a nice design, you can either share it as a link, 
        or download it as an svg. If you want to use it as a desktop background, save 
        the svg-file and open the file with <a href="http://inkscape.org/">Inkscape</a> 
        or <a href="http://www.fileinfo.com/extension/svg">One of these</a> to convert 
        it to a png.</p>
        <p>The Detail slider regulates how many times the pattern is 
        recursively repeated, where as the colors slider sets the number of colors used 
        to color the image. The generative function is explained a bit in the About 
        section. You can play around with it, using a and b as variables.</p>
      </div>




      <div id="aboutdiv" class="content">
        <p>If you are curious about Penrose Tilings, wikipedia has a pretty 
        good <a href="http://en.wikipedia.org/wiki/Penrose_tiling" title="Penrose 
        Tiling">Article</a> about it. Outside of being pretty that have some curious 
        properties.</p>
        <p>The pattern is generate by starting with two dart triangles combined to form a rhombe (the fat one of the Penrose rhombes). They are then recursively split 
        into smaller congruent triangles, as demonstrated <a 
        href="http://www.ams.org/samplings/feature-column/fcarc-ribbons" title="A good 
        article about penrose tilings">here</a>.</p>
        <p>The 'Generator' function in the controls is a way to assign a color 
        to each triangle in the pattern. The position of each triangle can be described 
        as a series of numbers. For example a triangle with the position [1, 2, 3], 
        would mean that it is the third child of the second child of the root triangle.  
        The generator takes this position and either sums, multiplies or 
        concatenates the numbers modulus the amount of colors.</p>

        <p>If you are enjoing this site I'd love to hear about it. You can 
        reach me on <a href="mailto:jonas@ifany.org">jonas@ifany.org</a>. You are also 
        welcome to check out my photographies on <a href="http://www.ifany.org" 
        title="Ifany.org">www.ifany.org</a>.</p>

        <p>To construct this site I've used <a 
        href="http://jquery.com/">JQuery</a>, as well as plugins for the <a 
        href="http://www.eyecon.ro/colorpicker">color picker</a>, <a 
        href="http://keith-wood.name/svg.html">svg creation</a> and <a 
        href="http://jqueryui.com/">JQuery UI</a> for the sliders.</p>

        <p class="signature">Jonas Arnfred</p>
      </div>




      <div id="controldiv" class="content">
        <form method="get" action="index.html" onSubmit="return false;">
          <div id="parameters">

            <div id="depthdiv" class="params">
              <div class="paramlabel"><label class="header" for="depth">Amount of detail</label>
              <span class="count">$depth</span></div>
              <select name="depth" class="slide" id="depth">
                ${ 
                  for (i <- 1 to 11) yield {
                    val selected = if (i == depth.toInt) "selected='selected'" else ""
                    val a = "<option " + selected + ">" + i + "</option>"
                    a
                  }.mkString
                }

              </select>
            </div>

            <div id="colorsdiv" class="params">
              <div class="paramlabel"><label class="header" for="colors">Number of colors</label>
              <span class="count">$colors</span></div>
              <select name="colors" class="slide" id="colors">
                ${ 
                  for (i <- 1 to 50) yield {
                    val selected = if (i == colors.toInt) "selected='selected'" else ""
                    "<option " + selected + ">" + i + "</option>"
                  }.mkString
                }
              </select>
            </div>


            <div id="method" class="params">
              <label class="header" for="method">Color Generator</label>
              <span><input type="radio" ${ if (method == "add") "checked" else "" } name="method" class="method" value="add">Add</input></span>
              <span><input type="radio" ${ if (method == "multiply") "checked" else "" } name="method" class="method" value="multiply">Multiply</input></span>
              <span><input type="radio" ${ if (method == "concat") "checked" else "" } name="method" class="method" value="concat">Concat</input></span>
              <span><input type="radio" ${ if (method == "custom") "checked" else "" } name="method" class="method" value="custom" id="customradio" >Custom</input></span>
              <input class="custom" id="custom" type="text" name="custom" value="$custom" /><input id="custombutton" class="custom" type="button" name="set" value="Set" />
            </div>


            <div id="ewdiv" class="params">
              <label class="header" for="e">Edge</label>
              <input id="e" type="checkbox" name="e" ${ if (edge == "on") "checked" else "" } />
              <label for="colorselector">Color</label>
              <div id="edge" class="edge colorselector" style="z-index:4; background-color:#$edgecolor"></div>
              <span class="count">${ (edgewidth.toInt / 10.0).toString }</span>
              <label style="float:right;" for="colorselector">Width</label>
              <select name="ew" class="slide" id="ew">
                ${ 
                  for (i <- 1 to 40) yield {
                    val selected = if (i == edgewidth.toInt) "selected='selected'" else ""
                    "<option " + selected + ">" + i + "</option>"
                  } 
                }.mkString
              </select>
              <input id="edgehidden" type="hidden" value="$edgecolor" name="ec"/>
            </div>


            <div id="colors" class="params">
              <label class="header" id="colorsel">Color Gradient</label>
              <div id="colorheader" class="colorheader">
                <span id="rhombe"></span>
                <span id="type1" class="rhombetype">Kite</span>
                <span id="type2" class="rhombetype">Dart</span>
              </div>

              <div class="colorrow">
                <label>Start</label>
                <div id="startkite" type="kite" class="start colorselector" style="background-color:#$kitestart"></div>
                <div id="startdart" type="dart" class="start colorselector" style="background-color:#$dartstart"></div>
                <input id="startkitehidden" type="hidden" value="$kitestart" name="ks"/>
                <input id="startdarthidden" type="hidden" value="$dartstart" name="ds"/>
              </div>
              <div class="colorrow">
                <label>End</label>
                <div id="endkite" type="kite" class="end colorselector" style="background-color:#$kiteend"></div>
                <div id="enddart" type="dart" class="end colorselector" style="background-color:#$dartend"></div>
                <input id="endkitehidden" type="hidden" value="$kiteend" name="ke"/>
                <input id="enddarthidden" type="hidden" value="$dartend" name="de"/>
              </div>
            </div>

            <div id="download" class="params">
              <label class="header">Share</label>
              <div id="shareLinks">
                <div><a id="downsvg" download="penrose.svg" href="#">Download Svg</a></div>
                <div><a id="link" href="#">Link to Design</a></div>
              </div>
            </div>

          </div>

          <div><span class="hide blah">Hide</span></div>

        </form>
      </div>
    </div>
  </body>

  <script type="text/javascript">

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-380027-3']);
    _gaq.push(['_trackPageview']);

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();

  </script>
</html>
""".toString

// End of plan
}
