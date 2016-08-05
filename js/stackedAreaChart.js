
/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */
StackedAreaChart = function(_parentElement, _data, country_chosen_st, _svgWidth, _svgHeight, _svgMargin, _svgSize) {

    // var stack = d3.layout.stack()
    //     			.values(function(d) { return d.values; })

    this.parentElement = _parentElement;
    // this.data = stack(_data);
    this.data = _data;
    this.displayData = []; // see data wrangling
    this.svgWidth=_svgWidth;
    this.svgHeight = _svgHeight;
    this.size = _svgSize;
    this.leftMargin = _svgMargin;

    // DEBUG RAW DATA

    this.initVis(country_chosen_st);
}

// Set ordinal color scale
var colorScale = d3.scale.category20();
var dataCategories;

/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

var data_chosen;
var data_all_stacked;
var stackedData;

StackedAreaChart.prototype.initVis = function(country_chosen_st) {
    var vis = this;

    //console.log(vis.data)
    data_all_stacked=vis.data;

    for (i = 0; i < vis.data.length; i++){
        if (vis.data[i].country == country_chosen_st) {
            data_chosen = vis.data[i];
        }
    }



// Update color scale (all column headers except "Year")
// We will use the color scale for the stacked area chart
    colorScale.domain(d3.keys(data_chosen.layers[0]).filter(function(d){ return d != "Year"; }))

    vis.margin = {
        top: 20,
        right: 0,
        bottom: 20,
        left: vis.leftMargin
    };


    // SVG drawing area
    vis.width = vis.svgWidth - vis.margin.left - vis.margin.right;
    vis.height = vis.svgHeight - vis.margin.top - vis.margin.bottom;


    vis.svg_stacked = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    if (vis.width > 500) {
        // Overlay with path clipping
        vis.svg_stacked.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);
    }


    // Scales and axes
    vis.x = d3.time.scale()
        .range([0, vis.width])
        .domain(d3.extent(data_chosen.layers, function(d) {
            return d.Year;
        }));

    vis.y = d3.scale.linear()
        .range([vis.height, 0]);

    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");

    vis.yAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left");


    vis.svg_stacked.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    if(vis.size == "big") {

        vis.svg_stacked.append("g")
            .attr("class", "y-axis axis")
            .append("text")
            .attr("y", -20)
            .attr("dy", ".71em")
            .style("text-anchor", "left")
            .text("Food Supply Quantity in gr/capita/day ");
    }
    else{
        vis.svg_stacked.append("g")
            .attr("class", "y-axis axis")
            .text("Food Supply Quantity in gr/capita/day ");
    }

    vis.area_stacked = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) {
            return vis.x(d.Year);
        })
        .y0(function(d) {
            return vis.y(d.y0);
        })
        .y1(function(d) {
            return vis.y(d.y0 + d.y);
        })



    dataCategories = colorScale.domain();

    var transposedData = dataCategories.map(function(name) {
        return {
            name: name,
            values: data_chosen.layers.map(function(d) {
                return {
                    Year: d.Year,
                    y: d[name]
                };
            })
        };
    });

    stack = d3.layout.stack()
        .values(function(d) {
            return d.values;
        });

    stackedData = stack(transposedData);
    vis.stackedData = stackedData;



    vis.displayData = vis.stackedData;


    document.getElementById("country").innerHTML = country_chosen_st;

    vis.updateVis();
}



/*
 * Data wrangling
 */
var next_country;

StackedAreaChart.prototype.wrangleData = function(next_country) {
    var vis = this;

    if(next_country==country_chosen_st) {
        vis.displayData = stackedData
    }
    else {

        for (i = 0; i < data_all_stacked.length; i++) {
            if (data_all_stacked[i].country == next_country) {
                data_chosen = data_all_stacked[i];
            }
            else if (data_all_stacked[i].country != next_country) {
                vis.displayData = 0;
            }
        }


        colorScale.domain(d3.keys(data_chosen.layers[0]).filter(function (d) {
            return d != "Year";
        }))

        dataCategories = colorScale.domain();

        var transposedData = dataCategories.map(function (name) {
            return {
                name: name,
                values: data_chosen.layers.map(function (d) {
                    return {
                        Year: d.Year,
                        y: d[name]
                    };
                })
            };
        });

        stack = d3.layout.stack()
            .values(function (d) {
                return d.values;
            });

        stackedData = stack(transposedData);
        vis.stackedData = stackedData;

        vis.displayData = vis.stackedData;
        country_chosen_st=next_country;


        // In the first step no data wrangling/filtering needed
    }

    document.getElementById("country").innerHTML = next_country;


    // Update the visualization
    vis.updateVis();
}




/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

StackedAreaChart.prototype.updateVis = function() {
    var vis = this;

    if (filtered == true) {
        var filterDomain = areachart.x.domain();
        for (i = 0; i < vis.stackedData.length; i++) {
            vis.stackedData[i].values.filter(function(d) {
                return ((d.Year >= filterDomain[0]) && (d.Year <= filterDomain[1]));
            })
        }
    }


    // Update domain
    // Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer
    vis.y.domain([0, d3.max(vis.displayData, function(d) {
        return d3.max(d.values, function(e) {
            return e.y0 + e.y;
        });
    })]);

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Draw the layers
    var categories = vis.svg_stacked.selectAll(".area")
        .data(vis.displayData);

    categories.enter().append("path")
        .attr("class", "area")
        .attr("opacity", 0.8);

    categories
        .style("fill", function(d) {
            return colorScale(d.name);
        })
        .attr("d", function(d) {
            return vis.area_stacked(d.values);
        })
        .on("mouseover", function(d) {
            d3.select(this).style("opacity",1)
            .style({"cursor": "pointer"});

            div.style("opacity",1);
            div.html(d.name)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        })
        .on("mouseout", function(d) {
            d3.select(this).style("opacity",0.8);
            div
                .style("opacity", 0);
        });


    // TO-DO: Update tooltip text

    categories.exit().remove();


    // Call axis functions with the new domain
    if(vis.size=="small"){
    vis.svg_stacked.select(".x-axis")
        .call(vis.xAxis)
        .selectAll(".tick")
        .style("visibility", "hidden")

        vis.svg_stacked.select(".y-axis")
            .call(vis.yAxis)
        .selectAll(".tick")
        .style("visibility", "hidden")
    }
    else{
        vis.svg_stacked.select(".x-axis")
            .call(vis.xAxis)
        vis.svg_stacked.select(".y-axis")
            .call(vis.yAxis)
    }

}


