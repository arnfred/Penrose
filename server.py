import web
#import random, string
#import os
#import re


# Define urls
urls = (
    '/', 'page',
    '/index', 'page',
)

# Define template
render = web.template.render('templates/')

# Run the app
if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()

# Index page displays start page
class page :
    def GET(self):
        #defcolors2	= ["#4dd", "#4cc", "#4bb", "#4aa", "#499", "#488", "#477", "#466", "#455", "#444", "#433", "#422", "#411", "#521", "#631", "#741", "#851", "#961", "#a71", "#b81", "#c91"]
        #defcolors	= ["#411","#422","#433","#444","#455","#466","#477","#488","#499","#4aa","#4bb","#4cc","#4dd", "#4dd", "#4cc", "#4bb", "#4aa", "#499", "#488", "#477", "#466", "#455", "#444", "#433", "#422", "#411", "#521", "#631", "#741", "#851", "#961", "#a71", "#b81", "#c91","#4ee","#4ff","#5ff","#6ff","#7ff","#8ff","#9ff","#aff","#CC9911", "#C39011", "#BA8711", "#B17E11", "#A87511", "#9F6C11", "#966311", "#8D5A11", "#845111", "#7B4811", "#723F11", "#693611", "#602D11", "#572411", "#4E1B11", "#441111"]
        colors 		= "25"
        method 		= "concat"
        depth		= "8"
        custom		= "a+b*b"

        kitestart	= "411"
        kiteend		= "d70"
        dartstart	= "911"
        dartend		= "d70"

        edge		= "off"
        edgecolor	= "ddd"
        edgewidth	= "8"
        d = web.input(colors = colors,
                      method = method,
                      depth = depth,
                      custom = custom,
                      ks = kitestart,
                      ke = kiteend,
                      ds = dartstart,
                      de = dartend,
                      e = edge,
                      ec = edgecolor,
                      ew = edgewidth)

        return render.main(d)


