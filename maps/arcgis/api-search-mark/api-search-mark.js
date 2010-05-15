
      dojo.require("esri.map");
      dojo.require("esri.tasks.query");
    
      dojo.require("dojo.data.ItemFileReadStore");
      var map, queryTask, query;
      var symbol, infoTemplate, symbol1;
      var grid, store;
      var Attribute = null;
      var gam = null;
      var queryTask, queryTask1; ;
      var features=[];
      function init() {          
		map = new esri.Map("mapDiv");
		//create and add new layer
		var layer = new esri.layers.ArcGISDynamicMapServiceLayer("http://124.153.103.146/ArcGIS/rest/services/IJ/MapServer");
		map.addLayer(layer);
		       
		document.getElementById('s1').checked=true;
		document.getElementById('parm1').disabled=true;
		queryTask = new esri.tasks.QueryTask("http://124.153.103.146/ArcGIS/rest/services/IJ/MapServer/29");
	 
		//build query filter
		query = new esri.tasks.Query();
		query.returnGeometry = true;
		query.outFields = ["OBJECTID","LOCALITY", "BLDGROAD","PIN"];
	 	symbol = new esri.symbol.PictureMarkerSymbol('http://10.10.10.133/JSAPI/button-06.png', 22, 22);

		//Mark My Location
		queryTask1 = new esri.tasks.QueryTask("http://124.153.103.146/ArcGIS/rest/services/IJ/MapServer/10");


	    
		//build query filter
		query1 = new esri.tasks.Query();
		query1.outSpatialReference = new esri.SpatialReference({ wkid: 4326 });
		query1.returnGeometry = true;
		query1.outFields = ["ID_1", "AC_NO_", "AC_NAME", "PB_ST", "BBMP_WARD_", "BBMP_WARD", "PS_NAME", "ERO_Con_No", "PINCODE", "ERO_Addres", "PART_NO", "BBMP_PBNO_", "OLD_B_NO_", "PC_NO"];
		infoTemplate1 = new esri.InfoTemplate("${ID_1}", "<b>AC NO:</b> ${AC_NO_}<br/> AC Name: ${AC_NAME}<br/ >Location: ${PB_ST}<br/>Ward No: ${BBMP_WARD_}<br/>Ward Name: ${BBMP_WARD}<br/>PS Name: ${PS_NAME}<br/>ERO Contact No: ${ERO_Con_No}<br/>Pin Code: ${PINCODE} <br/>ERO Address: ${ERO_Addres} <br/>Part No: ${PART_NO} <br/>       <br/>New Part No: ${BBMP_PBNO_} <br/>          <br/>Old Part No: ${OLD_B_NO_} <br/>               PC NO: ${PC_NO}");

		symbol1 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.5]));
		dojo.connect(map, "onClick", addPoint);

       
        
      }

      function executeQueryTask() {
      //debugger
        //onClick event returns the evt point where the user clicked on the map.
        //This is contains the mapPoint (esri.geometry.point) and the screenPoint (pixel xy where the user clicked).
        //set query geometry = to evt.mapPoint Geometry
        //query.geometry = evt.mapPoint;
          var Locality=null;
          var pinCode = null
          var road = null;
          var query1 = "";
          if(document.getElementById('s1').checked==true)
          {
          if (document.getElementById('locality').value != "") {
              if (query1 != "")
                  query1 = query1 + " AND " + "LOCALITY LIKE '%" + document.getElementById('locality').value.toUpperCase() + "%'";          
              else
                  query1 = "LOCALITY LIKE '%" + document.getElementById('locality').value.toUpperCase() + "%'";          
              }
          else {
              query1 = query1 + "";
          }


          if (document.getElementById('pin').value != "") {
          if(query1!="")
              query1 = query1 + " AND " + " PIN=" + document.getElementById('pin').value;
              else
                  query1 = "PIN=" + document.getElementById('pin').value;
          }
          else {
              query1 = query1 + "";
          }
          if (document.getElementById('road').value) {
              if (query1 != "")
                  query1 = query1 + " AND " + "BLDGROAD LIKE '%" + document.getElementById('road').value.toUpperCase() + " %'";
                  else
                      query1 = "BLDGROAD LIKE  '%" + document.getElementById('road').value.toUpperCase() + "%'";
          }
          else {
              query1 = query1 + "";
          }
        }
        else if(document.getElementById('s2').checked==true) {

        if (document.getElementById('landmark').value) {

            if (query1 != "")
                query1 = query1 + " AND " + "LANDMARKNA LIKE  '%" + document.getElementById('landmark').value + "%'";
            else
                query1 = "LANDMARKNA LIKE '%" + document.getElementById('landmark').value + "%'";
        }
        else {
            query1 = query1 + "";
        }


        if (document.getElementById('Area').value) {
            if (query1 != "")
                query1 = query1 + " AND " + "AREA_NAME LIKE '%" + document.getElementById('Area').value + "%'";
            else
                query1 = "AREA_NAME LIKE '%" + document.getElementById('Area').value + "%'";
        }
        else {
            query1 = query1 + "";
        }
        
        
        
        
        
        
        
        }
          query.where = query1;
        //Execute task and call showResults on completion
        queryTask.execute(query, showResults);
      }

      function showResults(featureSet) {
      var zoomExtent;
      var graphic;
        //remove all graphics on the maps graphics layer
        map.graphics.clear();
        //QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the map.

        if (featureSet.features.length == 0) {
            alert("We could not find your serach");
            return;
        }
        
        for (var i=0, il=featureSet.features.length; i<il; i++) {
          //Get the current feature from the featureSet.
          //Feature is a graphic
           graphic = featureSet.features[i];
          if(document.getElementById('s1').checked==true)
          {
          if (zoomExtent == null) {
                     zoomExtent = graphic.geometry.getExtent();
                 }
                 else {
                     zoomExtent = zoomExtent.union(graphic.geometry.getExtent());
                 }
                 }
                 else if(document.getElementById('s2').checked==true)
                 {
                     if (zoomExtent == null) {
                     zoomExtent = new esri.geometry.Extent(graphic.geometry.x-100,graphic.geometry.y-100,graphic.geometry.x+100,graphic.geometry.y+100,map.spatialReference);
                 }
                 else {
                     zoomExtent = zoomExtent.union( new esri.geometry.Extent(graphic.geometry.x-100,graphic.geometry.y-100,graphic.geometry.x+100,graphic.geometry.y+100,map.spatialReference));
                 }
                 }
        }
          var EX = zoomExtent;
           if(document.getElementById('s1').checked==true)
          {
         var location = new esri.geometry.Point(EX.getCenter().x,EX.getCenter().y,map.spatialReference);
         }
          else if(document.getElementById('s2').checked==true)
                 {
                    var location = new esri.geometry.Point(graphic.geometry.x,graphic.geometry.y,map.spatialReference);
                 }
         var egraphic = new esri.Graphic(location, symbol);
         //egraphic.setInfoTemplate(infoTemplate);
         map.graphics.add(egraphic);
         var extentGeom = new esri.geometry.Multipoint(map.spatialReference);
         extentGeom.addPoint(location);
         map.setExtent(zoomExtent);

      }


      function changeSelect(s1)
      {
      if(s1.checked==true)
      {
           document.getElementById('parm').disabled=false;
           document.getElementById('parm1').disabled=true;
           queryTask = new esri.tasks.QueryTask("http://124.153.103.146/ArcGIS/rest/services/IJ/MapServer/29");
            query.outFields = ["OBJECTID","LOCALITY", "BLDGROAD","PIN"];
           }
      }
      
      function changeSelect1(s2)
      {
      if(s2.checked==true)
      {
           document.getElementById('parm1').disabled=false;
           document.getElementById('parm').disabled=true;
           queryTask = new esri.tasks.QueryTask("http://124.153.103.146/ArcGIS/rest/services/IJ/MapServer/7");
            query.outFields = ["LANDMARKNA","AREA_NAME"];
           }
       }








       function addPoint(geometry) {
           gam = null;
           map.graphics.clear(); //Clear Graphic
           clickPoint = geometry.mapPoint;
           map.infoWindow.hide();

           var symbol = new esri.symbol.SimpleMarkerSymbol(
              esri.symbol.SimpleMarkerSymbol.STYLE_DIAMOND, 20,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 1),
                    new dojo.Color([255, 255, 0, 0.5]));
           map.graphics.add(new esri.Graphic(geometry.mapPoint, symbol))//;, attributes));
           gam = geometry.mapPoint;
           executeQueryTask1(geometry);
           
       }



       function executeQueryTask1(evt) {
           query1.geometry = evt.mapPoint;
           queryTask1.execute(query1, showResults1);
       }

       function showResults1(featureSet) {
          // debugger
           Attribute = null;

	if(type=="MarkMyLocation"){
           //QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the map.
           for (var i = 0, il = featureSet.features.length; i < il; i++) {
               //Get the current feature from the featureSet.
               //Feature is a graphic
               var graphic = featureSet.features[i];
               graphic.setSymbol(symbol1);

               //Set the infoTemplate.
               graphic.setInfoTemplate(infoTemplate);


               map.infoWindow.resize(380, 280);
               // SET INFOWINDOW TITLE
               map.infoWindow.setTitle("My Location");



               var content = "<table border='1'>";
               content += "<tr><td><b>Lat</b></td>";
               content += "<td>" + gam.x + "</td></tr>";
               content += "<tr><td><b>Lon</b></td>";
               content += "<td>" + gam.y + "</td></tr>";
               content += "<tr><td><b>P/C No.</b></td>";
               content += "<td>" + graphic.attributes.PC_NO + "</td></tr>";
               
               content += "<tr><td><b>A/C No.</b></td>";
               content += "<td>" + graphic.attributes.AC_NO_ + "</td></tr>";

               content += "<tr><td><b>A/C Name</b></td>";
               content += "<td>" + graphic.attributes.AC_NAME + "</td></tr>";
               
               
               content += "<tr><td><b>Ward No.</b></td>";
               content += "<td>" + graphic.attributes.BBMP_WARD_ + "</td></tr>";
               content += "<tr><td><b>  Ward Name   </b></td>";
               content += "<td>" + graphic.attributes.BBMP_WARD + "</td></tr>";
               content += "<tr><td style='width:150px'><b>Poolin Booth Address</b></td>";
               content += "<td>" + graphic.attributes.PB_ST + "</td></tr>";

               content += "<tr><td><b>  New Part No.   </b></td>";
               content += "<td>" + graphic.attributes.BBMP_PBNO_ + "</td></tr>";

               content += "<tr><td><b>  Old Part No.   </b></td>";
               content += "<td>" + graphic.attributes.OLD_B_NO_ + "</td></tr>";





               content += "<tr><td><b> ERO Address    </b></td>";
               content += "<td>" + graphic.attributes.ERO_Addres + "</td></tr>";
               content += "<tr><td><b> ERO Contact No.    </b></td>";
               content += "<td>" + graphic.attributes.ERO_Con_No + "</td></tr>";
               content += "<tr><td colspan='2'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='btnPHP' type='button' style='Height:30px;width:70px' onclick= 'SaveMyLocation()' value='Save' ></td></tr>";
               content += "</table>";
               Attribute = { "Location": [
                   { "ACNO": graphic.attributes.AC_NO_,       // First element

                       "ACN": graphic.attributes.AC_NAME,
                   
                       "PCNO": graphic.attributes.PC_NO,
                       "EROC": graphic.attributes.ERO_Con_No,
                       "EROA": graphic.attributes.ERO_Addres,
                       "POLB": graphic.attributes.PB_ST,
                       "PANO": graphic.attributes.BBMP_PBNO_,
                       "OPANO": graphic.attributes.OLD_B_NO_,
                       "WNO": graphic.attributes.BBMP_WARD_,
                       "WNAME": graphic.attributes.BBMP_WARD
                   }

                ]
               }



               // SET INFOWINDOW CONTENT
               // map.infoWindow.setContent(gridNode);
               map.infoWindow.setContent(content);
               // SET INFOWINDOW LOCAITON
               var mapPnt = (gam.type == 'point') ? gam : gam.getExtent().getCenter();
               var scrPnt = map.toScreen(mapPnt);
               map.infoWindow.show(scrPnt, map.getInfoWindowAnchor(scrPnt));

               map.setExtent(gam.getExtent());
               //Add graphic to the map graphics layer.
               //  map.graphics.add(graphic);
               //map.setExtent(graphic.geometry.getExtent());
           }



           if (featureSet.features.length == 0) {
               map.infoWindow.hide();
              // var graphic = myev.graphic;
               // SET INFOWINDOW SIZE
               map.infoWindow.resize(250, 120);
               // SET INFOWINDOW TITLE
               map.infoWindow.setTitle("Marker Location");
               // ATTRIBUTE GRID NODE

               var content = "<table border='1'>";
               content += "<tr><td><b>Lat</b></td>";
               content += "<td style='width:250px'>" + gam.x + "</td></tr>";
               content += "<tr><td><b>Lon</b></td>";
               content += "<td>" + gam.y + "</td></tr>";
               content += "<tr><td colspan='2'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='btnPHP' type='button' style='Height:30px;width:70px' onclick= 'SaveAnyLocation()' value='Mark this Location'></td></tr>";
               content += "</table>";
//               var content = "<b>X:</b>" + gam.x + "<br/><br/><b>Y:</b>" + gam.y + "<br/><br/>"
//                + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='btnPHP' type='button' onclick= 'SaveAnyLocation()' value='Save' >";

               map.infoWindow.setContent(content);
               // SET INFOWINDOW LOCAITON
               var mapPnt = (gam.type == 'point') ? gam : gam.getExtent().getCenter();
               var scrPnt = map.toScreen(mapPnt);
               map.infoWindow.show(scrPnt, map.getInfoWindowAnchor(scrPnt));

               map.setExtent(gam.getExtent());

           }
           }//END of type="MarkMyLocation"

	if(type=="MarkAnyLocation"){
               map.infoWindow.hide();
              // var graphic = myev.graphic;
               // SET INFOWINDOW SIZE
               map.infoWindow.resize(250, 120);
               // SET INFOWINDOW TITLE
               map.infoWindow.setTitle("Marker Location");
               // ATTRIBUTE GRID NODE

               var content = "<table border='1'>";
               content += "<tr><td><b>Lat</b></td>";
               content += "<td style='width:250px'>" + gam.x + "</td></tr>";
               content += "<tr><td><b>Lon</b></td>";
               content += "<td>" + gam.y + "</td></tr>";
               content += "<tr><td colspan='2'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='btnPHP' type='button' style='Height:30px;width:70px' onclick= 'SaveAnyLocation()' value='Mark this Location'></td></tr>";
               content += "</table>";
//               var content = "<b>X:</b>" + gam.x + "<br/><br/><b>Y:</b>" + gam.y + "<br/><br/>"
//                + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='btnPHP' type='button' onclick= 'SaveAnyLocation()' value='Save' >";

               map.infoWindow.setContent(content);
               // SET INFOWINDOW LOCAITON
               var mapPnt = (gam.type == 'point') ? gam : gam.getExtent().getCenter();
               var scrPnt = map.toScreen(mapPnt);
               map.infoWindow.show(scrPnt, map.getInfoWindowAnchor(scrPnt));

               map.setExtent(gam.getExtent());

           
	}//END of MarkAnyLocation

           
       }

       function SaveMyLocation() {
           // debugger

           //alert("http://applicationdevp/demo/Event.php?X=" + gam.x + "&Y=" + gam.y + "&ACNO=" + Attribute.Location[0].ACNO + "&ACName=" + Attribute.Location[0].ACN + "&EROC=" + Attribute.Location[0].EROC + "&EROA=" + Attribute.Location[0].EROA + "&POLB=" + Attribute.Location[0].POLB + "&PANO=" + Attribute.Location[0].PANO + "&OPANO=" + Attribute.Location[0].OPANO + "&WNO=" + Attribute.Location[0].WNO + "&WNAME=" + Attribute.Location[0].WNAME);

		if(document.getElementById(field_mapping["mapping"][0]["lat"])){
			document.getElementById(field_mapping["mapping"][0]["lat"]).value=gam.x;
		}
		if(document.getElementById(field_mapping["mapping"][0]["long"])){
			document.getElementById(field_mapping["mapping"][0]["long"]).value=gam.y;
		}
		if(document.getElementById(field_mapping["mapping"][0]["acname"])){
			document.getElementById(field_mapping["mapping"][0]["acname"]).value=Attribute.Location[0].ACN;
		}
		if(document.getElementById(field_mapping["mapping"][0]["acnum"])){
			document.getElementById(field_mapping["mapping"][0]["acnum"]).value=Attribute.Location[0].ACNO;
		}
		if(document.getElementById(field_mapping["mapping"][0]["wardnum"])){
			document.getElementById(field_mapping["mapping"][0]["wardnum"]).value=Attribute.Location[0].WNO;
		}
		if(document.getElementById(field_mapping["mapping"][0]["wardname"])){
			document.getElementById(field_mapping["mapping"][0]["wardname"]).value=Attribute.Location[0].WNAME;
		}
		if(document.getElementById(field_mapping["mapping"][0]["eroc"])){
			document.getElementById(field_mapping["mapping"][0]["eroc"]).value=Attribute.Location[0].EROC;
		}
		if(document.getElementById(field_mapping["mapping"][0]["eroa"])){
			document.getElementById(field_mapping["mapping"][0]["eroa"]).value=Attribute.Location[0].EROA;
		}
		if(document.getElementById(field_mapping["mapping"][0]["polb"])){
			document.getElementById(field_mapping["mapping"][0]["polb"]).value=Attribute.Location[0].POLB;
		}
		if(document.getElementById(field_mapping["mapping"][0]["pano"])){
			document.getElementById(field_mapping["mapping"][0]["pano"]).value=Attribute.Location[0].PANO;
		}

		if(document.getElementById(field_mapping["mapping"][0]["opano"])){
			document.getElementById(field_mapping["mapping"][0]["opano"]).value=Attribute.Location[0].OPANO;
		}

       }



       function SaveAnyLocation() {
           //alert("http://applicationdevp/demo/Event.php?X=" + gam.x + "&Y=" + gam.y);
          // window.open("http://applicationdevp/demo/Event.php?X=" + gam.x + "&Y=" + gam.y);


		if(document.getElementById(field_mapping["mapping"][0]["lat"])){
			document.getElementById(field_mapping["mapping"][0]["lat"]).value=gam.x;
		}
		if(document.getElementById(field_mapping["mapping"][0]["long"])){
			document.getElementById(field_mapping["mapping"][0]["long"]).value=gam.y;
		}

       }
           

       dojo.addOnLoad(init);
