function nav_relocate() {
    var window_top = $(window).scrollTop();
    //console.log(window_top)
    var div_top = $('#nav-anchor').offset().top;
    //console.log(div_top)
    if (window_top > div_top) {
        $('#navigation-horizontal-bar').addClass('stick');
        $('#nav-anchor').height($('#navigation-horizontal-bar').outerHeight());
    } else {
        $('#navigation-horizontal-bar').removeClass('stick');
        $('#nav-anchor').height(0);
    }
}

$(function() {
    $(window).scroll(nav_relocate);
    //console.log("hi")
    nav_relocate();
});


$("#bar-chart-panel").click(function() {
    $('html, body').animate({
        scrollTop: $("#barcharts").offset().top-260
    }, 600);
});
$("#ingredient-chart-panel").click(function() {
    $('html, body').animate({
        scrollTop: $("#barcharts").offset().top-260
    }, 600);
});
$("#map-return-button").click(function() {
    $('html, body').animate({
        scrollTop: $("#nav-anchor").offset().top+10
    }, 600);
});


$("#explore").click(function() {
    $('html, body').animate({
        scrollTop: $("#nav-anchor").offset().top
    }, 600);
});



$("#force-plot-panel").click(function() {
    $('html, body').animate({
        scrollTop: $("#force-layout-controls").offset().top-100
    }, 600);
});




$("#stacked-panel").click(function() {
    $('html, body').animate({
        scrollTop: $("#stacked-area-chart").offset().top-240
    }, 600);
});




SelectedCountry = function(_parentElement, _data1,_data2,_svgWidth,_svgHeight){
    this.parentElement = _parentElement;
    this.mapData = _data1;
    this.country_cuisine=_data2;
    this.svgWidth=_svgWidth;
    this.svgHeight=_svgHeight;
    this.mapCountries= topojson.feature(this.mapData, this.mapData.objects.countries).features;


    this.initVis();
};


SelectedCountry.prototype.initVis = function() {

    var vis = this;

    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};


    vis.width = vis.svgWidth - vis.margin.left - vis.margin.right;
    vis.height = vis.svgHeight - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");




    vis.CountriesByCuisine={};

    for (var country_number in vis.country_cuisine){
        var key=vis.country_cuisine[country_number].cuisine;
        if (key in vis.CountriesByCuisine){
            vis.CountriesByCuisine[key].push(country_number);
        } else {
            vis.CountriesByCuisine[key]=[];
            vis.CountriesByCuisine[key].push(country_number);
        }
            }


vis.wrangleData("all");
};


SelectedCountry.prototype.wrangleData = function(cuisine) {

    var vis = this;

    vis.cuisine=cuisine;


    vis.filteredMapData=vis.mapCountries.filter(function(d){
        var found = $.inArray(d.id.toString(), vis.CountriesByCuisine[cuisine]) > -1;
        return found
    });



    vis.updateVis()

};

