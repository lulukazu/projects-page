
var selectedCountryPlot;
var alreadyMap=0;
function createMapVisualization(scaling, id, size) {
    var margin = { top: 10, right: 0, bottom: 30, left: 0 };
    var map_width = 800/(scaling/2),
        map_height,
        pie_width = 450,
        pie_height = 300,
        hbar_width = 450,
        hbar_height = 250;

    if (size=="big") {map_height = 0.75*map_width}
    else {map_height = 0.55*map_width}

    // INITIATE MAP
    //
    var svg_map = d3.select(id).append("svg")
        .attr("width", map_width + margin.left + margin.right)
        .attr("height", map_height + margin.top + margin.bottom);

    svg_map.append("defs")
        .append("pattern")
        .attr("id", "map-pattern")
        //.attr("class", "map-patterns")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", map_width)
        .attr("height", map_height)
        .append("image")
        .attr("xlink:href", "images/food_background.jpg")
        .attr("width", map_width)
        .attr("height", map_width);

    var map_projection = d3.geo.mercator()
        .center([10, 50 - map_height/80])
        .scale(map_width / 2/ Math.PI)
        .translate([map_width / 2, map_height / 2]);

    var map_path = d3.geo.path()
        .projection(map_projection);

    var map_colorScale = d3.scale.category20();
    var pie_colorScale = d3.scale.category10();
    var hbar_colorScale = d3.scale.category10();


    var hover_yet = false;
    //


    //INITIATE PIE

    if(size=="big") {
        var radius = Math.min(pie_width, pie_height) / 2.5;

        var pie_arc = d3.svg.arc()
            .outerRadius(radius * 0.7)
            .innerRadius(0);

        var pie_arc_big = d3.svg.arc()
            .outerRadius(radius * 0.85)
            .innerRadius(0);

        var pie_arc_outer = d3.svg.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        var pie_layout = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.percent;
            });

        var svg_pie = d3.select("#map-bar").append("svg")
            .attr("width", pie_width + margin.left + margin.right)
            .attr("height", pie_height + margin.top + margin.bottom)
            .append("g");

        var map_label = svg_pie.append("g")
            .style("display", "none");

        svg_pie.append('g')
            .attr("class", "pie-slices");
        svg_pie.append("g")
            .attr("class", "pie-labels");
        svg_pie.append("g")
            .attr("class", "pie-lines");
        svg_pie.append("defs")
            .attr("class", "pie-patterns");

        //var pie_defs = svg_pie.append('svg:defs');

        svg_pie
            .attr("transform", "translate(" + (pie_width / 2 + 15) + "," + (pie_height / 2 + 20) + ")");

        var curr_category;

        //INITIATE BARS
        //
        var svg_hbar = d3.select("#map-bar").append("svg")
            .attr("width", hbar_width + margin.left + margin.right)
            .attr("height", hbar_height + margin.top + margin.bottom)
            .append("g");

        var hbar_y = d3.scale.ordinal().rangeRoundBands([0, hbar_height], 0.9, 0.4);
        var hlabel_y = d3.scale.ordinal().rangeRoundBands([0, hbar_height], 1, 0.5);
        var himage_y = d3.scale.ordinal().rangeRoundBands([0, hbar_height], 0.25, 0.1);
        var hbar_x = d3.scale.linear().domain([0, 100]).range([0, hbar_width * 0.9]);
        //
    }

    // LOAD DATA and CALL createMap
    queue()
        .defer(d3.json, "data/world-110m.json")
        .defer(d3.json, "data/country_cuisine_map.json")
        .defer(d3.json, "data/cuisine_ingredient.json")
        .await(createMap);

    // DEFINE createMap
    function createMap(error, world_map, country_cuisine, cuisine_ingredient) {


        //Part 0: load mini-country-selection;
        if (!alreadyMap){
        selectedCountryPlot = new SelectedCountry("selected-country-svg", world_map, country_cuisine,140,110);
        alreadyMap=1;}
        // PART I: World Map

        // SET UP LABEL
        //if(size=="big") {
        //    map_label.append("text")
        //        .attr("class", "map-label cuisine")
        //        .style("font-size", 20)
        //        .attr("x", 0)
        //        .attr("y", -145)
        //        .attr("text-anchor", "middle");
        //
        //    map_label.append("text")
        //        .attr("x", 0)
        //        .attr("y", -145)
        //        .attr("class", "detail")
        //        .attr("text-anchor", "middle");
        //    map_label.select(".detail")
        //        .append("tspan")
        //        .attr("x", 0)
        //        .attr("dy", 25)
        //        .attr("class", "map-label detail country")
        //        .attr("text-anchor", "middle");
        //}

        // DRAW MAP
        map_colorScale.domain(Object.keys(cuisine_ingredient));
        var map_countries = topojson.feature(world_map, world_map.objects.countries).features;

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var timeOutHandler;
        svg_map.selectAll("countries")
            .data(map_countries)
            .enter().insert("path", ".graticule")
            .attr("class", "countries")
            .attr("d", map_path)
            .attr("fill", function (d) {
                var map_unavailable = (country_cuisine[d.id] == undefined || country_cuisine[d.id].cuisine == undefined)
                if (map_unavailable) {return "#eeeeee"}
                else {return map_colorScale(country_cuisine[d.id].cuisine)}
            })


            .on('mouseover', function (d, i) {
                var currentState = this;
                d3.select(this).style('fill-opacity',.8)
                    .style({"cursor": "pointer"});
                div
                    .style("opacity", .9);
                div.html(country_cuisine[d.id].name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

            })
            .on('mouseout', function (d, i) {
                d3.selectAll('.countries')
                    .style('fill-opacity', 1);
                div
                    .style("opacity", 0);
            })
            .on('click',function(d){
                if (size=="big") {
                    d3.select(".selected").classed("selected", false);
                    d3.select(this).classed("selected", true);

                }
                var map_unavailable = (country_cuisine[d.id] == undefined || country_cuisine[d.id].cuisine == undefined)
                if (map_unavailable==false) {


                    showCuisine(d.id, world_map, country_cuisine, cuisine_ingredient);
                }

                    div.transition()
                        .duration(500)
                        .style("opacity", .9);

                selectedCountryPlot.wrangleData(country_cuisine[d.id].cuisine);
                window.clearTimeout(timeOutHandler);
                timeOutHandler= window.setTimeout(function() {
                    next_country = country_cuisine[d.id].name;
                    areachart.wrangleData(next_country);
                    areachart2.wrangleData(next_country);
                    barchart.wrangleData(country_cuisine[d.id].cuisine);
                    barchart2.wrangleData(country_cuisine[d.id].cuisine);


                    var filterobject = [];
                    filterobject[0]={};
                    filterobject[0].type = "Cuisine";
                    filterobject[0].value=country_cuisine[d.id].cuisine;
                    forceplot.wrangleData(filterobject);
                    forceplot_mini.wrangleData(filterobject);
                }, 800);


                //console.log(country_cuisine[d.id].cuisine)
                //d3.select("#ranking-type")
                //    .property({value: country_cuisine[d.id].cuisine})
                //update_imagechart(data_i, data_p, country_cuisine[d.id].cuisine)
                //updateVisualization(data_i, data_p, country_cuisine[d.id].cuisine)


            });
            /*.on('click',function(d){
                next_country=country_cuisine[d.id].name
                console.log(next_country)
                areachart.wrangleData(next_country)
            });*/

        svg_map.insert("path", ".graticule")
            .datum(topojson.mesh(world_map, world_map.objects.countries, function (a, b) {
                return a !== b;
            }))
            .attr("class", "boundary")
            .attr("d", map_path)
            .style("stroke", "#eeeeee")
            .style("stroke-width", 1)

        showCuisine(840, world_map, country_cuisine, cuisine_ingredient);
        showIngredient("Oil & Dairy", cuisine_ingredient[country_cuisine[840].cuisine]);

    }

    function showCuisine(country_id, world_map, country_cuisine, cuisine_ingredient) {

        var country_data = country_cuisine[country_id],
            cuisine_key = country_data.cuisine,
            cuisine_data = cuisine_ingredient[cuisine_key],
            category_data = cuisine_data.category_pct;

        if (hover_yet) {
            showIngredient(curr_category, cuisine_data);
        }

        if (size == "big") {
            //UPDATE CUISINE LABEL
            //
            map_label.style("display", null);

            map_label.select("text.cuisine")
                .text(deunderscore(cuisine_key) + " Food")
                .attr("font-size", 20);
            map_label.select("tspan.country")
                .text("Country: " + country_data.name)
                .attr("font-size", 16);
            //


            var pie_patterns = svg_pie.select(".pie-patterns").selectAll("pattern")
                .data(pie_layout(category_data));

            pie_patterns.enter()
                .append("svg:pattern");

            pie_patterns
                .attr("class", "pie-patterns")
                .attr("id", function (d, i) {
                    return "img-" + i;
                })
                .attr("width", 100)
                .attr("height", 100)
                .attr('patternUnits', 'userSpaceOnUse');

            d3.select(".pie_image").remove();

            pie_patterns
                .append('svg:image')
                .attr("class", "pie_image")
                .attr("x", -200)
                .attr("y", -200)
                .attr('width', 400)
                .attr('height', 400)
                //.attr('xlink:href', function(d,i) {return "images/Protein.jpeg"})
                .attr('xlink:href', function (d, i) {
                    return "images/" + underscore(d.data.category) + ".jpg"
                });


            pie_patterns.exit().remove();

            var pie_slice = svg_pie.select(".pie-slices").selectAll("path.slice")
                .data(pie_layout(category_data));


            pie_slice.enter()
                .insert("path")
                .attr("class", "slice")
                .style("fill", function (d, i) {
                    return "url(#img-" + i + ")"
                })
                .style("stroke", "#eeeeee")
                .style("stroke-width", 2);


            pie_slice
                .transition().duration(500)
                .attrTween("d", function (d) {
                    //console.log(d)
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        if (d.data.category == curr_category) {
                            return pie_arc_big(interpolate(t));
                        }
                        else {
                            return pie_arc(interpolate(t));
                        }
                    };
                });

            pie_slice
                .on('mouseover', function (d, i) {
                    d3.select(this)
                        .style({"cursor": "pointer"})
                        .style('fill-opacity', 0.8);
                })
                .on('mouseout', function (d, i) {
                    d3.selectAll('.slice')
                        .style('fill-opacity', 1);
                })
                .on('click', function (d, i) {
                    d3.selectAll(".slice")
                        .attr("d", pie_arc);
                    d3.select(this)
                        .attr("d", pie_arc_big);
                    showIngredient(d.data.category, cuisine_data);
                });


            pie_slice.exit()
                .remove();

            /* ------- TEXT LABELS -------*/

            var pie_text = svg_pie.select(".pie-labels").selectAll("text")
                .data(pie_layout(category_data));

            pie_text.enter()
                .append("text");

            pie_text
                .attr("class", "pie-labels")
                .attr("dy", ".35em")
                .text(function (d) {
                    return (d.data.category);
                })
                .append("tspan")
                .attr("x", 0)
                .attr("dy", 20)
                .attr("class", "pie-labels percentage")
                .text(function (d) {
                    return ("(" + percents(d.data.percent) + ")");
                });


            function midAngle(d) {
                return d.startAngle + (d.endAngle - d.startAngle) / 2;
            }

            pie_text.transition().duration(500)
                .attrTween("transform", function (d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        var d2 = interpolate(t);
                        //console.log(d2)
                        var pos = pie_arc_outer.centroid(d2);
                        pos[0] = radius * 0.9 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate(" + pos + ")";
                    };
                })
                .styleTween("text-anchor", function (d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start" : "end";
                    };
                });

            pie_text.exit()
                .remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/

            var pie_polyline = svg_pie.select(".pie-lines").selectAll("polyline")
                .data(pie_layout(category_data));

            pie_polyline.enter()
                .append("polyline");

            pie_polyline.transition().duration(500)
                .attrTween("points", function (d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        var d2 = interpolate(t);
                        var pos = pie_arc_outer.centroid(d2);
                        pos[0] = radius * 0.85 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [pie_arc_big.centroid(d2), pie_arc_outer.centroid(d2), pos];
                    };
                });

            pie_polyline.exit()
                .remove();
        }
    }

    function showIngredient(category, cuisine_data) {
        curr_category = category;
        var ingredient_data = cuisine_data[curr_category],
            ingredient_keys = Object.keys(ingredient_data);
        //console.log(ingredient_data);


        hbar_y.domain(ingredient_keys);
        hlabel_y.domain(ingredient_keys);
        himage_y.domain(ingredient_keys);

        hbar_colorScale.domain(ingredient_keys);

        var hbar = svg_hbar.selectAll("rect.hbar")
            .data(ingredient_data);
        hbar
            .enter().append("rect");
        hbar
            .transition()
            .duration(500)
            .attr("class", "hbar")
            .attr("fill", function(d, i) {return hbar_colorScale(i);})
            .attr("y", function(d, i) {return hbar_y(i);})
            .attr("height", hbar_y.rangeBand())
            .attr("x", 145)
            .attr("width", function(d) {return (hbar_x(d.num)); });
        hbar
            .on('mouseover', function (d, i) {
            var currentState = this;
            d3.select(this).style('fill-opacity', 0.6)
                .style({"cursor": "pointer"});
            })
            .on('mouseout', function (d, i) {
                d3.selectAll('.hbar')
                    .style('fill-opacity', 1);
            });


        var hbar_label = svg_hbar.selectAll("text.hbar-label")
            .data(ingredient_data);
        hbar_label
            .enter().append("text");
        hbar_label
            .transition()
            .duration(500)
            .attr("class", "hbar-label")
            .text(function(d) {
                return deunderscore(d.ingredient) + " (" + percents(d.num/100) + ")";
            })
            .attr("y", function(d, i) {return hlabel_y(i);})
            .attr("x", 140)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .style("font-size", 12);
        hbar_label
            .on('mouseover', function (d, i) {
                var currentState = this;
                d3.select(this).style('fill-opacity', 0.6)
                    .style({"cursor": "pointer"});
            })
            .on('mouseout', function (d, i) {
                d3.selectAll('.hbar-label')
                    .style('fill-opacity', 1);
            });


        var hbar_img = svg_hbar.selectAll("image.hbar-image")
            .data(ingredient_data);
        hbar_img
            .enter().append("image");
        hbar_img
            .transition()
            .duration(500)
            .attr("class", "hbar-image")
            .attr("xlink:href", function(d) {return "images/"+ d.ingredient +".png";})
            .attr("y", function(d, i) {return himage_y(i);})
            .attr("x", function(d) {return hbar_x(d.num)+150;})
            .attr("width", hbar_height/7)
            .attr("height", hbar_height/7);
        hbar_img
            .on('mouseover', function (d, i) {
                var currentState = this;
                d3.select(this).style('opacity', 0.6)
                    .style({"cursor": "pointer"})
                    .attr("width", hbar_height/5)
                    .attr("height", hbar_height/5);
            })
            .on('mouseout', function (d, i) {
                d3.selectAll('.hbar-image')
                    .style('opacity', 1)
                    .attr("width", hbar_height/7)
                    .attr("height", hbar_height/7);
            })
            .on('click', function(d){
                ingchart.updateVisualization(d.ingredient, colorbrewer.Set4[12][seen_ingredients.indexOf(d.ingredient.replace("_"," "))])
                ingchart2.updateVisualization(d.ingredient, colorbrewer.Set4[12][seen_ingredients.indexOf(d.ingredient.replace("_"," "))])
            });

        hbar.exit().remove();
        hbar_label.exit().remove();
        hbar_img.exit().remove();

        hover_yet = true;
    }

}

function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function percents(x) {
    return (x*100).toFixed(0) + "%";
}

function deunderscore(x) {
    return x.toString().replace(/_/g, " ");
}

function underscore(x) {
    return x.toString().replace(/ /g, "_");
}