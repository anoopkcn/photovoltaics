// const d3 = require('./d3.js')
/**
 * Initial setup
 * @type for canvas and svg area
 */
console.log($('.dataviz').width())
var margin = { top: 10, right: 60, bottom: 60, left: 60 };
var settings = 0;
var widthFull = 1100;
var heightFull = 700;
var width = widthFull - settings - margin.left - margin.right;
var height = heightFull - margin.top - margin.bottom;

// Add an SVG element with the desired dimensions and margin.
var svg = d3.select("#dataviz").append("svg")
    .attr('id', 'chart')
    .attr("viewBox", `0 0 ${widthFull} ${heightFull}`)
    .attr("preserveAspectRatio", "xMinYMin")
    .attr("width", width + margin.left + margin.right + settings)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// scale, width and height of axis
var x = d3.scaleLinear().range([0, width])
var y = d3.scaleLinear().range([height, 0])

var chart = $("#chart");
var aspect = chart.width() / chart.height();
var container = chart.parent();

$(window).resize(function() {
    var targetWidth = container.width();
    chart.attr("width", targetWidth);
    chart.attr("height", Math.round(targetWidth / aspect));
});
/**
 * setup for axis and ticks
 * @return {svg} 
 */
var emin, emax, kmax, kmin;
const draw = async function() {
    var MAPI = await d3.csv("viz/band_test2.csv", type) //draw(MAPI, '#7EA34F', 'MAPI')
    var PI = await d3.csv("viz/band_test.csv", type) //draw(MAPI, '#7EA34F', 'MAPI')

    kmin = Math.min(d3.min(MAPI, d => d.k), d3.min(PI, d => d.k))
    kmax = Math.max(d3.max(MAPI, d => d.k), d3.max(PI, d => d.k))
    emax = 5
    emin = -9

    var hSym = [
        { 'x': 0.00000, 'T': '$\\Gamma$'.toTex() },
        { 'x': 0.45562, 'T': '$R$'.toTex() },
        { 'x': 0.82763, 'T': '$X$'.toTex() },
        { 'x': 1.09068, 'T': '$M$'.toTex() },
        { 'x': 1.46269, 'T': '$\\Gamma$'.toTex() },
        { 'x': 1.72574, 'T': '$X$'.toTex() }
    ]

    x.domain([kmin, kmax])
    y.domain([emin, emax])

    // Add the x-axis at bottom of the page
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(d3.axisBottom(x).tickValues(hSym.map((d) => d.x)).tickFormat((d) => '').tickSize(-height))

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + 0 + ",0)")
        .call(d3.axisLeft(y).ticks(7).tickSize(-5)); //.

    var tx = -7;
    var ty = 10;
    var tw = 50;
    var th = 50;

    svg.append("g")
        .call(x)
        .selectAll("g").data(hSym).enter().append("foreignObject")
        .attr('class', 'xTicks')
        .attr("transform", "translate(0," + (height) + ")")
        .attr("width", tw)
        .attr("height", th)
        .attr("x", (d) => x(d.x) + tx)
        .attr("y", ty)
        .html(function(d) { return d.T })

    svg.append('line')
        .attr('class', 'zeroline')
        .attr('x1', x(kmin))
        .attr('y1', y(0))
        .attr('x2', x(kmax))
        .attr('y2', y(0))
        .style("stroke-dasharray", ("3, 3"))

    // trace( data, style )

    styleMAPI = {
        'name': 'MAPI',
        'line': {
            'color': '#a6cee3',
            'width': 4,
            'opacity': 1,
        },
    }

    stylePI = {
        'name': 'PI',
        'line': {
            'color': '#1f78b4',
            'width': 4,
            'opacity': 1
        }
    }

    trace(MAPI, styleMAPI)
    trace(PI, stylePI)

    // add the x-axis at top of the page
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0,-1)")
        .call(d3.axisTop(x).tickValues(hSym.map((d) => d.x)).tickFormat((d) => '').tickSize(-5))

    // add the y-axis at right of the page
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + (width) + ",0)")
        .call(d3.axisRight(y).ticks(7).tickSize(-5).tickFormat((d) => ''))
}

draw()

function trace(data, style) {
    // var bandGroup = ['MAPI', 'PI']
    // var bandColor = d3.scaleOrdinal()
    //     .domain(bandGroup).range(d3.schemePaired);
    //     console.log(bandColor(style.name))

    var line = d3.line().defined(function(d, i) {
        var next = 0
        var dataSize = data.length
        if (i < dataSize - 1) {
            next = data[i + 1].k
            return d.k <= next && d.e >= emin && d.e <= emax;
        }
    });

    line.x(d => x(d.k))
    line.y(d => y(d.e))

    if (style.line) {
        svg.selectAll('band')
            .data([data]).enter().append("path")
            .attr("class", "line")
            .attr('id', style.name)
            .attr('stroke', style.line.color) //d => bandColor(style.name)
            .attr("stroke-width", style.line.width)
            .attr("opacity", style.line.opacity)
            .attr("fill", 'none')
            .attr("d", line);
    }

    if (style.marker) {
        svg.selectAll('dot').data(data.filter(function(d, i) {
                return d.e >= emin && d.e <= emax
            }))
            .enter().append('circle')
            .attr('class', 'dots')
            .attr('id', style.name)
            // .on("mouseover", mouseover)
            // .on("mousemove", mousemove)
            // .on("mouseleave", mouseleave)
            .attr('r', style.marker.r)
            .attr('cx', d => x(d.k))
            .attr('cy', d => y(d.e))
            .attr('fill', style.marker.color)
            .attr("opacity", style.marker.opacity)
    }
}

function legend(names, colors, x_pos, ids) {

}

// helper functions
function type(d) {
    d.k = +d.k;
    d.e = +d.e;
    return d;
}
var f = d3.format(".2f")
// create a tooltip
var Tooltip = d3.select("#dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
    Tooltip.style("opacity", 1)
    d3.select(this)
        .attr('r', 6)
}

var mousemove = function(d) {
    bgColor = d3.select(this).attr("fill")
    symbol = d3.select(this).attr("id") //'MAPI'
    Tooltip.attr("alignment-baseline", "middle")
        .html(
            `<div id='tooltip-left' style="background:${bgColor}">` +
            f(d.e) +
            `</div><div id='tooltip-right' style="color:${bgColor}">` +
            symbol + `</div>`
        )
        .style("left", (d3.mouse(this)[0] + 40) + "px")
        .style("top", (d3.mouse(this)[1] + 60) + "px")
}

var mouseleave = function(d) {
    Tooltip.style("opacity", 0)
    d3.select(this).attr('r', 2)
}