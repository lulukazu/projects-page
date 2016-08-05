

BarChart = function(_parentElement, _data_percentages,_data_ing, _selection, _svgWidth,  _svgHeight, _svgBarWidth,_svgLeftMargin,_svgRightMargin,_svgBottomMargin,_size){
    this.parentElement = _parentElement;
    this.data_p = _data_percentages;
    this.data_i = _data_ing;
    //this.data = _data;
    this.svgWidth=_svgWidth;
    this.svgHeight = _svgHeight;
    this.selection = _selection;
    this.size = _size;
    this.leftMargin = _svgLeftMargin;
    this.rightMargin = _svgRightMargin;
    this.barWidth = _svgBarWidth;
    this.bottomMargin = _svgBottomMargin;
    this.initVis(this.selection);

};

var varXdomain;
var count = 0;
var seen_ingredients = []
var color_ing = "#8dd3c7"
var selected_ingredient = "wheat_flour"

//console.log(color_ing, selected_ingredient)


BarChart.prototype.initVis = function(selection){

    var vis = this;

    vis.margin = {top: vis.bottomMargin, right: vis.rightMargin, bottom: 100, left: vis.leftMargin};


    //LEGEND WILL DISAPPEAR FOR VIS.WIDTH < 500 px

    vis.width = vis.svgWidth - vis.margin.left - vis.margin.right;
    vis.height =vis.svgHeight - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");



    //Intiate scales
    vis.xScale_ing = d3.scale.ordinal()
        .rangeRoundBands([0, vis.width], .1)

    vis.xScale_percentages = d3.scale.ordinal()
        .rangeRoundBands([0, vis.width], .1)


    vis.yScale = d3.scale.linear()
        .range([vis.height,0]);



    vis.wrangleData(selection);
};

//var ing_colors = []
var clicks = 0;
//var clicks2 = 0;

// Use the Queue.js library to read two files
BarChart.prototype.wrangleData = function(selection){


        var vis = this;
        // Store csv data in global variable

        vis.yScale.domain([0, d3.max(vis.data_p, function (d) {
            return d[selection]
        })])

        varXdomain = vis.data_i.map(function (d) {
            return d[selection].replace("_", " ")
        });

        vis.xScale_ing.domain(varXdomain);

        vis.xScale_percentages.domain(d3.range(vis.data_p.length));

        ing_colors = colors(varXdomain)

        vis.svg.selectAll("rect")
            .data(vis.data_p)
            .enter()
            .append("rect")
            .attr("y", function(d) {
                return vis.yScale(d[selection]);
            })
            .attr("height", function(d) {
                return vis.height - vis.yScale(d[selection]);
            })
            .attr("width", 15)
            .attr("x", function(d,i){
                return (1.15*vis.margin.left+vis.xScale_percentages(i))
            })
            .attr("fill", function(d,i){
                return ing_colors[i]
            })
            .on("click", function(d,i) {
                //if (vis.clicks==0){
                //    //this.barchart2(vis.varXdomain[i].replace(" ", "_"),vis.ing_colors[i])
                //    vis.clicks = vis.clicks + 1}
                //else{
                //    vis.updateVisualization2(vis.varXdomain[i].replace(" ", "_"), vis.ing_colors[i]);
                //}

                color_ing = ing_colors[i]
                selected_ingredient = varXdomain[i]
                //console.log(color_ing, selected_ingredient)
                ingchart.updateVisualization(selected_ingredient.replace(" ", "_"), color_ing)
                ingchart2.updateVisualization(selected_ingredient.replace(" ", "_"), color_ing)
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


        vis.xAxis = d3.svg.axis()
            .scale(vis.xScale_ing)
            .orient("bottom");

        vis.yAxis = d3.svg.axis()
            .scale(vis.yScale)
            .orient("left")


        if(vis.size=="big"){


        vis.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.height + ")")
            .call(vis.xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");


        vis.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + vis.margin.left + ",0)")
            .call(vis.yAxis)
            .append("text")
            .attr("y", -20)
            .attr("dy", ".71em")
            .style("text-anchor", "left")
            .text("% of appearance in recipes");}

        if(vis.size=="small"){


        vis.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.height + ")")
            //.call(vis.xAxis)


        vis.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + vis.margin.left + ",0)")
            //.call(vis.yAxis)
            .text("% of appearance in recipes");}



    function colors(varXdomain) {

        var ing_colors = []
        varXdomain.forEach(function (d) {
            if (seen_ingredients.indexOf(d)===-1) {
                seen_ingredients.push(d)
                ing_colors.push(colorbrewer.Set4[12][count])
                count = count + 1;


            } else {
                idx = seen_ingredients.indexOf(d)
                ing_colors.push(colorbrewer.Set4[12][idx])
            }
        });
        return ing_colors
    }

    d3.select("#ingredient-image")
                .attr("src", "./images/" + selected_ingredient.replace(" ","_") + ".png")
                .attr("width","100")
                .attr("vspace","100px")

    d3.select("#ingredient-image2")
        .attr("src", "./images/" + selected_ingredient.replace(" ","_") + ".png")
        .attr("width","50")
        .attr("vspace","50px")


        //vis.imagechart(selection)

        vis.updateVisualization(selection);
    };

BarChart.prototype.updateVisualization = function(selection){

    var vis = this;


    //We set the domain of the scales

    varXdomain = vis.data_i.map(function(d) { return d[selection].replace("_", " ") });

    ing_colors = colors(varXdomain)


    vis.yScale.domain([0, d3.max(vis.data_p, function(d) { return d[selection] })])
    vis.xScale_ing.domain(varXdomain)

    if(vis.size=="big") {
        vis.svg.selectAll(".x")
            .transition()
            .duration(800)
            .call(vis.xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        vis.svg.selectAll(".y")
            .transition()
            .duration(800)
            .call(vis.yAxis);
    }
    if(vis.size=="small") {
        vis.svg.selectAll(".x")
            .transition()
            .duration(800)
            .call(vis.xAxis)
            .selectAll(".tick")
            .style("visibility", "hidden")


        vis.svg.selectAll(".y")
            .transition()
            .duration(800)
            .call(vis.yAxis)
            .selectAll(".tick")
            .style("visibility", "hidden")
    }

    vis.rect = vis.svg.selectAll("rect")
        .data(vis.data_p)


    vis.rect.enter()
    	.append("rect")


    vis.rect
        .transition()
        .duration(800)
        .attr("y", function(d) {
            return vis.yScale(d[selection]);
        })
        .attr("height", function(d) {
            return vis.height - vis.yScale(d[selection]);
        })
        .attr("width", vis.barWidth)
        .attr("x", function(d,i){
            return (1.15*vis.margin.left+vis.xScale_percentages(i))
        })
        .attr("fill", function(d,i){
            return ing_colors[i]
        })



    vis.rect.exit()
        .transition()
        .duration(800)
        .remove();


    function colors(varXdomain) {

        var ing_colors = []
        varXdomain.forEach(function (d) {
            if (seen_ingredients.indexOf(d)===-1) {
                seen_ingredients.push(d)
                ing_colors.push(colorbrewer.Set4[12][count])
                count = count + 1;


            } else {
                idx = seen_ingredients.indexOf(d)
                ing_colors.push(colorbrewer.Set4[12][idx])
            }
        });
        return ing_colors
    }

}

