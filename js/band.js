// const d3 = require('./d3.js')
/**
 * Initial setup
 * @type for canvas and svg area
 */
var margin = { top: 60, right: 60, bottom: 60, left: 60 };
var widthInfo = 200;
var widthFull = 1100;
var heightFull = 650;
var width = widthFull - widthInfo - margin.left - margin.right;
var height = heightFull - margin.top - margin.bottom;

// Add an SVG element with the desired dimensions and margin.
var svg = d3.select("#dataviz").append("svg")
    .attr('id', 'chart')
    .attr("viewBox", `0 0 ${widthFull} ${heightFull}`)
    .attr("preserveAspectRatio", "xMinYMin")
    .attr("width", width + margin.left + margin.right + widthInfo)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// scale, width and height of axis
var x = d3.scaleLinear().range([0, width])
var y = d3.scaleLinear().range([height, 0])

resize('#chart')

/**
 * adapt graph according to the window resize
 * @type {jQuery auto load function}
 */
// $(window).resize(function() {
//     var chart = $("#chart")
//     var targetWidth = chart.parent().width();
//     var aspect = chart.width() / chart.height();
//     chart.attr("width", targetWidth);
//     chart.attr("height", Math.round(targetWidth / aspect));
// });

/**
 * setup for axis and ticks
 * @return {svg} 
 */
var emin, emax, kmax, kmin;

