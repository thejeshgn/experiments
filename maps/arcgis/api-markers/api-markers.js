dojo.require("esri.map");
dojo.require("esri.tasks.identify");
dojo.require("dijit.layout.ContentPane");

function janagrahaMapGod(size){

this.mapIds=[];
this.dataIds=[];
this.size=0;
this.add = add;

function add(mapid, dataid){
	mapIds[size]=mapid;
	dataIds[size]=dataid;
	size=size+1;
}

}

function janaagrahaMaps(){

this.divid;
var marker_results;

var map;
var identifyTask;
var identifyParams;
var symbol;
var layer2results;
var layer3results; 
var layer4results;
var toolBar;
var zoomExtent;
this.begin = begin;
this.initialize = initialize;
this.initFunctionality = initFunctionality;
this.graphicsOnClick = graphicsOnClick;
this.markerProcessor= markerProcessor;
this.showId = showId;

function log(x){
	//console.log(this.divid,x);
}

function showId(){
	return divid;
}


function initialize(id,markers) {
	this.divid=id;
	map = null;
	zoomExtent = null;
	identifyTask= null;
	identifyParams= null;
	symbol= null;
	layer2results= null;
	layer3results= null; 
	layer4results= null;
	toolBar = null;
	marker_results = markers;
	log("initialize="+map);
	log(map);
        if (map == null) {	
            document.getElementById(this.divid).style.visibility = 'visible';
            //dojo.addOnLoad(begin);
		this.begin();
        }
    
}

function begin() {
	log('begin='+this.divid);
	map = new esri.Map(this.divid, {});
	//var imageryPrime = new esri.layers.ArcGISTiledMapServiceLayer("http://10.10.10.133/ArcGIS/rest/services/Ij_Final/MapServer");
	//var imageryPrime = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
	var imageryPrime = new esri.layers.ArcGISDynamicMapServiceLayer("http://maps.ijanaagraha.org/ArcGIS/rest/services/IJ/MapServer");
	map.addLayer(imageryPrime);
	esriConfig.defaults.map.slider = { left: "10px", top: "0px", width: null, height: "30px" };
	log('begin2='+map);
	dojo.connect(map,"onLoad", initFunctionality);
}




function initFunctionality() {
	log("initFunctionality");	
	dojo.connect(map.graphics, "onClick", graphicsOnClick);
	markerProcessor();
}


    // GRAPHIC ON CLICK
function graphicsOnClick(evt){
 //  debugger
        // GRAPHIC
        var graphic = evt.graphic;
        
        // SET INFOWINDOW SIZE
        map.infoWindow.resize(160, 125);
        // SET INFOWINDOW TITLE
        var titleTemplate = graphic.titleField + ': ${' + graphic.titleField + '}';
        map.infoWindow.setTitle(graphic.attributes.Name);
        // ATTRIBUTE GRID NODE
        var gridNode = dojo.doc.createElement('div');
       var content = "<b> Name:</b>"
        + graphic.attributes.Name + "<br/><b> Description:</b>"
        + graphic.attributes.Description + "<br/>";
	//content = content+"<b>Lat:</b>" + graphic.geometry.x + "<br/><b>Long:</b>" + graphic.geometry.y + "<br/>";
        map.infoWindow.setContent(content);
        
        // SET INFOWINDOW LOCAITON
        var mapPnt = (graphic.geometry.type == 'point') ? graphic.geometry : graphic.geometry.getExtent().getCenter();
        var scrPnt = map.toScreen(mapPnt);
        map.infoWindow.show(scrPnt, map.getInfoWindowAnchor(scrPnt));
       
}


function markerProcessor() {
log("markerProcessor"+marker_results["results"].length);

    for (var i = 0; i<marker_results["results"].length; i++) {
	var attributes = { Name: marker_results["results"][i]["name"], lat: marker_results["results"][i]["lat"],lon: marker_results["results"][i]["long"], Description: marker_results["results"][i]["desc"] };

		log("Adding= lat="+marker_results["results"][i]["lat"]+",lon="+marker_results["results"][i]["long"]);

		var location = new esri.geometry.Point(marker_results["results"][i]["lat"], marker_results["results"][i]["long"]);
		var markerSymbol = new esri.symbol.PictureMarkerSymbol('button-06.gif', 22, 22);
		var graphic = new esri.Graphic(location, markerSymbol, attributes);
		graphic.titleField = "Event";
		map.graphics.add(graphic);
//alert(map.spatialReference.wkid);
		var extentGeom = new esri.geometry.Multipoint(map.spatialReference);
		extentGeom.addPoint(location);
			if (zoomExtent == null) {
				zoomExtent = extentGeom.getExtent();
			}
			else {
				zoomExtent = zoomExtent.union(extentGeom.getExtent());
			}
log("zoomExtent="+zoomExtent);
	log("next");
	}
log("done");
map.setExtent(zoomExtent);
}

}

            
