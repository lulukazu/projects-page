//item navigation
var allData = [];

var currentID="physics";
// Variables for the visualization instances

queue().defer(d3.json,"data/fileNodesAndLinks.json")
    .await(createVis);



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



function createVis(error,data1) {
    // Create an object instance
    allData=data1;
}

function wrangleData(itemID){
    console.log(allData)
    updateFiles("content-div",allData,itemID);
}



function updateFiles(parentID,data,itemID) {

    lastDisp=.8;
    //link data
    var parentEl=d3.select("#"+parentID);
    var nodes = parentEl.selectAll(".node")
        .data(data[itemID],function(d){return d.id;});

    //exit
    nodes.exit().remove();

    //enter
    var divs=nodes.enter().append("div")
        .attr("class","node row")
        .attr("style",function(d){
            var randRange=80;
            var leftDisp=Math.random();
            while (Math.abs(lastDisp-leftDisp)<0.4){
                leftDisp=Math.random();
            }
            lastDisp=leftDisp;

            return "left:"+leftDisp*randRange+"px; top:"+d.num*40+"px;";
        });

    var links=divs.append("a")
        .attr("href",function(d){return d.link;})
        .attr("target","new");

    links.append("div")
        .attr("class","dot")
        .on("mouseover",function(d){
            var w= d.r*2;
            var h= d.r*2;
            var w2=w*1.2;

            var t1= d.r/2;
            var offsets =$(this).offset();
            var top = offsets.top- d.r;
            var left = offsets.left- d.r;
            d3.select(this)
                .style("background", "url("+ d.img+") no-repeat")
                .style("background-size",w2+"px")
                .transition()
                .duration(400)
                .style("width", w+"px")
                .style("height",w+"px")
                .style("border-radius", d.r+"px")
                .style("left","-"+t1+"px")
                .style("top","-"+t1+"px");

        })
        .on("mouseout",function(d){
            var w= d.r*2;
            var h= d.r*2;

            var t1= d.r/2;

            d3.select(this)
                .transition()
                .duration(300)
                .style("background", "#ccc")
                .style("width", "20px")
                .style("height","20px")
                .style("border-radius","10px")
                .style("left","0px")
                .style("top","0px");
        });


    divs.append("img")
        .attr("src",function(d){return d.img;})
        .attr("class","node-image col-sm-5")
        .attr("style",function(d) {
            return "height:"+2*d.r+"px; " +"width:"+ 2*d.r+"px";});

    divs.append("div")
        .html(function(d){
            return d.text;
        })
        .attr("class","node-text col-sm-7")



    //modal javascript

    var modal = document.getElementById('myModal');

// Get the button that opens the modal
    var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    };

// When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

