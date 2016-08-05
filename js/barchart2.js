
BarChart2 = function(_parentElement, _data, _svgWidth, _svgHeight,_svgBarWidth, _svgLeftMargin,_svgBottomMargin,_size){
    this.parentElement = _parentElement;
    this.data_ing2 = _data;
    //this.color = _this_color;
    this.svgWidth=_svgWidth;
    //this.selected_ingredient = _selected_ingredient;
    this.size = _size;
    this.svgHeight = _svgHeight;
    this.leftMargin = _svgLeftMargin;
    this.barWidth = _svgBarWidth;
    this.bottomMargin = _svgBottomMargin;
    this.initVis(selected_ingredient, color_ing);
};

//var seen_ingredients = []
var varXdomain2;



BarChart2.prototype.initVis = function(selected_ingredient,this_color) {

    var vis = this;

    vis.margin = {top: 40, right: 10, bottom: vis.bottomMargin, left: vis.leftMargin};


    //LEGEND WILL DISAPPEAR FOR VIS.WIDTH < 500 px

    vis.width = vis.svgWidth - vis.margin.left - vis.margin.right;
    vis.height = vis.svgHeight - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.xScale_cuisines = d3.scale.ordinal()
        .rangeRoundBands([0, vis.width], .01)

    vis.xScale_percentages2 = d3.scale.ordinal()
        .rangeRoundBands([0, vis.width], .01)


    vis.yScale2 = d3.scale.linear()
        .range([vis.height, 0]);

    vis.wrangleData(selected_ingredient, color_ing);

}
    BarChart2.prototype.wrangleData = function(selected_ingredient, color){


            var vis = this;

            varXdomain2 = vis.data_ing2.map(function (d) {
                return d.Country.replace("_", " ")
            });

            vis.data2 = vis.data_ing2.map(function(d) { return +d[selected_ingredient] });


            vis.yScale2.domain([0, d3.max(vis.data2, function (d) {
                return d
            })])


            vis.xScale_percentages2.domain(d3.range(varXdomain2.length));


            vis.svg.selectAll("rect")
                .data(vis.data2)
                .enter()
                .append("rect")
                .attr("y", function(d){
                    return vis.yScale2(d)
                })
                .attr("height", function(d) {
                    return vis.height - vis.yScale2(d);
                })
                .attr("width", vis.barWidth)
                .attr("x", function(d,i){
                    return (1.15*vis.margin.left+vis.xScale_percentages2(i))
                })
                .attr("fill", color)
                .on("click", function(d,i) {


                    barchart.wrangleData(varXdomain2[i].replace(" ","_"))
                    barchart2.wrangleData(varXdomain2[i].replace(" ","_"))
                    var filterobject = [];
                    filterobject[0]={};
                    filterobject[0].type = "Cuisine";
                    filterobject[0].value= varXdomain2[i].replace(" ","_");
                    //console.log(filterobject)
                    selectedCountryPlot.wrangleData(varXdomain2[i].replace(" ","_"));
                    forceplot.wrangleData(filterobject);
                    forceplot_mini.wrangleData(filterobject);

                })
                .on("mouseover", function(){
                    d3.select(this)
                        .style({"cursor": "pointer"})
                        .style({"opacity": 0.5})
                })
                .on("mouseout", function(){
                    d3.select(this)

                        .style({"opacity": 1})
                });



        vis.xAxis2 = d3.svg.axis()
                .scale(vis.xScale_cuisines)
                .orient("bottom");

            vis.yAxis2 = d3.svg.axis()
                .scale(vis.yScale2)
                .orient("left")

        if(vis.size=="big") {

            vis.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + vis.margin.left + "," + vis.height + ")")
                .call(vis.xAxis2)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

            vis.svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + vis.margin.left + ",0)")
                .call(vis.yAxis2)
                .append("text")
                .attr("y", -20)
                .attr("dy", ".71em")
                .style("text-anchor", "left")
                .text("% of appearance in recipes");
        }
        else{
            vis.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + vis.margin.left + "," + vis.height + ")")
                .call(vis.xAxis2)


            vis.svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + vis.margin.left + ",0)")
                .call(vis.yAxis2)
        }

        vis.updateVisualization(selected_ingredient, color_ing);

        }


BarChart2.prototype.updateVisualization = function(selected_ingredient,this_color){

    var vis = this;

    d3.select("#ingredient-image")
        .attr("src", "./images/" + selected_ingredient.replace(" ","_") + ".png")
        .attr("width","100")
        .attr("vspace","100px")

    d3.select("#ingredient-image2")
        .attr("src", "./images/" + selected_ingredient.replace(" ","_") + ".png")
        .attr("width","50")
        .attr("vspace","50px")

    //.data(dataset.map(function(d) { return +d; }))
    varXdomain2 = vis.data_ing2.map(function (d) {
        return d.Country.replace("_", " ")
    });

    vis.data2 = vis.data_ing2.map(function(d) { return +d[selected_ingredient] });

    vis.yScale2.domain([0, d3.max(vis.data2, function (d) {
        return d
    })])


    vis.xScale_cuisines.domain(varXdomain2);

    if(vis.size=="big") {
        vis.svg.select(".x")
            .transition()
            .duration(800)
            .call(vis.xAxis2)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
        //.attr("transform", "rotate(-65)" );

        vis.svg.select(".y")
            .transition()
            .duration(800)
            .call(vis.yAxis2);
    }
    else{
        vis.svg.select(".x")
            .transition()
            .duration(800)
            .call(vis.xAxis2)
            .selectAll(".tick")
            .style("visibility", "hidden")

        vis.svg.select(".y")
            .transition()
            .duration(800)
            .call(vis.yAxis2)
            .selectAll(".tick")
            .style("visibility", "hidden")
    }

    vis.rect = vis.svg.selectAll("rect")
        .data(vis.data2)
        .attr("fill", this_color)

    vis.rect.enter()
        .append("rect")




    vis.rect
        .transition()
        .duration(800)
        .attr("y", function(d) {
            return vis.yScale2(d);
        })
        .attr("height", function(d) {
            return vis.height - vis.yScale2(d);
        })
        //.attr("width", 15)
        .attr("x", function(d,i){
            return (1.15*vis.margin.left+vis.xScale_percentages2(i))
        })


    vis.rect.exit()
        .transition()
        .duration(800)
        .remove();

}
