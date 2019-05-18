// const d3 = require('./d3.js')
/**
 * Initial setup
 * @type for canvas and svg area
 */
var margin = { top: 10, right: 60, bottom: 60, left: 60 };
var settings = 200;
var widthFull = 1100;
var heightFull = 650;
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
    var MAPI = await d3.csv("viz/band_MAPI.csv", type)
    // console.log(MAPI)


    var PI = await d3.csv("viz/band_test.csv", type)

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

    var tx = -20;
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
            'opacity': 0,
        },
        'orbital': {
            'atomIndex': [3, 4, 5, 11, 12],
            'atomType': ['C', 'N', 'H', 'Pb', 'I'],
            'mode': 'dot',
            'opacity':0.7
            // 'mode': 'line' //TODO
        },
        'marker': {
            'color': 'red'
        },
        'legend': {
            'name': '$CH_3NH_3PbI_3$'.toTex(),
            'marker': 'rect',
            'x': width + 10,
            'y': margin.top + 40,
            'width': 20,
        }
    }

    stylePI = {
        'name': 'PI',
        'line': {
            'color': '#1f78b4',
            'width': 4,
            'opacity': 1
        },
        'legend': {
            'name': '$PbI_3^-$'.toTex(),
            'marker': 'rect',
            'x': width + 10,
            'y': margin.top,
            'width': 20,
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
            // .attr("class", "line")
            .attr('class', style.name)
            .attr('stroke', style.line.color) //d => bandColor(style.name)
            .attr("stroke-width", style.line.width)
            .attr("opacity", style.line.opacity)
            .attr("fill", 'none')
            .attr("d", line);
    }

    
    if (style.orbital) {
        atoms = []
        for (let iatom of style.orbital.atomIndex) {
            atoms.push(data.columns[iatom])
        }
        var atomColor = d3.scaleOrdinal().domain(atoms).range(d3.schemeSet1);
        // console.log(atoms)
        for (let Z of atoms) {
            svg.selectAll('dot').data(data.filter(function(d, i) {
                    return d.e >= emin && d.e <= emax
                }))
                .enter().append('circle')
                .attr('class', `atom-${Z}`)
                // .on("mouseover", mouseover)
                // .on("mousemove", mousemove)
                // .on("mouseleave", mouseleave)
                .attr('r', d => { if (d[`${Z}`] > 0.001) { return d[`${Z}`] * 8 } else { return 0 } })
                .attr('cx', d => x(d.k))
                .attr('cy', d => y(d.e))
                .attr('fill', atomColor(`${Z}`))
                .attr("opacity", style.orbital.opacity);
                console.log(`.atom-${Z}`)
        }
        subLabelMarker(atoms, style.legend.x, style.legend.y + 40, style.legend.width)
    }

    // add legend
    if (style.legend) {
        labelMarker(style.legend.marker, style.legend.x, style.legend.y, style.legend.width)
        label(style.legend.x + style.legend.width + 10, style.legend.y + style.legend.width - 20, style.legend.name)
    }


    function labelMarker(marker, x, y, r) {
        if (marker == 'rect') {
            svg.append("rect")
                .attr('class', `lm-${style.name}`)
                .attr("x", x)
                .attr("y", y)
                .attr("width", r)
                .attr("height", r)
                .attr("fill", style.line.color)
                .attr('opacity', d => style.line.opacity == 0 ? 0.2 : style.line.opacity)
                .style('cursor', 'pointer')
                .on("click", function(d) {
                    currentOpacity = d3.selectAll("." + style.name).style("opacity")
                    d3.selectAll("." + style.name).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

                    labelMarkerOpacity = d3.selectAll(`.lm-${style.name}`).style("opacity")
                    d3.selectAll(`.lm-${style.name}`).transition().style("opacity", labelMarkerOpacity == 1 ? 0.2 : 1)

                })
        } else if (marker = 'dot') {
            svg.append("circle")
                .attr('id', `lm-${style.name}`)
                .attr("r", (r / 2))
                .attr("cx", x)
                .attr("cy", y)
                .attr("fill", style.line.color)
                .attr('opacity', style.line.opacity)
                .style('cursor', 'pointer')
        }
    }


    // label text
    function label(x, y, labeltext) {
        svg.append("foreignObject")
            .attr("class", `lm-${style.name}`)
            .attr("width", 150)
            .attr("height", 30)
            .attr("x", x)
            .attr("y", y)
            .style("color", style.line.color)
            .style("opacity", style.line.opacity)
            .style('font-size', '16px')
            .style('text-align', 'left')
            .style('cursor', 'pointer')
            .html(labeltext)
        // .on("click",function(d){

        // })

    }

    // if (style.orbital) {  }

    function subLabelMarker(atoms, x, y, r) {
        let j=0
        for (let i of atoms) {
            svg.append("rect")
                .attr('class', `slm-${i}`)
                .attr("x", (x + j * 50))
                .attr("y", y)
                .attr("width", (r / 1.5))
                .attr("height", (r / 1.5))
                .attr("fill", atomColor(`${i}`))
                .attr('opacity', style.orbital.opacity)
                .style('cursor', 'pointer')
                .on("click", function(d) {
                    currentOpacity = d3.selectAll(`.atom-${i}`).style("opacity")
                    console.log(`.atom-${i}`)
                    d3.selectAll(`.atom-${i}`).transition().style("opacity", currentOpacity == style.orbital.opacity ? 0 : style.orbital.opacity)

                    labelMarkerOpacity = d3.selectAll(`.slm-${i}`).style("opacity")
                    d3.selectAll(`.slm-${i}`).transition().style("opacity", labelMarkerOpacity == style.orbital.opacity ? 0.2 : style.orbital.opacity)

                })
            // console.log(i)
            svg.append("foreignObject")
                .attr("class", `slm-${i}`)
                .attr("width", 40)
                .attr("height", 30)
                .attr("x", (x+20 + j * 50))
                .attr("y", y-2)
                .style("color", atomColor(i))
                .style("opacity", style.orbital.opacity)
                .style('font-size', '16px')
                .style('text-align', 'left')
                .style('cursor', 'pointer')
                .html(style.orbital.atomType[j]);

                j=j+1
        }
    }
}

// helper functions
function type(d) {
    d.k = +d.k;
    d.e = +d.e;
    // d.Z11 = +d.Z11;
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