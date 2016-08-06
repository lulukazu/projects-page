//item navigation
var allData = [];

var currentID="physics";
// Variables for the visualization instances
var forcePlot;
queue().defer(d3.json,"data/fileNodesAndLinks.json")
    .await(createVis);


function createVis(error,data1) {
    // Create an object instance
    allData=data1;
    console.log(data1)
    forcePlot = new ForceDiagram("content-svg", allData);

}


function updateNav(id){
    closeNav();
    setTimeout(function(){
        displayUpdate(id);
    },300);

}

function displayUpdate(id){
    document.getElementById(currentID+"-nav").style.display="none";
    document.getElementById(id+"-nav").style.display="block";
    openNav();
    currentID=id;
}

function openNav() {
    document.getElementById("nav-box").style.left = "0px";
}

function closeNav() {
    document.getElementById("nav-box").style.left = "500px";
}

//file navigation

ForceDiagram = function(_parentElement, _data1){
    this.parentElement = _parentElement;
    this.data = _data1;
    this.displayData = []; // see dataForceLayout wrangling
    this.initVis();
};


ForceDiagram.prototype.initVis = function(){
    var vis = this;

    vis.Width=600;
    vis.Height=600;
    // select SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement);


    // 1) INITIALIZE FORCE-LAYOUT

    vis.force=d3.layout.force()
        .size([vis.Width,vis.Height])
        .charge(100)
        .chargeDistance(1000)
        .gravity(0.4)
        .linkDistance(300)
        .linkStrength(.6)
        .friction(.1);


    vis.wrangleData();
};


ForceDiagram.prototype.wrangleData = function(){
    var vis = this;
    // Update the visualization
    vis.updateVis();
};

ForceDiagram.prototype.updateVis = function(){
    var vis = this;

    // 2a) DEFINE 'NODES' AND 'EDGES'
    vis.force
        .nodes(vis.data.nodes,function(d){return d.id;})
        .links(vis.data.links);

    // 2b) START RUNNING THE SIMULATION
    vis.force.start();


    // 3) DRAW THE LINKS (SVG LINE) ... or don't?

    vis.link=vis.svg.selectAll(".link")
        .data(vis.data.links);

    vis.link.exit().remove();

    vis.link.enter().append("line")
        .attr("class","link")
        .attr("stroke","#bbb")
        .attr("stroke-width",1);

    // 4) DRAW THE NODES (SVG CIRCLE)
    vis.node = vis.svg.selectAll(".node")
        .data(vis.data.nodes,function(d){return d.id;});

    vis.node.exit().remove();

    //var g_nodes=vis.node.enter().append("g")
    //    .attr("class", "node")
    //    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    //
    //g_nodes.append("circle")
    //    .attr("r", function(d) {return d.r; })
    //    .style("fill", "#eee");

    var nodesHandle=vis.node.enter().append("g")
        .attr("class","node")
        .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")";});

    //nodesHandle.append("circle")
    //    .attr("fill","none")
    //    .attr("stroke","black")
    //    .attr("stroke-width",2)
    //    .attr("r",function(d){return d.r;});

    nodesHandle.append("image")
        .attr("xlink:href",  function(d) { return d.img;})
        .attr("x", function(d){return -d.r;})
        .attr("y", function(d){return -d.r;})
        .attr("height", function(d){return 2* d.r;})
        .attr("width", function(d){return 2* d.r;});
    //
    //vis.node.enter().append("image")
    //    .attr("class","node")
    //    .attr("height",50)
    //    .attr("width",50)
    //    .attr("xlink:href",  function(d) { return d.img;});
    //
    //circles.append("image")
    //    .attr("xlink:href",  function(d) { return d.img;})
    //    .attr("x", function(d) { return -25;})
    //    .attr("y", function(d) { return -25;})
    //    .attr("height", 50)
    //    .attr("width", 50);




    // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS

    vis.force.on("tick",function(){
        //update node coordinates
        vis.node
            .attr("cx",function(d){ return d.x; })
            .attr("cy",function(d){ return d.y; });

        vis.node
            .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")";});

        //update edge coordinates
        vis.link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    });


    vis.node.call(vis.force.drag);

};


