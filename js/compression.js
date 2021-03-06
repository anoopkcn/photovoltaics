var canvas = {
    'name': 'compression',
    'view': { 'width': 1000, 'height': 650 },
    'width': 1000,
    'height': 650,
    'margin': { 'top': 60, 'right': 60, 'bottom': 60, 'left': 60 },
    'resize': true
}

var data = {
    'file': ['band.csv', 'band_test.csv'],
    'select': { 'x': 1, 'y': 2 }, //colums as x axis and y axis
    'scale': 'linear',
    // 'range': {'x':[0, canvas.width], 'y':[canvas.height,0]},
    'domain': { 'x': [0, 0.82763], 'y': [-4, 5] }
}

var style = {
    'style': [{
            'name': 'MAPI0',
            'file': "viz/compression/band_1_06.csv",
            'line': {
                'color': '#d3e9f8',
                'width': 4,
                'opacity': 1
            },
            'legend': {
                'name': '1.06',
                'marker': 'rect',
                'x': 0,
                'y': -30,
                'width': 20,
            },
        },
        {
            'name': 'MAPI1',
            'file': "viz/compression/band_1_04.csv",
            'line': {
                'color': '#a8d3f0',
                'width': 4,
                'opacity': 0,
            },
            'marker': {
                'color': 'red'
            },
            'legend': {
                'name': '1.04',
                'marker': 'rect',
                'x': 100,
                'y': -30,
                'width': 20,
            },
        },
        {
            'name': 'MAPI2',
            'file': "viz/compression/band_1_02.csv",
            'line': {
                'color': '#7cbde9',
                'width': 4,
                'opacity': 0,
            },
            'marker': {
                'color': 'red'
            },
            'legend': {
                'name': '1.02',
                'marker': 'rect',
                'x': 200,
                'y': -30,
                'width': 20,
            },
        },
        {
            'name': 'MAPI3',
            'file': "viz/compression/band_1_00.csv",
            'line': {
                'color': '#51a7e1',
                'width': 4,
                'opacity': 0,
            },
            'marker': {
                'color': 'red'
            },
            'legend': {
                'name': '1.00',
                'marker': 'rect',
                'x': 300,
                'y': -30,
                'width': 20,
            },
        },
        {
            'name': 'MAPI4',
            'file': "viz/compression/band_0_98.csv",
            'line': {
                'color': '#2592da',
                'width': 4,
                'opacity': 0,
            },
            'marker': {
                'color': 'red'
            },
            'legend': {
                'name': '0.98',
                'marker': 'rect',
                'x': 400,
                'y': -30,
                'width': 20,
            },
        },
        {
            'name': 'MAPI5',
            'file': "viz/compression/band_0_96.csv",
            'line': {
                'color': '#1f78b4',
                'width': 4,
                'opacity': 0,
            },
            'marker': {
                'color': 'red'
            },
            'legend': {
                'name': '0.96',
                'marker': 'rect',
                'x': 500,
                'y': -30,
                'width': 20,
            },
        },
        {
            'name': 'MAPI6',
            'file': "viz/compression/band_0_94.csv",
            'line': {
                'color': '#1a6699',
                'width': 4,
                'opacity': 0,
            },
            'marker': {
                'color': 'red'
            },
            'legend': {
                'name': '0.94',
                'marker': 'rect',
                'x': 600,
                'y': -30,
                'width': 20,
            },
        }
    ]

}

// resize("#canvas")
pumba = new Draw(canvas)
svg = pumba.plot(data)
var x = pumba.x
var y = pumba.y

/**
 * setup for axis and ticks
 * @return {svg} 
 */
const draw_compression = async function(style) {
    // kmin = Math.min(d3.min(MAPI, d => d.k), d3.min(PI, d => d.k))
    // kmax = Math.max(d3.max(MAPI, d => d.k), d3.max(PI, d => d.k))

    var hSym = [
        { 'x': 0.00000, 'label': '$\\Gamma$'.toTex() },
        { 'x': 0.45562, 'label': 'R' },
        { 'x': 0.82763, 'label': 'X' },
        { 'x': 1.09068, 'label': 'M' },
        { 'x': 1.46269, 'label': '$\\Gamma$'.toTex() },
        { 'x': 1.71100, 'label': 'X' }
    ]
    // Add the x-axis at bottom of the page
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + (pumba.height) + ")")
        .call(d3.axisBottom(x).tickValues(hSym.map((d) => d.x)).tickFormat((d) => '').tickSize(-pumba.height))

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + 0 + ",0)")
        .call(d3.axisLeft(y).ticks(5).tickSize(-10));

    var tx = -5;
    var ty = 10;
    var tw = 50;
    var th = 50;

    svg.append("g")
        .call(x)
        .selectAll("g").data(hSym).enter().append("foreignObject")
        .attr('class', 'xTicks')
        .attr("transform", "translate(0," + (pumba.height) + ")")
        .attr("width", tw)
        .attr("height", th)
        .attr("x", (d) => x(d.x) + tx)
        .attr("y", ty)
        .html(function(d) { return d.label })

    svg.append('line')
        .attr('class', 'zeroline')
        .attr('x1', x(pumba.x.domain()[0]))
        .attr('y1', y(0))
        .attr('x2', x(pumba.x.domain()[1]))
        .attr('y2', y(0))
        .style("stroke-dasharray", ("6, 1"))

    // add the x-axis at top of the page
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0,-1)")
        .call(d3.axisTop(x).tickValues(hSym.map((d) => d.x)).tickFormat((d) => '').tickSize(-5))

    // // add the y-axis at right of the page
    // svg.append("g")
    //     .attr("class", "y-axis")
    //     .attr("transform", "translate(" + (pumba.width) + ",0)")
    //     .call(d3.axisRight(y).ticks(7).tickSize(-5).tickFormat((d) => ''))

    svg.append("foreignObject")
        .attr("class", 'y-label')
        .attr("width", 150)
        .attr("height", 130)
        .attr("x", (-1 * pumba.height / 1.75))
        .attr("y", -60)
        .style("color", 'black')
        .style('font-size', '16px')
        .style('text-align', 'left')
        .style('cursor', 'pointer')
        .html('$E - E_F$ $(eV)$'.toTex())
        .attr("transform", "rotate(-90)")

    for (i = 0; i < style.style.length; i++) {
        var data = await d3.csv(style.style[i].file, type)
        trace(data, style.style[i])
        legend(data, style.style[i])
    }
}

draw_compression(style)

function trace(data, style) {
    var band = d3.nest() // nest based on bandindex
        .key(function(d) { return d[`${data.columns[0]}`] })
        .entries(data)

    var line = d3.line().defined(function(d, i) {
        return d.e >= pumba.y.domain()[0] && d.e <= pumba.y.domain()[1] && d.k <= pumba.x.domain()[1]
    }).x(d => x(d.k)).y(d => y(d.e))

    if (style.line) {
        svg.selectAll('band')
            .data(band.slice(37, 43)).enter().append("path") //slice(39,42)
            .attr('class', style.name)
            .attr('stroke', style.line.color) //d => bandColor(style.name)
            .attr("stroke-width", style.line.width)
            .attr("opacity", style.line.opacity)
            .attr("fill", 'none')
            .attr("d", d => line(d.values));
    }
}

function legend(data, style) {
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
}


// helper functions
function type(d) {
    d.k = +d.k;
    d.e = +d.e;
    // d.Z11 = +d.Z11;
    return d;
}
var fmt = (a) => d3.format(a)