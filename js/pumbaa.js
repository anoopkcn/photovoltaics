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
                String.raw `${laTex[i].replace(/\$/g, "")}`, {
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
function resize(id) {
    $(window).resize(function() {
        var chart = $(id)
        var targetWidth = chart.parent().width();
        var aspect = chart.width() / chart.height();
        chart.attr("width", targetWidth);
        chart.attr("height", Math.round(targetWidth / aspect));
    });
};

/**
 * build a color list
 * @param  {strin} specifier sring with hex colors without the # and space between them
 * @return {array}           an array of all the colors
 */
function colors(specifier) {
    var n = specifier.length / 6 | 0,
        colors = new Array(n),
        i = 0;
    while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
};