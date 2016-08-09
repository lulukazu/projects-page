//item navigation
var allData = [];

var currentID="physics";
// Variables for the visualization instances

queue().defer(d3.json,"data/fileNodesAndLinks.json")
    .await(createVis);

var colors={ "physics":'#DDE8E0',
    "projects":'#749CA8',
    "writing":'#F9E0A8',
    "photography":'#D16B54',
    "hobbies":'#8B8378'};

var colors_arr=['#DDE8E0', '#749CA8', '#F9E0A8', '#D16B54', '#8B8378','#DDE8E0', '#749CA8', '#F9E0A8', '#D16B54', '#8B8378'];

function updateNav(id){
    closeNav();
    document.getElementById("nav-button-"+currentID).style['background-color']="";
    document.getElementById("nav-text-"+currentID).style['background-color']="";
    document.getElementById("nav-button-"+id).style['background-color']=colors[id];
    document.getElementById("nav-text-"+id).style['background-color']="rgba(255,255,255,.3)";
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
    updateFiles("content-div",allData,itemID);
}



function updateFiles(parentID,data,itemID) {

    lastDisp=.8;
    //link data
    var parentEl=d3.select("#"+parentID);

    var line=parentEl.append("div")
        .attr("class","div-line")
        .style("width","3px")
        .style("height","100vh")
        .style("background-color","#444")
        .style("position","fixed");

    var nodes = parentEl.selectAll(".node")
        .data(data[itemID],function(d){return d.id;});

    //exit
    nodes.exit()
        .style("opacity", 0).remove();



    //enter
    var divs=nodes.enter()
        .append("div")
        .attr("class","node row");


    divs.attr("style",function(d){
            var randRange=80;
            var leftDisp=Math.random();
            while (Math.abs(lastDisp-leftDisp)<0.4){
                leftDisp=Math.random();
            }
            lastDisp=leftDisp;

            //return "left:"+leftDisp*randRange+"px; top:-1000px; display: hidden;";
            return "left:50px; top:-400px; display: hidden;";
        })
        .transition()
        .duration(1000)
        .attr("style",function(d){
                return "left:50px; top:"+d.num*40+"px; display: inline-flex;";
            })
;

    //window.open('page.html','_newtab')

    divs.append("div")
        .attr("class","dot")
        .style("border",function(d,i){
            return "2px solid "+colors_arr[i];
        })
        .on("mouseover",function(d,i){
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
                .style("border","")
                .style("left","-"+t1+"px")
                .style("top","-"+t1+"px");

        })
        .on("mouseout",function(d,i){
            var w= d.r*2;
            var h= d.r*2;

            var t1= d.r/2;
            var colorhere=colors_arr[i];
            d3.select(this)
                .transition()
                .duration(300)
                .style("background", colorhere)
                .style("width", "20px")
                .style("height","20px")
                .style("border-radius","10px")
                .style("left","0px")
                .style("top","0px");
        })
        .on("click",function(d){
            switch (d.type) {
                case "file":
                    window.open(d.link, '_newtab');
                    break;
                case "video":
                    var src = d.link;
                    var text= d.videotext;
                    modal.style.display = "block";
                    modal.style.width='auto';
                    modal.style.height='auto';
                    $('#myModal iframe').attr('src', src);
                    $('#myModal p').html(text);
                    break;
                case "recipes":
                    modal_recipes.style.display = "block";
                    modal_recipes.style.width='auto';
                    modal_recipes.style.height='auto';
                    queue().defer(d3.csv,"data/recipes_sampled.csv")
                        .defer(d3.json,"data/categories.json")
                        .await(createVisRecipes);
                    break;
                case "page":
                    modal_page.style.display = "block";
                    var container=document.getElementById("modal-container");
                    var img = document.createElement("img");
                    img.src=d.link;
                    img.width=900;
                    img.class="page-image";
                    container.appendChild(img);

                    break;
            }

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
        .attr("class","node-text col-sm-7");



    //modal javascript


}


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementById("span2");
var span3 = document.getElementById("span3");
var modal = document.getElementById('myModal');
var modal_page=document.getElementById('pageModal');
var modal_recipes=document.getElementById('forceModal');
//
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    $('#myModal iframe').removeAttr('src');
    modal.style.display = "none";
};

span2.onclick=function(){
    modal_recipes.style.display = "none";
};

span3.onclick=function(){
    modal_page.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal  || event.target == modal_recipes || event.target==modal_page) {
        modal.style.display = "none";
        modal_recipes.style.display = "none";
        modal_page.style.display="none";
    }
};

