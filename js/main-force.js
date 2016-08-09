
// Will be used to the save the loaded JSON dataForceLayout
var categories_ingredients={};




// Variables for the visualization instances
var forceplot;




// Start application by loading the dataForceLayout
//loadData();
//loadDataRunOnce();
//
//queue().defer(d3.json,"data/dataNodesLinks_Ingredients.json")
//    .defer(d3.json,"data/dataNodesLinks_Recipes.json")
//    .await(createVis);
//





function createVisRecipes(error,data1,data2) {
    // Create an object instance
    categories_ingredients=data2;
    //console.log(data_ingredients)
    forceplot = new ForceDiagram("force-layout", data1,categories_ingredients,900,900*.6,120);
}




//function brushed() {
//
//    // Set new domain if brush (user selection) is not empty
//    areachart.x.domain(
//        timeline.brush.empty() ? timeline.x.domain() : timeline.brush.extent()
//    );
//
//    // Update focus chart (detailed information)
//
//    areachart.wrangleData();
//
//}
