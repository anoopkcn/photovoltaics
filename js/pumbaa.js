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

class Draw {
    constructor(canvas) {
        this.margin = (canvas.margin) ? canvas.margin : { top: 60, right: 60, bottom: 60, left: 60 }
        this.canvasId = (canvas.name) ? `#${canvas.name}` : '#dataviz'
        this.width = (canvas.width) ? (canvas.width - this.margin.left - this.margin.right) : (600 - this.margin.left - this.margin.right)
        this.height = (canvas.height) ? (canvas.height - this.margin.top - this.margin.bottom) : (600 - this.margin.top - this.margin.bottom)
        this.viewWidth = (canvas.view.width) ? (canvas.view.width) : this.width
        this.viewHeight = (canvas.view.height) ? (canvas.view.height) : this.height
        this.x
        this.y
    }
    plot(description) {
        this.svg = d3.select(this.canvasId).append("svg")
            .attr('id', 'canvas')
            .attr("viewBox", `0 0 ${this.viewWidth} ${this.viewHeight}`)
            .attr("preserveAspectRatio", "xMinYMin")
            .attr("width", this.viewWidth)
            .attr("height", this.viewHeight)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

        if(description.domain){
            var xMin, xMax, yMin, yMax
            xMin=0;xMax=1;yMin=0;yMax=1
            if (description.domain.x){
                var xDom = description.domain.x
            }else{
                var xDom = [xMin,xMax]
            }
            if (description.domain.y){
                 var yDom = description.domain.y
            }else{
                var yDom = [ymin,yMax]
            }
            this.x = d3.scaleLinear().range([0, this.width]).domain(xDom)
            this.y = d3.scaleLinear().range([this.height, 0]).domain(yDom)
        }
        // var ifData = this.readData(description)
        // var test1
        // ifData.then(function(value) {
        //     test1 = value[0]
        // })
        // console.log(ifData)
        return this.svg

    }
    // async readData(description) {
    //     var data = new Array()
    //     for (let file of description.file) {
    //         data.push(await d3.csv(file, type))
    //     }
    //     return data
    // }
}