
/*
 * Timeline - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

Timeline = function(_parentElement, _data){

	this.parentElement = _parentElement;
	this.data = _data;

	// No data wrangling, no update sequence

	this.initVis();
}



/*
 * Initialize area chart with brushing component
 */


Timeline.prototype.initVis = function(){
	var vis = this; // read about the this

	// Better to do it in main_stacked
	/*data2.years.forEach(function(d){
	 d.Year = parseDate(d.Year.toString());
	 });*/

	vis.displayData = data_chosen.years;


	vis.margin = {top: 10, right: 0, bottom: 20, left: 40};

	vis.width = 600 - vis.margin.left - vis.margin.right,
		vis.height = 80 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg_timeline = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");



	// Scales and axes
	vis.x = d3.time.scale()
		.range([0, vis.width])
		.domain(d3.extent(vis.displayData, function(d) { return d.Year; }));

	vis.y = d3.scale.linear()
		.range([vis.height, 0])
		.domain([0, d3.max(vis.displayData, function(d) { return d.Food_supply_quantity; })]);

	vis.xAxis = d3.svg.axis()
		.scale(vis.x)
		.orient("bottom");

	// Initialize brush component
	vis.brush = d3.svg.brush()
		.x(vis.x)
		.on("brush", brushed);

	// SVG area path generator
	vis.area = d3.svg.area()
		.x(function(d) { return vis.x(d.Year); })
		.y0(vis.height)
		.y1(function(d) { return vis.y(d.Food_supply_quantity); });

	vis.svg_timeline.append("path")
		.datum(vis.displayData)
		.attr("fill", "#ccc")
		.attr("d", vis.area);



	// Append brush component
	vis.svg_timeline.append("g")
		.attr("class", "x brush")
		.call(vis.brush)
		.selectAll("rect")
		.attr("y", -6)
		.attr("height", vis.height + 7);



	vis.svg_timeline.append("g")
		.attr("class", "x-axis axis")
		.attr("transform", "translate(0," + vis.height + ")")
		.call(vis.xAxis);

}

