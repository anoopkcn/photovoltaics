// this files depend on "jquery-3.4.0.min.js" and "d3.v5.min.js"
//load them upon calling these functions
function test(arg) {
  console.log(arg)
}

// test("hello")

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