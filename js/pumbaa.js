// this files depend on "jquery-3.4.0.min.js" and "d3.v5.min.js"
//load them upon calling these functions

/**
 * Returns LaTex formatted string
 */
String.prototype.toTex = function() {
  var laTexRegex = /\$\$(.*?)\$\$|\$(.*?)\$/g;
  var laTex = this.match(laTexRegex);
  if (laTex) {
    var tex = this;
    for (let i = 0; i < laTex.length; i++) {
      laTexHtml = katex.renderToString(
        String.raw`${laTex[i].replace(/\$/g, "")}`,
        {
          throwOnError: false
        }
      );
      tex = tex.replace(laTex[i], laTexHtml);
    }
    return tex;
  } else {
    return this;
  }
};

/**
 * adapt graph according to the window resize
 * @type {jQuery auto load function}
 */
function resize(id){
    $(window).resize(function() {
        var chart = $(id)
        var targetWidth = chart.parent().width();
        var aspect = chart.width() / chart.height();
        chart.attr("width", targetWidth);
        chart.attr("height", Math.round(targetWidth / aspect));
    });
}
