var canvas = {
    'name': 'dataviz',
    'view': { 'width': 1100, 'height': 650 },
    'width': 900,
    'height': 650,
    'margin': { 'top': 60, 'right': 60, 'bottom': 60, 'left': 60 },
    'resize': true
}

var data = {
    'file': ['band.csv', 'band_test.csv'],
    'select': {'x':1, 'y':2}, //colums as x axis and y axis
    'scale': 'linear',
    // 'range': {'x':[0, canvas.width], 'y':[canvas.height,0]},
    'domain': { 'x':[0, 1.710], 'y': [-9, 5] }
}

var style={
    //'style':['styleMAPI', 'stylePI']
    'style':[
        {
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
                'file':'viz/dos_MAPI.csv',
                'cols': [1, 2, 5, 6, 7, 13, 14],
                'color': ['rgba(221, 221, 221, 0.4)', '#aaaaaa', '#984EA4', '#FE7F00', '#F782BF', '#4DAF4A', '#E41B1B'],
                'opacity':0
            },
            'legend': {
                'name': '$CH_3NH_3PbI_3$'.toTex(),
                'marker': 'rect',
                'x': 200,
                'y': -30,
                'width': 20,
            },
            'orbital': {
                'atomIndex': [3, 4, 5, 11, 12],
                'atomType': ['C', 'N', 'H', 'Pb', 'I'],
                'atomColor': ['#984EA4', '#FE7F00', '#F782BF', '#4DAF4A', '#E41B1B'],
                'dosorbital': [' - 2p',' - 2p',' - 1s',' - 6p',' - 5p'],
                'mode': 'dot',
                'opacity': 0,
                // 'mode': 'line' //TODO
            },
        },
        {
            'name': 'PI',
            'line': {
                'color': '#1f78b4',
                'width': 4,
                'opacity': 1
            },
            'legend': {
                'name': '$PbI_3^-$'.toTex(),
                'marker': 'rect',
                'x': 10,
                'y': -30,
                'width': 20,
            },
            'orbital': false,
            'dos': {
                'file':'viz/dos_PI.csv',
                'cols': [1],
                'color': ['rgba(221, 221, 221, 0.4)'],
                'opacity':1
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
const draw = async function() {
    var MAPI = await d3.csv("viz/band_MAPI.csv", type)
    var PI = await d3.csv("viz/band_PI.csv", type)

    // kmin = Math.min(d3.min(MAPI, d => d.k), d3.min(PI, d => d.k))
    // kmax = Math.max(d3.max(MAPI, d => d.k), d3.max(PI, d => d.k))
    // emax = 5
    // emin = -9

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
        .call(d3.axisLeft(y).ticks(7).tickSize(-10));

    var tx = -25;
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

    // trace( data, style )

    // console.log(style)
    trace(MAPI, style.style[0])
    trace(PI, style.style[1])
    legend(MAPI, style.style[0])
    legend(PI, style.style[1])


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
            .attr("x",(-1*pumba.height/1.75))
            .attr("y",-60)
            .style("color", 'black')
            .style('font-size', '16px')
            .style('text-align', 'left')
            .style('cursor', 'pointer')
            .html('$E - E_F$ $(eV)$'.toTex())
            .attr("transform", "rotate(-90)")
}

draw()

function trace(data, style) {
    var line = d3.line().defined(function(d, i) {
        var next = 0
        var dataSize = data.length
        if (i < dataSize - 1) {
            next = data[i + 1].k
            return d.k <= next && d.e >= pumba.y.domain()[0] && d.e <= pumba.y.domain()[1];
        }
    }).x(d => x(d.k)).y(d => y(d.e))

    if (style.line) {
        svg.selectAll('band')
            .data([data]).enter().append("path")
            .attr('class', style.name)
            .attr('stroke', style.line.color) //d => bandColor(style.name)
            .attr("stroke-width", style.line.width)
            .attr("opacity", style.line.opacity)
            .attr("fill", 'none')
            .attr("d", line);
    }

    if (style.dos) {
        d3.csv(style.dos.file, type_dos).then(function(dosdata) { dos(dosdata); })

        function dos(dosdata) {
            lCharge = new Array()
            for (let il of style.dos.cols) {
                lCharge.push(dosdata.columns[il])
            }
            var lColor = d3.scaleOrdinal().domain(lCharge).range(style.dos.color);
            // console.log(dosdata.columns.slice(17))
            var xDos = d3.scaleLinear().range([0, (pumba.viewWidth - pumba.width - pumba.margin.left - pumba.margin.right)]) //energy
            var yDos = d3.scaleLinear().range([pumba.height, 0]) //pdos
            xDos.domain([0, d3.max(dosdata, d => d.tDOS)])
            yDos.domain([pumba.y.domain()[0], pumba.y.domain()[1]])
            // Add the x-axis at left of widthinfo
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(" + (pumba.viewWidth - pumba.margin.right - pumba.margin.left) + ",0)")
                .call(d3.axisRight(yDos).ticks(7).tickSize(-5).tickFormat((d) => ''));


            // Add the y-axis.
            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", "translate(" + pumba.width + "," + pumba.height + ")")
                .call(d3.axisBottom(xDos).tickFormat((d) => '').tickSize(0))

            // add the x-axis at top of the page
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(" + pumba.width + ",-1)")
                .call(d3.axisTop(xDos).tickFormat((d) => '').tickSize(0))

            for (let Z of lCharge) {
                var dosline = d3.line().defined(function(d) { return d.e >= pumba.y.domain()[0] && d.e <= pumba.y.domain()[1] })
                    .x(d => xDos(d[`${Z}`]))
                    .y(d => yDos(d.e));
                var dosarea = d3.area().defined(function(d) { return d.e >= pumba.y.domain()[0] && d.e <= pumba.y.domain()[1] })
                    .x(d => xDos(d[`${Z}`]))
                    .y1(d => yDos(d.e))
                // .y0(widthInfo)

                if (`${Z}` == 'tDOS') {
                    svg.selectAll('tdos')
                        .data([dosdata]).enter().append("path")
                        .attr("transform", "translate(" + pumba.width + ",0)")
                        .attr('class',style.name)
                        .attr('id', 'dos')
                        .attr('stroke', lColor(`${Z}`)) //d => bandColor(style.name)
                        .attr("stroke-width", (style.line.width / 2))
                        .attr("opacity", style.dos.opacity )
                        .attr("fill", lColor(`${Z}`))
                        .attr("d", dosarea);
                } else {
                    svg.selectAll('dos')
                        .data([dosdata]).enter().append("path")
                        .attr("transform", "translate(" + pumba.width + ",0)")
                        .attr('class',`atom-${Z}`)
                        .attr('id', 'orbital')
                        .attr('stroke', lColor(`${Z}`)) //d => bandColor(style.name)
                        .attr("stroke-width", (style.line.width / 2))
                        .style("stroke-dasharray", (d => { return `${Z}` == 'inter' ? ("1, 1") : 'none' }))
                        .attr("opacity", style.dos.opacity)
                        .attr("fill", 'none')
                        .attr("d", dosline);
                }
            }
        }
    }

    if (style.orbital) {
        atoms = new Array()
        for (let iatom of style.orbital.atomIndex) {
            atoms.push(data.columns[iatom])
        }
        // console.log(atoms)
        var atomColor = d3.scaleOrdinal().domain(atoms).range(style.orbital.atomColor);
            for (let Z of atoms) {
                svg.selectAll('dot').data(data.filter(function(d, i) {
                        return d.e >= pumba.y.domain()[0] && d.e <= pumba.y.domain()[1]
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
    }
}

function legend(data, style) {
    // add legend
    if (style.legend) {
        labelMarker(style.legend.marker, style.legend.x, style.legend.y, style.legend.width)
        label(style.legend.x + style.legend.width + 10, style.legend.y + style.legend.width - 20, style.legend.name)
    }
    if (style.orbital) {
        // for (let iatom of style.orbital.atomIndex) {
        //     atoms.push(data.columns[iatom])
        // }
        var atomColor = d3.scaleOrdinal().domain(atoms).range(style.orbital.atomColor);
        subLabelMarker(atoms, pumba.width + 5, style.legend.y + 5, style.legend.width)
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

           svg.append("foreignObject")
                .attr("class", `slm-${i}`)
                .attr('id', 'orbital')
                .attr("width", 60)
                .attr("height", 30)
                .attr("x", (x + 120))
                .attr("y", (y+40+ j * 20))
                .style("color", atomColor(i))
                .style("opacity", style.orbital.opacity)
                .style('font-size', '16px')
                .style('text-align', 'left')
                .style('cursor', 'pointer')
                .html(style.orbital.atomType[j]+style.orbital.dosorbital[j]);

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

var fmt = (a) => d3.format(a)