const draw = async function() {
    var MAPI = await d3.csv("viz/band.csv", type)
    var PI = await d3.csv("viz/band_test.csv", type)

    kmin = Math.min(d3.min(MAPI, d => d.k), d3.min(PI, d => d.k))
    kmax = Math.max(d3.max(MAPI, d => d.k), d3.max(PI, d => d.k))
    emax = 5
    emin = -9

    var hSym = [
        { 'x': 0.00000, 'label': '$\\Gamma$'.toTex() },
        { 'x': 0.45562, 'label': '$R$'.toTex() },
        { 'x': 0.82763, 'label': '$X$'.toTex() },
        { 'x': 1.09068, 'label': '$M$'.toTex() },
        { 'x': 1.46269, 'label': '$\\Gamma$'.toTex() },
        { 'x': 1.72574, 'label': '$X$'.toTex() }
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
        .html(function(d) { return d.label })

    svg.append('line')
        .attr('class', 'zeroline')
        .attr('x1', x(kmin))
        .attr('y1', y(0))
        .attr('x2', x(kmax))
        .attr('y2', y(0))
        .style("stroke-dasharray", ("6, 1"))

    // trace( data, style )

    styleMAPI = {
        'name': 'MAPI',
        'line': {
            'color': '#a6cee3',
            'width': 4,
            'opacity': 0,
        },
        'marker': {
            'color': 'red'
        },
        'dos': {
            'cols': [1, 2, 5, 6, 7, 12, 13],
            'color': ['#cccccc', '#aaaaaa', '#984EA4', '#FE7F00', '#F782BF', '#4DAF4A', '#E41B1B'],
        },
        'legend': {
            'name': '$CH_3NH_3PbI_3$'.toTex(),
            'marker': 'rect',
            'x': width + 10,
            'y': margin.top + 40,
            'width': 20,
        },
        'orbital': {
            'atomIndex': [3, 4, 8, 11, 12],
            'atomType': ['C', 'N', 'H', 'Pb', 'I'],
            'atomColor': ['#984EA4','#FE7F00', '#F782BF', '#4DAF4A', '#E41B1B'],
            'mode': 'dot',
            'opacity':0
            // 'mode': 'line' //TODO
        },
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

    if (style.dos) {
        d3.csv("viz/dos.csv", type_dos).then(function(dosdata) { dos(dosdata); })

        function dos(dosdata) {
            lCharge = []
            for (let il of style.dos.cols) {
                lCharge.push(dosdata.columns[il])
            }
            var lColor = d3.scaleOrdinal().domain(lCharge).range(style.dos.color);
            // console.log(dosdata.columns.slice(17))
            var xDos = d3.scaleLinear().range([0, widthInfo]) //energy
            var yDos = d3.scaleLinear().range([height, 0]) //pdos
            xDos.domain([0, d3.max(dosdata, d => d.tDOS)])
            yDos.domain([emin, emax])
            // Add the x-axis at left of widthinfo
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(" + (width + widthInfo) + ",0)")
                .call(d3.axisRight(yDos).ticks(7).tickSize(-5).tickFormat((d) => ''));


            // Add the y-axis.
            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", "translate(" + width + "," + height + ")")
                .call(d3.axisBottom(xDos).tickFormat((d) => '').tickSize(0))

            // add the x-axis at top of the page
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(" + width + ",-1)")
                .call(d3.axisTop(xDos).tickFormat((d) => '').tickSize(0))

            for (let Z of lCharge) {
                var dosline = d3.line().defined(function(d) { return d.e >= emin && d.e <= emax })
                    .x(d => xDos(d[`${Z}`]))
                    .y(d => yDos(d.e));
                var dosarea = d3.area().defined(function(d) { return d.e >= emin && d.e <= emax })
                    .x(d => xDos(d[`${Z}`]))
                    .y1(d => yDos(d.e))
                // .y0(widthInfo)

                if (`${Z}` == 'tDOS') {
                    svg.selectAll('tdos')
                        .data([dosdata]).enter().append("path")
                        .attr("transform", "translate(" + width + ",0)")
                        .attr('class', 'tdos')
                        .attr('stroke', lColor(`${Z}`)) //d => bandColor(style.name)
                        .attr("stroke-width", (style.line.width / 2))
                        .attr("opacity", 0.5)
                        .attr("fill", lColor(`${Z}`))
                        .attr("d", dosarea);
                } else {
                    svg.selectAll('dos')
                        .data([dosdata]).enter().append("path")
                        .attr("transform", "translate(" + width + ",0)")
                        .attr('class', 'dos')
                        .attr('stroke', lColor(`${Z}`)) //d => bandColor(style.name)
                        .attr("stroke-width", (style.line.width / 2))
                        .style("stroke-dasharray", (d=>{return `${Z}`=='inter' ? ("1, 1") : 'none'}))
                        .attr("opacity", 1)
                        .attr("fill", 'none')
                        .attr("d", dosline);
                }
            }
        }

    }

    if (style.orbital) {
        atoms = []
        for (let iatom of style.orbital.atomIndex) {
            atoms.push(data.columns[iatom])
        }
        var atomColor = d3.scaleOrdinal().domain(atoms).range(style.orbital.atomColor);
        // console.log(atoms)
        for (let Z of atoms) {
            svg.selectAll('dot').data(data.filter(function(d, i) {
                    return d.e >= emin && d.e <= emax
                }))
                .enter().append('circle')
                .attr('class', `atom-${Z}`)
                .attr('id', 'orbital')
                // .on("mouseover", mouseover)
                // .on("mousemove", mousemove)
                // .on("mouseleave", mouseleave)
                .attr('r', d => { if (d[`${Z}`] > 0.001) { return d[`${Z}`] * 8 } else { return 0 } })
                .attr('cx', d => x(d.k))
                .attr('cy', d => y(d.e))
                .attr('fill', atomColor(`${Z}`))
                .attr("opacity", style.orbital.opacity);
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
            .on("click", function(d) {
                if (style.orbital) {
                    currentOpacity = d3.selectAll("#orbital").style("opacity")
                    d3.selectAll("#orbital").transition().style("opacity", currentOpacity == 0.7 ? 0 : 0.7)
                }
            })

    }

    // if (style.orbital) {  }
    // console.log(colors('1f77b4ff7f0e'))

    function subLabelMarker(atoms, x, y, r) {
        let j = 0
        for (let i of atoms) {
            svg.append("rect")
                .attr('class', `slm-${i}`)
                .attr('id', 'orbital')
                .attr("x", (x + j * 40))
                .attr("y", y)
                .attr("width", (r / 1.5))
                .attr("height", (r / 1.5))
                .attr("fill", atomColor(`${i}`))
                .attr('opacity', style.orbital.opacity)
                .style('cursor', 'pointer')
                .on("click", function(d) {
                    currentOpacity = d3.selectAll(`.atom-${i}`).style("opacity")
                    console.log(`.atom-${i}`)
                    d3.selectAll(`.atom-${i}`).transition().style("opacity", currentOpacity == 0.7 ? 0 : 0.7)

                    labelMarkerOpacity = d3.selectAll(`.slm-${i}`).style("opacity")
                    d3.selectAll(`.slm-${i}`).transition().style("opacity", labelMarkerOpacity == 0.7 ? 0.2 : 0.7)

                })
            // console.log(i)
            svg.append("foreignObject")
                .attr("class", `slm-${i}`)
                .attr('id', 'orbital')
                .attr("width", 40)
                .attr("height", 30)
                .attr("x", (x + 15 + j * 40))
                .attr("y", y - 2)
                .style("color", atomColor(i))
                .style("opacity", style.orbital.opacity)
                .style('font-size', '16px')
                .style('text-align', 'left')
                .style('cursor', 'pointer')
                .html(style.orbital.atomType[j]);

            j = j + 1
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

function type_dos(d) {
    d.e = +d.e;
    d.tDOS = +d.tDOS;
    return d;
}
// function colors(specifier) {
//   var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
//   while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
//   return colors;
// }

var fmt = (a) => d3.format(a)
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
            fmt(".2f")(d.e) +
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