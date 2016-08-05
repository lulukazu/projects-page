
// Will be used to the save the loaded JSON data
var data;
var ingchart, ingchart2;

// Date parser to convert strings to date objects


// Variables for the visualization instances
//var selection="American";


// Start application by loading the data
loadData_ingredientChart();

function loadData_ingredientChart() {
    d3.csv("data/all_cuisines_all_ing.csv", function (error, data) {

        ingchart = new BarChart2("ingredient-chart",data ,500,0.8*500,15,20,100, "big");
        ingchart2 = new BarChart2("mini-ingredient-chart",data ,200,100,6,5,1, "small");


    })
}





//function brushed() {
//
//	// TO-DO: React to 'brushed' event
//	// Set new domain if brush (user selection) is not empty
//	areachart.x.domain(
//		timeline.brush.empty() ? timeline.x.domain() : timeline.brush.extent()
//	);
//	// Update focus chart (detailed information)
//	areachart.updateVis();
//
//	filtered = true;
//
//
//}
//