SelectedCountry.prototype.updateVis = function() {
var vis=this;


    vis.map_projection = d3.geo.mercator()
        .scale(1)
        .translate([0,0]);

    vis.map_path = d3.geo.path()
        .projection(vis.map_projection);

    function boundingExtent(features) {
        var boundExtent = [[0,0],[0,0]];
        for (var x in features) {
            var thisBounds = vis.map_path.bounds(features[x]);
            boundExtent[0][0] = Math.min(thisBounds[0][0],boundExtent[0][0]);
            boundExtent[0][1] = Math.min(thisBounds[0][1],boundExtent[0][1]);
            boundExtent[1][0] = Math.max(thisBounds[1][0],boundExtent[1][0]);
            boundExtent[1][1] = Math.max(thisBounds[1][1],boundExtent[1][1]);
        }
        return boundExtent;
    }


    var b=boundingExtent(vis.filteredMapData);

    b.s = b[0][1]; b.n = b[1][1];
    b.w = b[0][0]; b.e = b[1][0];
    b.height = Math.abs(b.n - b.s);

    b.width = Math.abs(b.e - b.w);
    b.mid=(b.w+ b.e)/2;
    var s = 1 / Math.max(b.width / vis.width, b.height / vis.height);
    var t = [(vis.width - s * (b.w + b.e)) / 2, (vis.height - s * (b.n + b.s)) / 2];

    var lookupTable={};

    lookupTable.all={};
    lookupTable.all.s=190;
    lookupTable.all.t=[10,140];
    lookupTable.Mediterranean={};
    lookupTable.Mediterranean.s=190;
    lookupTable.Mediterranean.t=[-30,180];
    lookupTable.American={};
    lookupTable.American.s=70;
    lookupTable.American.t=[220,135];
    lookupTable.Canadian={};
    lookupTable.Canadian.s=50;
    lookupTable.Canadian.t=[155,140];
    lookupTable.Mexican={};
    lookupTable.Mexican.s=160;
    lookupTable.Mexican.t=[370,120];
    lookupTable.Caribbeans={};
    lookupTable.Caribbeans.s=250;
    lookupTable.Caribbeans.t=[390,160];
    lookupTable.South_American={};
    lookupTable.South_American.s=79;
    lookupTable.South_American.t=[150,17];
    lookupTable.British={};
    lookupTable.British.s=220;
    lookupTable.British.t=[87,300];
    lookupTable.West_African={};
    lookupTable.West_African.s=221;
    lookupTable.West_African.t=[73,110];
    lookupTable.North_African={};
    lookupTable.North_African.s=148;
    lookupTable.North_African.t=[44,117];
    lookupTable.East_African={};
    lookupTable.East_African.s=156;
    lookupTable.East_African.t=[-8,67];
    lookupTable.South_African={};
    lookupTable.South_African.s=169;
    lookupTable.South_African.t=[0,-20];
    lookupTable.Portuguese_Spanish={};
    lookupTable.Portuguese_Spanish.s=280;
    lookupTable.Portuguese_Spanish.t=[85,270];
    lookupTable.Italian={};
    lookupTable.Italian.s=280;
    lookupTable.Italian.t=[20,270];
    lookupTable.West_European={};
    lookupTable.West_European.s=280;
    lookupTable.West_European.t=[20,330];
    lookupTable.East_European={};
    lookupTable.East_European.s=40;
    lookupTable.East_European.t=[0,103];
    lookupTable.Scandinavian={};
    lookupTable.Scandinavian.s=120;
    lookupTable.Scandinavian.t=[20,230];
    lookupTable.Middle_Eastern={};
    lookupTable.Middle_Eastern.s=160;
    lookupTable.Middle_Eastern.t=[-80,150];
    lookupTable.South_Asian={};
    lookupTable.South_Asian.s=160;
    lookupTable.South_Asian.t=[-140,140];
    lookupTable.Indian={};
    lookupTable.Indian.s=160;
    lookupTable.Indian.t=[-150,115];
    lookupTable.Chinese={};
    lookupTable.Chinese.s=120;
    lookupTable.Chinese.t=[-150,130];
    lookupTable.Southeast_Asian={};
    lookupTable.Southeast_Asian.s=120;
    lookupTable.Southeast_Asian.t=[-160,70];
    lookupTable.Korean={};
    lookupTable.Korean.s=240;
    lookupTable.Korean.t=[-470,200];
    lookupTable.Japanese={};
    lookupTable.Japanese.s=240;
    lookupTable.Japanese.t=[-500,230];
    lookupTable.French={};
    lookupTable.French.s=280;
    lookupTable.French.t=[60,315];


    if (vis.cuisine in lookupTable){
    vis.map_projection
        .translate(lookupTable[vis.cuisine].t)
        .scale(lookupTable[vis.cuisine].s);
} else {

    vis.map_projection
        .translate(t)
        .scale(s);
}


    vis.map_path_zoomed = d3.geo.path()
        .projection(vis.map_projection);


    vis.countries=vis.svg.selectAll(".selected-countries-on-map")
        .data(vis.filteredMapData,function(d){return d.id;});

    vis.countries.exit().remove();


    vis.countries.enter().insert("path", ".graticule")
        .attr("class", "selected-countries-on-map")
        .attr("stroke","#fff")
        .attr("fill","#8A9DA4")
        .attr("stroke-width",1);

    vis.countries
        .attr("d", vis.map_path_zoomed);


    vis.cuisinePrintOut=d3.select("#selected-country").select("p").attr("id","selected-country-text");
    vis.cuisinePrintOut.html("Cuisine: <br>");

    vis.cuisinePrintOut.append("em")
        .html(vis.cuisine.replace(/_/g, ' '));


};